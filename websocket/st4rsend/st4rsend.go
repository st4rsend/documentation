package st4rsend

import (
	// io needed for EOF error generation
	"io"
	"fmt"
	"log"
	"strconv"
	"time"
	"golang.org/x/net/websocket"
	"crypto/tls"
	 "github.com/go-sql-driver/mysql"
	 "database/sql"
)

// st4rsend reserved variables:
// ErrorLevel

// Global error management
// Purpose is defining global error verbosity for non managed errors
// Hence standard error handling to be performed before call to CheckErr
var ErrorLevel string = "log"
func CheckErr(err error) (ret error){
	if err != nil {
		if err.Error() == "EOF" {
			return err
		}
		if driverErr, ok := err.(*mysql.MySQLError); ok {
			// Table does not exist
			if driverErr.Number == 1146 {
				return err
			}
			// Column does not exist
			if driverErr.Number == 1054 {
				return err
			}
		}
		if ErrorLevel == "panic" {
			panic(err)
		}
		if ErrorLevel == "log" {
			log.Fatal(err)
		}
	}
	return err
}

// Date & Time standard NUX time.h like
// TO Golang time: 
//	 timeVar = time.Unix(WsMessage.Time.SecSinceEpoch, WsMessage.Time.NanoSec)
// From Golang time: 
//	TimeStamp{
//		SecSinceEpoch: time.Unix(),
//		NanoSec: int64(time.Nanosecond())
//	}
type TimeStamp struct {
	SecSinceEpoch int64 `json:"secsinceepoch, string, omitempty"`
	NanoSec int64 `json:"nanosec, string, omitempty"`
}

// Websocket main 
type WsMessage struct {
	Sequence int64 `json:"sequence, string, omitempty"`
	Time TimeStamp
	Payload ComEncap `json:"payload, omitempty"`
}

// Comm encap
type ComEncap struct {
	ChannelID int64 `json:"channelid, string, omitempty"`
	Domain string `json:"domain, string, omitempty"`
	Command	string `json:"command, string, omitempty"`
	Data []string `json:"data, string, omitempty"`
}
// WsContext definition (adding sequencing functionalities)
type WsContext struct {
	Conn *websocket.Conn
	Sequence int64
	Verbose int64
}

type WsSQLSelect struct{
	Headers []string
	Data [][]string
}

var user = "st4rsend"
var password = "8f4rXdMhRhet3YFS2o4x"
var host = "wp-mariadb"
var database = "st4rsend"
var port int = 3306

func WsDial(origin string, url string) (wsContext WsContext, err error){

//
	config, _ := websocket.NewConfig(url, origin)
	config.TlsConfig = &tls.Config{
		InsecureSkipVerify: true,
		ServerName: "localhost.localdomain",
	}
//
	wsContext.Conn, err = websocket.DialConfig(config)
	CheckErr(err)

	wsContext.Sequence = 0
	wsContext.Verbose = 1
	return wsContext, nil
}

func WsClose(wsContext WsContext) (err error){
	err = wsContext.Conn.Close()
	CheckErr(err)
	return err
}

func sendMessage(wsContext *WsContext, payload *ComEncap) (err error){
	now := time.Now()
	message := WsMessage{
		Sequence: int64(wsContext.Sequence),
		Time: TimeStamp{
			SecSinceEpoch: now.Unix(),
			NanoSec: int64(now.Nanosecond())},
		Payload: *payload}
	err = websocket.JSON.Send(wsContext.Conn, &message)
	CheckErr(err)
	if wsContext.Verbose == 1 {
		fmt.Printf("SRV Returned data: %v\n", message)
	}

	wsContext.Sequence += 1
	return err
}

func WsSendRawSQL(wsContext *WsContext, sqlText *string) (err error){
	comEncap := &ComEncap{
		ChannelID: int64(0),
		Domain: "SQL",
		Command: "REQ_SELECT",
		Data: []string{*sqlText}}
	err = sendMessage(wsContext, comEncap)
	CheckErr(err)
	return err
}

func WsSendCMD(wsContext *WsContext, cmd *string) (err error){
	comEncap := &ComEncap{
		ChannelID: int64(0),
		Domain: "CMD",
		Command: "VERBOSITY",
		Data: []string{*cmd}}
	err = sendMessage(wsContext, comEncap)
	CheckErr(err)
	return err
}

func WsHandler(ws *websocket.Conn) {
	var wsContext WsContext
	wsContext.Conn = ws
	wsContext.Sequence = 0
	wsContext.Verbose = 1
	for {
/*
		if wsContext.Verbose ==1 {
			fmt.Printf("Handler activated\n")
		}
		defer	func() {
			if wsContext.Verbose ==1 {
				fmt.Printf("Handler closed\n");
			}
		}()
*/
		var receivedMessage WsMessage
		err := websocket.JSON.Receive(ws, &receivedMessage)
		if err == nil {
			err = WsSrvParseMsg(&wsContext, &receivedMessage)
			CheckErr(err)
			if err != nil {
				log.Println(err)
			}
			if wsContext.Verbose ==1 {
				fmt.Printf("Received: %v\n", receivedMessage)
			}
		}
		err = CheckErr(err)
		if err != nil && err.Error() == "EOF" {
			if wsContext.Verbose == 1 {
				fmt.Println("EOF")
			}
			break
		}
	}
}

func WsSrvParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	var response *WsSQLSelect
	err = nil
	if message.Payload.Domain == "SQL" {
		if message.Payload.Command == "REQ_SELECT" {
			response, err = processReqSelectSQL(&message.Payload.Data[0])
			CheckErr(err)
			if err != nil {
				return err
			}
			message.Payload.Command = "RESP_SELECT_HEADER"
			message.Payload.Data = response.Headers
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
			message.Payload.Command = "RESP_SELECT_DATA"
			for _, line := range response.Data {
				message.Payload.Data = line
				err = sendMessage(wsContext, &message.Payload)
				CheckErr(err)
			}
			message.Payload.Command = "EOF"
			message.Payload.Data = nil
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
		}
		if message.Payload.Command == "REQ_INSERT" {
			resultSQL, err := processReqInsertSQL(&message.Payload.Data[0])
			CheckErr(err)
			if err != nil {
				return err
			}
			rows, err := resultSQL.RowsAffected()
			lastInsert, err := resultSQL.LastInsertId()
			message.Payload.Command = "RESP_INSERT_DATA"
			message.Payload.Data[0] = fmt.Sprintf("%d",rows)
			message.Payload.Data = append(message.Payload.Data, fmt.Sprintf("%d",lastInsert))
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
			message.Payload.Command = "EOF"
			message.Payload.Data = nil
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
		}

		if message.Payload.Command == "REQ_DELETE" {
			resultSQL, err := processReqDeleteSQL(&message.Payload.Data[0])
			CheckErr(err)
			if err != nil {
				return err
			}
			rows, err := resultSQL.RowsAffected()
			lastInsert, err := resultSQL.LastInsertId()
			message.Payload.Command = "RESP_DELETE_DATA"
			message.Payload.Data[0] = fmt.Sprintf("%d",rows)
			message.Payload.Data = append(message.Payload.Data, fmt.Sprintf("%d",lastInsert))
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
			message.Payload.Command = "EOF"
			message.Payload.Data = nil
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
		}

		if message.Payload.Command == "REQ_UPDATE" {
			resultSQL, err := processReqUpdateSQL(&message.Payload.Data[0])
			CheckErr(err)
			if err != nil {
				return err
			}
			rows, err := resultSQL.RowsAffected()
			message.Payload.Command = "RESP_UPDATE_DATA"
			message.Payload.Data[0] = fmt.Sprintf("%d",rows)
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
			message.Payload.Command = "EOF"
			message.Payload.Data = nil
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
		}
	}
	if message.Payload.Domain == "CMD" {
		if message.Payload.Command == "VERBOSITY" {
			if message.Payload.Data[0] == "VERBOSE ON" {
				wsContext.Verbose = 1
				fmt.Println("VERBOSE MODE ACTIVATED")
			}
			if message.Payload.Data[0] == "VERBOSE OFF" {
				wsContext.Verbose = 0
				fmt.Println("VERBOSE MODE DEACTIVATED")
			}
		}
	}
	return err
}

func WsCltParseMsg(wsContext *WsContext) (str []string, err error) {
	var receivedMessage WsMessage
	err = websocket.JSON.Receive(wsContext.Conn, &receivedMessage)
	CheckErr(err)
	if receivedMessage.Payload.Domain == "SQL" {
		if receivedMessage.Payload.Command == "RESP_SELECT_HEADER" {
			return receivedMessage.Payload.Data, nil
		}
		if receivedMessage.Payload.Command == "RESP_SELECT_DATA" {
			return receivedMessage.Payload.Data, nil
		}
	}
	if receivedMessage.Payload.Domain == "SQL" {
		if receivedMessage.Payload.Command == "EOF" {
			return nil, io.EOF
		}
	}
	return nil, err
}

func ConnectSQL(user string, password string, host string, port int, database string) (db *sql.DB, err error) {
	var dataSource string
	dataSource = user + ":" + password + "@tcp(" + host + ":" + strconv.Itoa(port) + ")/" + database + "?charset=utf8mb4"
	db, err = sql.Open("mysql",dataSource)
	CheckErr(err)
	return db, err
}

func processReqInsertSQL(sqlText *string) (result sql.Result, err error) {
	db, err := ConnectSQL(user, password, host, port, database)
	CheckErr(err)
	defer db.Close()
	result, err = db.Exec(*sqlText)
	CheckErr(err)
	return result, err
}

func processReqUpdateSQL(sqlText *string) (result sql.Result, err error) {
	db, err := ConnectSQL(user, password, host, port, database)
	CheckErr(err)
	defer db.Close()
	result, err = db.Exec(*sqlText)
	CheckErr(err)
	return result, err
}

func processReqDeleteSQL(sqlText *string) (result sql.Result, err error) {
	db, err := ConnectSQL(user, password, host, port, database)
	CheckErr(err)
	defer db.Close()
	result, err = db.Exec(*sqlText)
	CheckErr(err)
	return result, err
}

func processReqSelectSQL(sqlText *string) (*WsSQLSelect, error) {
	var sqlData WsSQLSelect
	db, err := ConnectSQL(user, password, host, port, database)
	CheckErr(err)
	defer db.Close()

	rows, err := db.Query(*sqlText)
	CheckErr(err)
	if err != nil {
		return nil, err
	}

	defer rows.Close()


	sqlData.Headers, err = rows.Columns()
	CheckErr(err)
	for rows.Next() {
		scanArgs := make([]interface{}, len(sqlData.Headers))
		rowValues := make([]string, len(sqlData.Headers))
		rowSQLValues := make([]sql.NullString, len(sqlData.Headers))

		for i := range rowValues {
			scanArgs[i] = &rowSQLValues[i]
		}

		err = rows.Scan(scanArgs...)
		CheckErr(err)
		//TODO FIX this lame SQL null type handling
		// FIRST define websocket data null handling strategy
		// THEN implement accordingly
		for i := range rowSQLValues {
			if rowSQLValues[i].Valid {
				rowValues[i] = rowSQLValues[i].String
			} else {
				//rowValues[i] = "NULL"
				rowValues[i] = ""
			}
		}

		sqlData.Data = append(sqlData.Data, rowValues)
		//fmt.Printf("selectData TMP: %s\n",sqlData.Data)
	}

	//fmt.Printf("selectData: %s\n",sqlData)
	return &sqlData, nil
}


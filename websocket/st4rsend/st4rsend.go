package st4rsend

import (
	// io needed for EOF error generation
	//"io"
	"fmt"
	"log"
	"time"
	"golang.org/x/net/websocket"
	//"crypto/tls"
	"database/sql"
	"github.com/go-sql-driver/mysql"
	"strconv"
)

// st4rsend reserved variables:
// ErrorLevel the higher the more verbose (syslog based ; 0 -> silent ; 7 -> debug)
var ErrorLevel int = 4
// Global error management
// Purpose is defining global error verbosity for non managed errors
// Hence standard error handling to be performed before call to CheckErr
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
		if ErrorLevel > 5 {
			log.Fatal(err)
		}
		if ErrorLevel > 3  {
			panic(err)
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
// WsContext definition 
type WsContext struct {
	Conn *websocket.Conn
	Db *sql.DB
	HandlerIndex int64
	HbtTicker *time.Ticker
	HbtHoldTimeOK bool
	HbtHoldDownTimer *time.Timer
	HbtHoldDownTime int64
	HbtInterval int64
	Sequence int64
	Verbose int
}

type WsSQLSelect struct{
	Headers []string
	Data [][]string
}

// Services
// WebSocket Handler
var handlerIndex int64 = 0

func WsHandler(ws *websocket.Conn) {
	var wsContext WsContext
	var err error

	handlerIndex++

	wsContext.Conn = ws
	wsContext.Sequence = 0
	wsContext.Verbose = ErrorLevel
	wsContext.HandlerIndex = handlerIndex
	wsContext.HbtHoldTimeOK = true
	wsContext.HbtInterval = 3
	wsContext.HbtHoldDownTime = 9

	wsContext.Db, err = ConnectSQL(user, password, host, port, database)
	CheckErr(err)
	defer wsContext.Db.Close()

	err = StartHBTSvc(&wsContext)
	CheckErr(err)
	err = StartHBTHoldDownTimer(&wsContext)
	CheckErr(err)

	if wsContext.Verbose > 4 {
		fmt.Printf("Handler %d activated\n", wsContext.HandlerIndex)
	}
	defer	func() {
		if wsContext.Verbose > 4 {
			fmt.Printf("Handler %d closed\n", wsContext.HandlerIndex);
		}
	}()

	defer StopHBTSvc(&wsContext)
	defer StopHBTHoldDownTimer(&wsContext)

	for {
		var receivedMessage WsMessage
		err := websocket.JSON.Receive(ws, &receivedMessage)
		if err == nil {
			err = WsSrvParseMsg(&wsContext, &receivedMessage)
			CheckErr(err)
			if err != nil {
				log.Printf("Handler level error: %s",err)
			}
			if wsContext.Verbose > 6 {
				fmt.Printf("Received: %v\n", receivedMessage)
			}
		}
		if err != nil && err.Error() == "EOF" {
			if wsContext.Verbose > 4 {
				fmt.Printf("EOF received handler %d\n", wsContext.HandlerIndex)
			}
			break
		}
		CheckErr(err)
		if wsContext.HbtHoldTimeOK == false {
			if wsContext.Verbose > 3 {
				fmt.Printf("Heartbeat receive failure %d\n", wsContext.HandlerIndex)
			}
			break
		}
	}
}

func WsSrvParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if message.Payload.Domain == "SQL" {
		err = WsSrvSQLParseMsg(wsContext, message)
		CheckErr(err)
		if err != nil {
			return err
		}
	}
	if message.Payload.Domain == "DOC" {
		err = WsSrvDocWrapper(wsContext, message)
		CheckErr(err)
		if err != nil {
			return err
		}
	}
	if message.Payload.Domain == "CMD" {
		err = WsSrvCMDParseMsg(wsContext, message)
		CheckErr(err)
		if err != nil {
			return err
		}
	}
	if message.Payload.Domain == "HBT" {
		err = WsSrvHBTParseMsg(wsContext, message)
		CheckErr(err)
		if err != nil {
			return err
		}
	}
	if message.Payload.Domain == "INF" {
		err = WsSrvCMDParseMsg(wsContext, message)
		CheckErr(err)
		if err != nil {
			return err
		}
	}
	return err
}

func WsSrvINFParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	return err
}

func WsSrvCMDParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	if message.Payload.Command == "VERBOSITY" {
		wsContext.Verbose, err = strconv.Atoi(message.Payload.Data[0])
		if wsContext.Verbose > 4 {
			fmt.Printf("Vervosity set to: %d for Handler %d\n", wsContext.Verbose, wsContext.HandlerIndex)
		}
	}
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
	if wsContext.Verbose > 6 {
		fmt.Printf("SRV Returned data: %v\n", message)
	}

	wsContext.Sequence += 1
	return err
}


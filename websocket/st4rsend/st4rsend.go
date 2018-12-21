package st4rsend

import (
	// io needed for EOF error generation
	"io"
	"fmt"
	"log"
	"time"
	"golang.org/x/net/websocket"
	"crypto/tls"
	"github.com/go-sql-driver/mysql"
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
	handlerIndex int64
	Sequence int64
	Verbose int64
}

type WsSQLSelect struct{
	Headers []string
	Data [][]string
}

// Services
//// HeartBeat
func StartHeartBeatSvc(wsContext *WsContext, interval int, holdTime int) (ticker *time.Ticker, err error){
	ticker = time.NewTicker(time.Duration(interval) * time.Second)
	go func() {
		var message WsMessage
		//for t := range ticker.C {
		for range ticker.C {
			message.Payload.ChannelID = 0
			message.Payload.Domain = "HBT"
			message.Payload.Command = "HBTINF"
			message.Payload.Data = nil
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
		}
	}()
	return ticker, nil
}

func StopHeartBeatSvc(ticker *time.Ticker) (err error){
	fmt.Println("Stopping heartbeat")
	ticker.Stop()
	return nil
}

// WebSocket Handler
var handlerIndex int64 = 0
func WsHandler(ws *websocket.Conn) {
	handlerIndex++
	var wsContext WsContext
	var hbtTicker *time.Ticker
	wsContext.Conn = ws
	wsContext.Sequence = 0
	wsContext.Verbose = 1
	wsContext.handlerIndex = handlerIndex

	hbtTicker,_ = StartHeartBeatSvc(&wsContext, 3, 9)

	if wsContext.Verbose ==1 {
		fmt.Printf("Handler %d activated\n", wsContext.handlerIndex)
	}
	defer	func() {
		if wsContext.Verbose ==1 {
			fmt.Printf("Handler %d closed\n", wsContext.handlerIndex);
		}
	}()

	defer StopHeartBeatSvc(hbtTicker)

	for {
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
			fmt.Println("EOF received")
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

func WsSrvHBTParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	if message.Payload.Command == "HBTINF" {
		fmt.Println("Received HBTINF")
	}
	err = nil
	return err
}

func WsSrvINFParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	return err
}

func WsSrvCMDParseMsg(wsContext *WsContext, message *WsMessage) (err error){
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
		//fmt.Printf("SRV Returned data: %v\n", message)
	}

	wsContext.Sequence += 1
	return err
}

// Client helper
func WsDial(origin string, url string) (wsContext WsContext, err error){
	config, _ := websocket.NewConfig(url, origin)
	config.TlsConfig = &tls.Config{
		InsecureSkipVerify: true,
		ServerName: "localhost.localdomain",
	}

	wsContext.Conn, err = websocket.DialConfig(config)
	CheckErr(err)

	wsContext.Sequence = 0
	wsContext.Verbose = 1
	return wsContext, nil
}

// Client helper
func WsClose(wsContext WsContext) (err error){
	err = wsContext.Conn.Close()
	CheckErr(err)
	return err
}
// Client helper
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

// Client helper
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

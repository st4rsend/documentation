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
	hbtTicker *time.Ticker
	hbtHoldTimeOK bool
	hbtHoldDownTimer *time.Timer
	hbtHoldDownTime int64
	hbtInterval int64
	Sequence int64
	Verbose int64
}

type WsSQLSelect struct{
	Headers []string
	Data [][]string
}

// Services
//// HeartBeat(wsContext *WsContext, interval int) (ticker *time.Ticker, e    rr error){

func StartHBTSvc(wsContext *WsContext) (err error){
	wsContext.hbtTicker = time.NewTicker(time.Duration(wsContext.hbtInterval) * time.Second)
	go func() {
		var message WsMessage
		//for t := range ticker.C {
		for range wsContext.hbtTicker.C {
			message.Payload.ChannelID = 0
			message.Payload.Domain = "HBT"
			message.Payload.Command = "HBTINF"
			message.Payload.Data = nil
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
		}
	}()
	return err
}

func StopHBTSvc(wsContext *WsContext) (err error){
	fmt.Println("Stopping heartbeat")
	wsContext.hbtTicker.Stop()
	return nil
}
func StartHBTHoldDownTimer(wsContext *WsContext) (err error){
	wsContext.hbtHoldDownTimer = time.NewTimer(time.Second * time.Duration(wsContext.hbtHoldDownTime))
	go func() {
		<-wsContext.hbtHoldDownTimer.C
		wsContext.hbtHoldTimeOK = false
	}()
	return err
}

func StopHBTHoldDownTimer(wsContext *WsContext) (err error){
	wsContext.hbtHoldDownTimer.Stop()
	return nil
}

// WebSocket Handler
var handlerIndex int64 = 0
func WsHandler(ws *websocket.Conn) {
	var wsContext WsContext
	var err error

	handlerIndex++

	wsContext.Conn = ws
	wsContext.Sequence = 0
	wsContext.Verbose = 1
	wsContext.handlerIndex = handlerIndex
	wsContext.hbtHoldTimeOK = true
	wsContext.hbtInterval = 3
	wsContext.hbtHoldDownTime = 9

	err = StartHBTSvc(&wsContext)
	CheckErr(err)
	err = StartHBTHoldDownTimer(&wsContext)
	CheckErr(err)

	if wsContext.Verbose ==1 {
		fmt.Printf("Handler %d activated\n", wsContext.handlerIndex)
	}
	defer	func() {
		if wsContext.Verbose ==1 {
			fmt.Printf("Handler %d closed\n", wsContext.handlerIndex);
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
		if wsContext.hbtHoldTimeOK == false {
			fmt.Println("Heartbeat receive failure")
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
		//fmt.Println("Received HBTINF")
		StopHBTHoldDownTimer(wsContext)
		StartHBTHoldDownTimer(wsContext)

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

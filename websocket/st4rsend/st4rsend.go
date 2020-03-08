package st4rsend

import (
	// io needed for EOF error generation
	//"io"
	"log"
	"time"
	"net/http"
	//"crypto/tls"
	"database/sql"
	"github.com/go-sql-driver/mysql"
	"github.com/gorilla/websocket"
	"strconv"
	"strings"
	"sync"
)

// st4rsend reserved variables:
// Initial Error Level, the higher the more verbose (syslog based ; 0 -> silent ; 7 -> debug)
var ErrorLevel int = 5
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
		if ErrorLevel > 5  {
			panic(err)
		}
		if ErrorLevel > 3 {
			log.Fatal(err)
		}
	}
	return err
}

// Date & Time standard NUX time.h like
// To Golang time: 
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

// ComEncap return status structure 
type WsStatus struct {
	ReceivedSequence int64
	Level string
	Info	string
}

// WsContext definition 
type WsContext struct {
	mu sync.Mutex
	Conn *websocket.Conn
	Db *sql.DB
	HandlerIndex int64
	Sequence int64
	Verbose int
	SecUserID int64
	SecGroupIDs []int64
	SecToken int64
	Status WsStatus
	hbtTicker *time.Ticker
	hbtHoldTimeOK bool
	hbtHoldDownTimer *time.Timer
	hbtHoldDownTime int64
	hbtInterval int64
	chanWsClosed chan struct{}
	chanWsMessage chan WsMessage
	chanHbtTimeExpired chan struct{}
	chanHbtTimeReset chan struct{}
}

type WsSQLSelect struct{
	Headers []string
	Data [][]string
}

// Services
// WebSocket Handler
// Gorilla websocket upgrader

var handlerIndex int64 = 0
var	userRegisterRateTicker *time.Ticker
var	userLoginRateTicker *time.Ticker

type GlobalConf struct {
	WsPort int
	//	Global rate limiter (milliseconds)
	UserRegisterRate int64
	UserLoginRate int64
}

type specificHandler struct {
	Conf GlobalConf
}

func ServeWS(conf GlobalConf) {
	// Starting rate limiter tickers
	userRegisterRateTicker = time.NewTicker(time.Duration(conf.UserRegisterRate) * time.Millisecond)
	defer userRegisterRateTicker.Stop()
	userLoginRateTicker = time.NewTicker(time.Duration(conf.UserLoginRate) * time.Millisecond)
	defer userLoginRateTicker.Stop()
	// Starting Http handler
	wsPortAscii := "localhost:" + strconv.Itoa(conf.WsPort)
	log.Printf("Configuration: %+v",conf)
	log.Printf("Starting http server on %s\n", wsPortAscii)
	http.Handle("/ws", &specificHandler{Conf: conf})
	err := http.ListenAndServe(wsPortAscii, nil)
	CheckErr(err)


}

var gorillaUpgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
	CheckOrigin:  func(r *http.Request) bool {
		for _, header := range r.Header["Origin"] {
			if strings.Contains(header,"st4rsend.net") {
				return true
			}
		}
		log.Printf("Origin header mismatch, received %v\n", r.Header["Origin"])
		return false
	},
}

func (conf *specificHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	var wsContext WsContext
	var err error

	log.Printf("Limiters: %v\n", conf)

	wsContext.Conn, err = gorillaUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("Gorilla Upgrader error: %v\n", err)
		return
	}

	handlerIndex++

	wsContext.Sequence = 0
	wsContext.Verbose = ErrorLevel
	wsContext.HandlerIndex = handlerIndex
	wsContext.hbtHoldTimeOK = true
	wsContext.hbtInterval = 3
	wsContext.hbtHoldDownTime = 9

	wsContext.Db, err = ConnectSQL(user, password, host, port, database)
	CheckErr(err)
	defer wsContext.Db.Close()

	wsContext.chanWsClosed = make(chan struct{})
	wsContext.chanHbtTimeExpired = make(chan struct{})
	wsContext.chanHbtTimeReset = make(chan struct{})
	wsContext.chanWsMessage = make(chan WsMessage, 10)

	err = StartHBTSvc(&wsContext)
	CheckErr(err)
	err = StartHBTHoldDownTimer(&wsContext)
	CheckErr(err)

	if wsContext.Verbose > 4 {
		log.Printf("Handler %d, Activated\n", wsContext.HandlerIndex)
	}
	defer	func() {
		if wsContext.Verbose > 4 {
			log.Printf("Handler %d, Closed\n", wsContext.HandlerIndex);
		}
	}()

	defer StopHBTSvc(&wsContext)

	go func() {
		for {
			var receivedMessage WsMessage
			err := wsContext.Conn.ReadJSON(&receivedMessage)
			if err != nil {
				wsContext.hbtTicker.Stop() // TODO: fix defer call to StopHBTSvc closing ticker too late
				if websocket.IsCloseError(err, 1001) {
					if wsContext.Verbose > 4 {
						log.Printf("Handler %d, Websocket code 1001 (going away)\n", wsContext.HandlerIndex)
					}
					wsContext.chanWsClosed <- struct{}{}
					break
				}
				if websocket.IsCloseError(err, 1005) {
					if wsContext.Verbose > 4 {
						log.Printf("Handler %d, Websocket code 1005 (closed by client)\n", wsContext.HandlerIndex)
					}
					wsContext.chanWsClosed <- struct{}{}
					break
				}
				if websocket.IsCloseError(err, 1006) {
					if wsContext.Verbose > 4 {
						log.Printf("Handler %d, Websocket code 1006 (abnormal closure)\n", wsContext.HandlerIndex)
					}
					wsContext.chanWsClosed <- struct{}{}
					break
				}
				if websocket.IsUnexpectedCloseError(err, 1001, 1005, 1006) {
					if wsContext.Verbose > 4 {
						log.Printf("Handler %d, Error WebSocket Unexpected close error code %v\nTODO: NEW close error case to be handled\n", wsContext.HandlerIndex, err)
					}
					wsContext.chanWsClosed <- struct{}{}
					break
				}
			}
			wsContext.chanWsMessage <- receivedMessage
		}
	}()
	loop:
	for {
		select {
			case <-wsContext.chanWsClosed:
				break loop
			case <-wsContext.chanHbtTimeExpired:
				if wsContext.Verbose > 4 {
					log.Printf("Handler %d, HeartBeat HoldDown Timer Expired\n", wsContext.HandlerIndex)
					break loop
				}
			case receivedMessage := <-wsContext.chanWsMessage:
				err := WsSrvParseMsg(&wsContext, &receivedMessage)
				CheckErr(err)
				if wsContext.Status.Level != "NONE" {
					err = sendStatus(&wsContext, &receivedMessage)
					if err != nil {
						log.Printf("Handler %d, Error sending status: %v", wsContext.HandlerIndex, err)
					}
				}
				if err != nil {
					log.Printf("Handler %d, Error WsSrvparseMsg: %v", wsContext.HandlerIndex, err)
				}
				if wsContext.Verbose > 6 {
					log.Printf("Handler %d, Received: %v\n", wsContext.HandlerIndex, receivedMessage)
				}
		}
	}
}


func WsSrvParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	wsContext.Status.ReceivedSequence = message.Sequence
	wsContext.Status.Level = "NONE"
	wsContext.Status.Info = ""
	if message.Payload.Domain == "SQL" {
		err = WsSrvSQLParseMsg(wsContext, message)
		CheckErr(err)
		if err != nil {
			return err
		}
	}
	if message.Payload.Domain == "TODO" {
		err = WsSrvTodoWrapper(wsContext, message)
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
	if message.Payload.Domain == "SEC" {
		err = WsSrvSecParseMsg(wsContext, message)
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
		wsContext.mu.Lock()
		defer wsContext.mu.Unlock()
		wsContext.Verbose, err = strconv.Atoi(message.Payload.Data[0])
		if wsContext.Verbose > 4 {
			log.Printf("Vervosity set to: %d for Handler %d\n", wsContext.Verbose, wsContext.HandlerIndex)
		}
	}
	return err
}

func sendMessage(wsContext *WsContext, payload *ComEncap) (err error){
	now := time.Now()
	wsContext.mu.Lock()
	defer wsContext.mu.Unlock()
	message := WsMessage{
		Sequence: int64(wsContext.Sequence),
		Time: TimeStamp{
			SecSinceEpoch: now.Unix(),
			NanoSec: int64(now.Nanosecond())},
		Payload: *payload}
	wsContext.Sequence += 1
	err = wsContext.Conn.WriteJSON(&message)
	CheckErr(err)
	if wsContext.Verbose > 6 {
		log.Printf("Sending: %v\n", message)
	}

	return err
}

func sendStatus(wsContext *WsContext, message *WsMessage) (err error){
	message.Payload.ChannelID = 0
	message.Payload.Domain = "INF"
	message.Payload.Command = "APP_CTRL"
	message.Payload.Data = make ([]string, 3)
	message.Payload.Data[0] = strconv.FormatInt(wsContext.Status.ReceivedSequence, 10)
	message.Payload.Data[1] = wsContext.Status.Level
	message.Payload.Data[2] = wsContext.Status.Info
	err = sendMessage(wsContext, &message.Payload)
	CheckErr(err)
	log.Printf("Send status : %v\n", message.Payload)
	return err
}

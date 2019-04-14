package st4rsend
import(
	"time"
	"fmt"
)

func WsSrvHBTParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	if message.Payload.Command == "HBTINF" {
		if wsContext.Verbose > 5 {
			fmt.Printf("Received HeartBeat handler %d\n", wsContext.handlerIndex)
		}
		StopHBTHoldDownTimer(wsContext)
		StartHBTHoldDownTimer(wsContext)
	}
	err = nil
	return err
}

//// HeartBeat(wsContext *WsContext, interval int) (ticker *time.Ticker, err error){

func StartHBTSvc(wsContext *WsContext) (err error){
	wsContext.hbtTicker = time.NewTicker(time.Duration(wsContext.hbtInterval) * time.Second)
	if wsContext.Verbose > 5 {
		fmt.Printf("Starting HeartBeat handler %d\n", wsContext.handlerIndex)
	}
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
	if wsContext.Verbose > 5 {
		fmt.Printf("Stopping HeartBeat handler %d\n", wsContext.handlerIndex)
	}
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

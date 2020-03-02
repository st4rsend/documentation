package st4rsend
import(
	"time"
	"log"
)

func WsSrvHBTParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	if message.Payload.Command == "HBTINF" {
		if wsContext.Verbose > 6 {
			log.Printf("Received HeartBeat handler %d\n", wsContext.HandlerIndex)
		}
		StopHBTHoldDownTimer(wsContext)
		StartHBTHoldDownTimer(wsContext)
	}
	err = nil
	return err
}

//// HeartBeat(wsContext *WsContext, interval int) (ticker *time.Ticker, err error){

func StartHBTSvc(wsContext *WsContext) (err error){
	wsContext.HbtTicker = time.NewTicker(time.Duration(wsContext.HbtInterval) * time.Second)
	if wsContext.Verbose > 5 {
		log.Printf("Starting HeartBeat handler %d\n", wsContext.HandlerIndex)
	}
	go func() {
		var message WsMessage
		//for t := range ticker.C {
		for range wsContext.HbtTicker.C {
			message.Payload.ChannelID = 0
			message.Payload.Domain = "HBT"
			message.Payload.Command = "HBTINF"
			message.Payload.Data = nil
			if wsContext.Verbose > 6 {
				log.Printf("Send HeartBeat handler %d\n", wsContext.HandlerIndex)
			}
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
		}
	}()
	var message WsMessage
	message.Payload.ChannelID = 0
	message.Payload.Domain = "HBT"
	message.Payload.Command = "HBTINF"
	message.Payload.Data = nil
	if wsContext.Verbose > 6 {
		log.Printf("Send HeartBeat handler %d\n", wsContext.HandlerIndex)
	}
	err = sendMessage(wsContext, &message.Payload)
	CheckErr(err)
	return err
}

func StopHBTSvc(wsContext *WsContext) (err error){
	if wsContext.Verbose > 5 {
		log.Printf("Stopping HeartBeat handler %d\n", wsContext.HandlerIndex)
	}
	wsContext.HbtTicker.Stop()
	return nil
}

func StartHBTHoldDownTimer(wsContext *WsContext) (err error){
	wsContext.HbtHoldDownTimer = time.NewTimer(time.Second * time.Duration(wsContext.HbtHoldDownTime))
	wsContext.hbtWg.Add(1)
	go func() {
		//wsContext.hbtMutex.RLock()
		<-wsContext.HbtHoldDownTimer.C
		wsContext.hbtWg.Done()
		wsContext.HbtHoldTimeOK = false
		//wsContext.hbtMutex.RUnlock()
	}()
	//wsContext.hbtWg.Wait()
	return err
}

func StopHBTHoldDownTimer(wsContext *WsContext) (err error){
	wsContext.HbtHoldDownTimer.Stop()
	return nil
}

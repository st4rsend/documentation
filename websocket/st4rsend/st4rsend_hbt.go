package st4rsend
import(
	"time"
	"log"
)

func WsSrvHBTParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	if message.Payload.Command == "HBTINF" {
		if wsContext.Verbose > 6 {
			log.Printf("Handler %d, Received HeartBeat\n", wsContext.HandlerIndex)
		}
		wsContext.chanHbtTimeReset<- struct{}{}
	}
	err = nil
	return err
}

func StartHBTSvc(wsContext *WsContext) (err error){
	wsContext.hbtTicker = time.NewTicker(time.Duration(wsContext.hbtInterval) * time.Second)
	if wsContext.Verbose > 5 {
		log.Printf("Handler %d, Starting HeartBeat\n", wsContext.HandlerIndex)
	}
	go func() {
		var message WsMessage
		for range wsContext.hbtTicker.C {
			message.Payload.ChannelID = 0
			message.Payload.Domain = "HBT"
			message.Payload.Command = "HBTINF"
			message.Payload.Data = nil
			wsContext.mu.Lock()
			if wsContext.Verbose > 5 {
				log.Printf("Handler %d, Send HeartBeat\n", wsContext.HandlerIndex)
			}
			wsContext.mu.Unlock()
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
		}
	}()
	var message WsMessage
	message.Payload.ChannelID = 0
	message.Payload.Domain = "HBT"
	message.Payload.Command = "HBTINF"
	message.Payload.Data = nil
	if wsContext.Verbose > 5 {
		log.Printf("Handler %d, Send HeartBeat\n", wsContext.HandlerIndex)
	}
	err = sendMessage(wsContext, &message.Payload)
	CheckErr(err)
	return err
}

func StopHBTSvc(wsContext *WsContext) (err error){
	if wsContext.Verbose > 5 {
		log.Printf("Handler %d, Stopping HeartBeat\n", wsContext.HandlerIndex)
	}
	wsContext.hbtTicker.Stop()
	return nil
}

func StartHBTHoldDownTimer(wsContext *WsContext) (err error){
	go func() {
		hbtHoldDownTimer := time.NewTimer(time.Second * time.Duration(wsContext.hbtHoldDownTime))
		loopHbt:
		for {
			select {
				case <-hbtHoldDownTimer.C:
					wsContext.chanHbtTimeExpired <- struct{}{}
					break loopHbt
				case <-wsContext.chanHbtTimeReset:
					hbtHoldDownTimer.Stop()
					hbtHoldDownTimer = time.NewTimer(time.Second * time.Duration(wsContext.hbtHoldDownTime))
			}
		}
	}()
	return err
}

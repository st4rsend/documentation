package main

import (
	"log"
	"st4rsend"
	"fmt"
)


func main() {
	st4rsend.ErrorLevel = 5

	var wsContext st4rsend.WsContext
	var err error
	var message string

	wsOrigin := "http://localhost.localdomain/"
	var wsPort int = 443
	//wsUrl := fmt.Sprintf("ws://10.142.0.4:%d/ws",wsPort)
	wsUrl := fmt.Sprintf("wss://dev.st4rsend.net:%d/ws",wsPort)

	log.Printf("Starting websocket client to %s", wsUrl)
	wsContext, err = st4rsend.WsDial(wsOrigin, wsUrl)
	st4rsend.CheckErr(err)

	wsContext.Verbose = 1
	message = "VERBOSE ON"
	err = st4rsend.WsSendCMD(&wsContext, &message)
	st4rsend.CheckErr(err)

	message = "SELECT id,nom FROM test"
	err = st4rsend.WsSendRawSQL(&wsContext, &message)
	st4rsend.CheckErr(err)

	for {
		message, err := st4rsend.WsCltParseMsg(&wsContext)
		st4rsend.CheckErr(err)
		if err != nil && err.Error() == "EOF" {
			if wsContext.Verbose == 1 {
				fmt.Println("EOF")
			}
			break
		}
		fmt.Printf("Received : %v\n", message)
	}

	err = st4rsend.WsClose(wsContext)
	st4rsend.CheckErr(err)
}

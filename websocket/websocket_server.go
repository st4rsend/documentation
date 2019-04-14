package main

import (
	"strconv"
	"log"
	"golang.org/x/net/websocket"
	"net/http"
	"st4rsend"
)

func main() {
	var wsPort int = 8000
	wsPortAscii := "localhost:" + strconv.Itoa(wsPort)
	log.Printf("Starting http server on %s", wsPortAscii)
	http.Handle("/ws", websocket.Handler(st4rsend.WsHandler))
	err := http.ListenAndServe(wsPortAscii, nil)
	st4rsend.CheckErr(err)
}

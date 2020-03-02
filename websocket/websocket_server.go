package main

import (
	"strconv"
	"log"
	"net/http"
	"st4rsend"
)

func main() {
	var wsPort int = 8000
	var globalLimiters = st4rsend.GlobalLimiter{
		UserCreationRate: 10000,
		UserCreationGranted: true,
		UserLoginRate: 1000,
		UserLoginGranted: true,
	}

	wsPortAscii := "localhost:" + strconv.Itoa(wsPort)
	log.Printf("Starting http server on %s\n", wsPortAscii)
	//http.HandleFunc("/ws", st4rsend.WsHandler)
	http.Handle("/ws", &st4rsend.SpecificHandler{Limiter: globalLimiters})
	err := http.ListenAndServe(wsPortAscii, nil)
	st4rsend.CheckErr(err)
}

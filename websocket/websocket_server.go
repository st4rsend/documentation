package main

import (
	"st4rsend"
)

func main() {
	var confWS = st4rsend.GlobalConf{
		WsPort: 8000,
		UserRegisterRate: 30000,
		UserLoginRate: 1000,
	}
	st4rsend.ServeWS(confWS)
}

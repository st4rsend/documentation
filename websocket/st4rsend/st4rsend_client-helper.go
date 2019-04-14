package st4rsend
import (
	"crypto/tls"
	"io"
	//"log"
	"golang.org/x/net/websocket"
)
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

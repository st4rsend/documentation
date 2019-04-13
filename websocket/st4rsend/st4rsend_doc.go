package st4rsend

import (
//	"fmt"
)

func WsSrvDocWrapper(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if message.Payload.Command == "GET_DOC_BY_ID" {
		err = WsSrvGetDocByID(wsContext, message)
	}
	if message.Payload.Command == "GET_DOC_LIST" {
		err = WsSrvGetDocList(wsContext, message)
	}
	CheckErr(err)
	return err
}

func WsSrvGetDocByID(wsContext *WsContext, message *WsMessage) (err error){
	var response *WsSQLSelect
	err = nil
	var sql string
	sql = "select S.ID, T.ID as typeID, T.type, S.position, D.info from documentation_list L left join documentation_set S on L.ID=S.listID left join documentations D on S.docID=D.ID left join documentation_type T on D.typeID=T.ID where L.ID="+ message.Payload.Data[0] +" order by S.position;"
	response, err = processReqSelectSQL(&sql)
	CheckErr(err)

	message.Payload.Command = "RESP_DOC_BY_ID"
	for _, line := range response.Data {
		message.Payload.Data = line
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
	}
	message.Payload.Command = "EOF"
	message.Payload.Data = nil
	err = sendMessage(wsContext, &message.Payload)
	CheckErr(err)
	return err
}

func WsSrvGetDocList(wsContext *WsContext, message *WsMessage) (err error){
	var response *WsSQLSelect
	err = nil
	var sql string
	sql = "select L.ID, L.description from documentation_list L"
	response, err = processReqSelectSQL(&sql)
	CheckErr(err)

	message.Payload.Command ="RESP_DOC_LIST"
	for _, line := range response.Data {
		message.Payload.Data = line
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
	}
	message.Payload.Command = "EOF"
	message.Payload.Data = nil
	err = sendMessage(wsContext, &message.Payload)
	CheckErr(err)
	return err
}

package st4rsend

import (
	"fmt"
	"strconv"
	"context"
	"database/sql"
)

type Doc struct {
	idx string
	position string
	description string
	typeID string
	value string
	childListID sql.NullString
	type2ID string
	value2 string
	child2ListID sql.NullString
	displayID sql.NullString
}

func WsSrvDocWrapper(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if message.Payload.Command == "GET_ARTICLE_BY_ID" {
		err = WsSrvGetArticleByID(wsContext, message)
	}
	if message.Payload.Command == "GET_DOC_BY_ID" {
		err = WsSrvGetDocByID(wsContext, message)
	}
	if message.Payload.Command == "GET_DOC_SHORT_BY_ID" {
		err = WsSrvGetDocShortByID(wsContext, message)
	}
	if message.Payload.Command == "GET_DOC_LIST" {
		err = WsSrvGetDocList(wsContext, message)
	}
	if message.Payload.Command == "GET_DOC_TYPE" {
		err = WsSrvGetDocType(wsContext, message)
	}
	if message.Payload.Command == "INSERT_DOC" {
		err = WsSrvDocInsert(wsContext, message)
	}
	if message.Payload.Command == "UPDATE_DOC" {
		err = WsSrvDocUpdate(wsContext, message)
	}
	if message.Payload.Command == "UPDATE_DOC_POS" {
		err = WsSrvDocUpdatePos(wsContext, message)
	}
	if message.Payload.Command == "UPDATE_LIST_THEME" {
		err = WsSrvDocUpdateListTheme(wsContext, message)
	}
	if message.Payload.Command == "DELETE_ARTICLE_LIST" {
		err = WsSrvDocDeleteArticleList(wsContext, message)
	}
	if message.Payload.Command == "ADD_ARTICLE_LIST" {
		err = WsSrvDocAddArticleList(wsContext, message)
	}
	CheckErr(err)
	return err
}

func WsSrvDocUpdatePos(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if CheckSec(wsContext, "DOC", "WRITE") {
		return err
	}
	var listID string
	var docID string
	var position string
	listID = message.Payload.Data[0]
	docID = message.Payload.Data[1]
	position= message.Payload.Data[2]
	sqlText := "update documentation_set D set position=? where D.listID=? and D.docID=?"
	if (wsContext.Verbose > 4) {
		fmt.Printf("Updating documentation_set\n")
	}
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	_, err = wsContext.Db.ExecContext(localContext,sqlText,
		position,
		listID,
		docID)
	CheckErr(err)
	return err
}

func WsSrvDocDeleteArticleList(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	if CheckSec(wsContext, "DOC", "WRITE") {
		return err
	}

	var listID string
	var docID string

	listID = message.Payload.Data[0]
	docID = message.Payload.Data[1]

	sqlText := "delete from documentation_set where listID=? and docID=?"

	if (wsContext.Verbose > 4) {
		fmt.Printf("Delete from documentation_set \n")
	}
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	_, err = wsContext.Db.ExecContext(localContext,sqlText,
		listID,
		docID)
	CheckErr(err)
	return err
}

func WsSrvDocAddArticleList(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	if CheckSec(wsContext, "DOC", "WRITE") {
		return err
	}
	var listID string
	var docID string

	listID = message.Payload.Data[0]
	docID = message.Payload.Data[1]

	sqlText := "insert into documentation_set (ID, listID, docID) values (0, ?, ?)"

	if (wsContext.Verbose > 4) {
		fmt.Printf("Insert into documentation_set \n")
	}
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	_, err = wsContext.Db.ExecContext(localContext,sqlText,
		listID,
		docID)
	CheckErr(err)
	return err

}

func WsSrvDocUpdateListTheme(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	if CheckSec(wsContext, "DOC", "WRITE") {
		return err
	}
	var listID string
	var themeTargetID sql.NullString
	listID = message.Payload.Data[0]
	themeTargetID.String = message.Payload.Data[1]
	if ( themeTargetID.String == "-1" ) {
		themeTargetID.Valid = false
	} else {
		themeTargetID.Valid = true
	}
	sqlText := "update documentation_list D set themeID=? where D.ID=?"
	if (wsContext.Verbose > 4) {
		fmt.Printf("Updating documentation_list \n")
	}
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	_, err = wsContext.Db.ExecContext(localContext,sqlText,
		themeTargetID,
		listID)
	CheckErr(err)
	return err

}

func WsSrvDocUpdate(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if CheckSec(wsContext, "DOC", "WRITE") {
		return err
	}
	var doc Doc
	var sqlText string
	doc.idx = message.Payload.Data[0]
	doc.description = message.Payload.Data[1]
	doc.typeID = message.Payload.Data[2]
	doc.value = message.Payload.Data[3]
	doc.childListID.String = message.Payload.Data[4]
	doc.type2ID = message.Payload.Data[5]
	doc.value2 = message.Payload.Data[6]
	doc.child2ListID.String = message.Payload.Data[7]
	doc.displayID.String = message.Payload.Data[8]
	sqlText = "update documentations set description=?, typeID=?, info=?, childListID=?, type2ID=?, info2=?, child2ListID=?, displayID=? where ID=?"
	if doc.childListID.String  == "0" {
		doc.childListID.Valid = false
	} else {
		doc.childListID.Valid = true
	}
	if doc.child2ListID.String  == "0" {
		doc.child2ListID.Valid = false
	} else {
		doc.child2ListID.Valid = true
	}
	if doc.displayID.String  == "0" {
		doc.displayID.Valid = false
	} else {
		doc.displayID.Valid = true
	}
	if (wsContext.Verbose > 4) {
		fmt.Printf("\nProcessing SQL Doc update: %+v\n",doc)
	}
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	_, err = wsContext.Db.ExecContext(localContext,sqlText,
		doc.description,
		doc.typeID,
		doc.value,
		doc.childListID,
		doc.type2ID,
		doc.value2,
		doc.child2ListID,
		doc.displayID,
		doc.idx)
	CheckErr(err)
	return err
}

func WsSrvDocInsert(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if CheckSec(wsContext, "DOC", "WRITE") {
		return err
	}
	var doc Doc
	var listID string
	var position string
	var sqlText string
	var sqlResult sql.Result
	doc.description = message.Payload.Data[0]
	doc.typeID = message.Payload.Data[1]
	doc.value = message.Payload.Data[2]
	doc.childListID.String = message.Payload.Data[3]
	doc.type2ID = message.Payload.Data[4]
	doc.value2 = message.Payload.Data[5]
	doc.child2ListID.String = message.Payload.Data[6]
	doc.displayID.String = message.Payload.Data[7]
	listID = message.Payload.Data[8]
	position = message.Payload.Data[9]

	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "insert into documentations (description, typeID, info, childListID, type2ID, info2, child2ListID, displayID) values (?,?,?,?,?,?,?,?)"
	if doc.childListID.String  == "0" {
		doc.childListID.Valid = false
	} else {
		doc.childListID.Valid = true
	}
	if doc.child2ListID.String  == "0" {
		doc.child2ListID.Valid = false
	} else {
		doc.child2ListID.Valid = true
	}
	if doc.displayID.String  == "0" {
		doc.displayID.Valid = false
	} else {
		doc.displayID.Valid = true
	}
	if (wsContext.Verbose > 4) {
		fmt.Printf("Processing SQL documentations Insert\n")
	}
	sqlResult, err = wsContext.Db.ExecContext(localContext,sqlText,
		doc.description,
		doc.typeID,
		doc.value,
		doc.childListID,
		doc.type2ID,
		doc.value2,
		doc.child2ListID,
		doc.displayID)
	CheckErr(err)
	lastID, err := sqlResult.LastInsertId()
	sqlText = "insert into documentation_set (listID, docID, position) values (?,?,?)"
	if (wsContext.Verbose > 4) {
		fmt.Printf("Processing SQL documentation_set\n")
	}
	_, err = wsContext.Db.ExecContext(localContext,sqlText,
		listID,
		strconv.FormatInt(lastID, 10),
		position)
	CheckErr(err)
	return err

}

func WsSrvGetArticleByID(wsContext *WsContext, message *WsMessage) (err error){
	var response *WsSQLSelect
	err = nil
	var sqlText string
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "select D.ID, D.description, T.ID as typeID, T.type, D.info, D.childListID, T2.ID as type2ID, T2.type as type2, D.info2, D.child2LIstID, D.displayID, DSP.display from documentations D left join documentation_type T on D.typeID=T.ID left join documentation_type T2 on D.type2ID=T2.ID left join documentation_display DSP on D.displayID=DSP.ID where D.ID=?"
	rows, err := wsContext.Db.QueryContext(localContext, sqlText,
		message.Payload.Data[0])
	CheckErr(err)
	defer rows.Close()

	response, err = rowsToWsSQLSelect(rows)

	message.Payload.Command = "RESP_ARTICLE_BY_ID"
	for _, line := range response.Data {
		message.Payload.Data = line
		if (wsContext.Verbose > 6) {
			fmt.Printf("Sending SQL data: %v \n", line )
		}
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
	}
	message.Payload.Command = "EOF"
	message.Payload.Data = nil
	err = sendMessage(wsContext, &message.Payload)
	CheckErr(err)
	return err
}

func WsSrvGetDocByID(wsContext *WsContext, message *WsMessage) (err error){
	var response *WsSQLSelect
	err = nil
	var sqlText string
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "select D.ID, S.position, D.description, T.ID as typeID, T.type, D.info, D.childListID, T2.ID as type2ID, T2.type as type2, D.info2, D.child2LIstID, D.displayID, DSP.display from documentation_list L left join documentation_set S on L.ID=S.listID left join documentations D on S.docID=D.ID left join documentation_type T on D.typeID=T.ID left join documentation_type T2 on D.type2ID=T2.ID left join documentation_display DSP on D.displayID=DSP.ID where L.ID=? order by S.position;"
	rows, err := wsContext.Db.QueryContext(localContext, sqlText,
		message.Payload.Data[0])
	CheckErr(err)
	defer rows.Close()

	response, err = rowsToWsSQLSelect(rows)

	message.Payload.Command = "RESP_DOC_BY_ID"
	for _, line := range response.Data {
		message.Payload.Data = line
		if (wsContext.Verbose > 6) {
			fmt.Printf("Sending SQL data: %v \n", line )
		}
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
	}
	message.Payload.Command = "EOF"
	message.Payload.Data = nil
	err = sendMessage(wsContext, &message.Payload)
	CheckErr(err)
	return err
}

func WsSrvGetDocShortByID(wsContext *WsContext, message *WsMessage) (err error){
	var response *WsSQLSelect
	err = nil
	var sqlText string
	var rows *sql.Rows
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	if (message.Payload.Data[0]=="-1") {
		sqlText = "select D.ID, 0 as position, D.description from documentations D where D.ID not in (select docID from documentation_set S)"
		rows, err = wsContext.Db.QueryContext(localContext, sqlText)
	} else {
		sqlText = "select D.ID, S.position, D.description from documentation_list L left join documentation_set S on L.ID=S.listID left join documentations D on S.docID=D.ID where L.ID=? order by S.position;"
		rows, err = wsContext.Db.QueryContext(localContext, sqlText,
		message.Payload.Data[0])
	}
	CheckErr(err)
	defer rows.Close()

	response, err = rowsToWsSQLSelect(rows)

	message.Payload.Command = "RESP_DOC_SHORT_BY_ID"
	for _, line := range response.Data {
		message.Payload.Data = line
		if (wsContext.Verbose > 6) {
			fmt.Printf("Sending SQL data: %v \n", line )
		}
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
	var sqlText string
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "select L.ID, L.description from documentation_list L"
	rows, err := wsContext.Db.QueryContext(localContext, sqlText)
	CheckErr(err)
	defer rows.Close()

	response, err = rowsToWsSQLSelect(rows)

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

func WsSrvGetDocType(wsContext *WsContext, message *WsMessage) (err error){
	var response *WsSQLSelect
	err = nil
	var sqlText string
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "select T.ID, T.type from documentation_type T"
	rows, err := wsContext.Db.QueryContext(localContext, sqlText)
	CheckErr(err)
	defer rows.Close()

	response, err = rowsToWsSQLSelect(rows)

	message.Payload.Command ="RESP_DOC_TYPE"
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

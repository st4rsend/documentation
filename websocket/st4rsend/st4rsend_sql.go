package st4rsend

import (
	"fmt"
	"strconv"
	"database/sql"
)

func WsSrvSQLParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	var response *WsSQLSelect
	err = nil
	if message.Payload.Command == "REQ_SELECT" {
		response, err = processReqSelectSQL(&message.Payload.Data[0])
		CheckErr(err)
		if err != nil {
			return err
		}
		message.Payload.Command = "RESP_SELECT_HEADER"
		message.Payload.Data = response.Headers
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
		message.Payload.Command = "RESP_SELECT_DATA"
		for _, line := range response.Data {
			message.Payload.Data = line
			err = sendMessage(wsContext, &message.Payload)
			CheckErr(err)
		}
		message.Payload.Command = "EOF"
		message.Payload.Data = nil
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
	}
	if message.Payload.Command == "REQ_INSERT" {
		resultSQL, err := processReqInsertSQL(&message.Payload.Data[0])
		CheckErr(err)
		if err != nil {
			return err
		}
		rows, err := resultSQL.RowsAffected()
		lastInsert, err := resultSQL.LastInsertId()
		message.Payload.Command = "RESP_INSERT_DATA"
		message.Payload.Data[0] = fmt.Sprintf("%d",rows)
		message.Payload.Data = append(message.Payload.Data, fmt.Sprintf("%d",lastInsert))
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
		message.Payload.Command = "EOF"
		message.Payload.Data = nil
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
	}

	if message.Payload.Command == "REQ_DELETE" {
		resultSQL, err := processReqDeleteSQL(&message.Payload.Data[0])
		CheckErr(err)
		if err != nil {
			return err
		}
		rows, err := resultSQL.RowsAffected()
		lastInsert, err := resultSQL.LastInsertId()
		message.Payload.Command = "RESP_DELETE_DATA"
		message.Payload.Data[0] = fmt.Sprintf("%d",rows)
		message.Payload.Data = append(message.Payload.Data, fmt.Sprintf("%d",lastInsert))
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
		message.Payload.Command = "EOF"
		message.Payload.Data = nil
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
	}

	if message.Payload.Command == "REQ_UPDATE" {
		resultSQL, err := processReqUpdateSQL(&message.Payload.Data[0])
		CheckErr(err)
		if err != nil {
			return err
		}
		rows, err := resultSQL.RowsAffected()
		message.Payload.Command = "RESP_UPDATE_DATA"
		message.Payload.Data[0] = fmt.Sprintf("%d",rows)
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
		message.Payload.Command = "EOF"
		message.Payload.Data = nil
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
	}
	return err
}


func processReqInsertSQL(sqlText *string) (result sql.Result, err error) {
	db, err := ConnectSQL(user, password, host, port, database)
	CheckErr(err)
	defer db.Close()
	result, err = db.Exec(*sqlText)
	CheckErr(err)
	return result, err
}

func processReqUpdateSQL(sqlText *string) (result sql.Result, err error) {
	db, err := ConnectSQL(user, password, host, port, database)
	CheckErr(err)
	defer db.Close()
	result, err = db.Exec(*sqlText)
	CheckErr(err)
	return result, err
}

func processReqDeleteSQL(sqlText *string) (result sql.Result, err error) {
	db, err := ConnectSQL(user, password, host, port, database)
	CheckErr(err)
	defer db.Close()
	result, err = db.Exec(*sqlText)
	CheckErr(err)
	return result, err
}

func processReqSelectSQL(sqlText *string) (*WsSQLSelect, error) {
	var sqlData WsSQLSelect
	db, err := ConnectSQL(user, password, host, port, database)
	CheckErr(err)
	defer db.Close()

	rows, err := db.Query(*sqlText)
	CheckErr(err)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	sqlData.Headers, err = rows.Columns()
	CheckErr(err)
	for rows.Next() {
		scanArgs := make([]interface{}, len(sqlData.Headers))
		rowValues := make([]string, len(sqlData.Headers))
		rowSQLValues := make([]sql.NullString, len(sqlData.Headers))

		for i := range rowValues {
			scanArgs[i] = &rowSQLValues[i]
		}

		err = rows.Scan(scanArgs...)
		CheckErr(err)
		for i := range rowSQLValues {
			if rowSQLValues[i].Valid {
				rowValues[i] = rowSQLValues[i].String
			} else {
				rowValues[i] = ""
			}
		}

		sqlData.Data = append(sqlData.Data, rowValues)
		//fmt.Printf("selectData TMP: %s\n",sqlData.Data)
	}

	//fmt.Printf("selectData: %s\n",sqlData)
	return &sqlData, nil
}

func ConnectSQL(user string, password string, host string, port int, database string) (db *sql.DB, err error) {
	var dataSource string
	dataSource = user + ":" + password + "@tcp(" + host + ":" + strconv.Itoa(port) + ")/" + database + "?charset=utf8mb4"
	db, err = sql.Open("mysql",dataSource)
	CheckErr(err)
	return db, err
}

// Client helper
func WsSendRawSQL(wsContext *WsContext, sqlText *string) (err error){
	comEncap := &ComEncap{
		ChannelID: int64(1),
		Domain: "SQL",
		Command: "REQ_SELECT",
		Data: []string{*sqlText}}
	err = sendMessage(wsContext, comEncap)
	CheckErr(err)
	return err
}

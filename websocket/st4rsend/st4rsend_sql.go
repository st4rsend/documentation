package st4rsend

import (
	"fmt"
	"regexp"
	"strconv"
	"database/sql"
	"context"
)

type SqlList struct {
	idx string
	position string
	value string
}

func WsSrvSQLParseMsg(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if message.Payload.Command == "GET_LIST" {
		err = WsSrvGetSqlList(wsContext, message)
	}
	if message.Payload.Command == "GET_LIST_FLT" {
		err = WsSrvGetSqlListFlt(wsContext, message)
	}
	if message.Payload.Command == "INSERT_LIST" {
		if granted, err := WsSecSqlInsert(wsContext, message) ; granted {
			err = WsSrvInsertSqlList(wsContext, message)
		} else {
			fmt.Printf("ERROR: Write denied: %v\n", err)
		}
	}
	if message.Payload.Command == "UPDATE_LIST" {
		if granted, _ := WsSecSqlWrite(wsContext, message.Payload.Data[0], message.Payload.Data[4]) ; granted {
			err = WsSrvUpdateSqlList(wsContext, message)
		} else {
			fmt.Printf("ERROR: Write denied: %v\n", err)
		}
	}
	if message.Payload.Command == "DELETE_LIST" {
		if granted, _ := WsSecSqlWrite(wsContext, message.Payload.Data[0], message.Payload.Data[2]) ; granted {
			err = WsSrvDeleteSqlList(wsContext, message)
		} else {
			fmt.Printf("ERROR: Write denied: %v\n", err)
		}
	}
	CheckErr(err)
	return err
}

func WsSecSqlInsert(wsContext *WsContext, message *WsMessage) (bool, error) {
	if wsContext.SecUserID > 0 {
		return true, nil
	} else {
		return false, fmt.Errorf("ERROR:St4rsend:security:uid 0 requested sql insert")
	}
}

func WsSecSqlWrite(wsContext *WsContext, tableName string, idx string) (bool, error) {
	var sqlUserID sql.NullInt64
	var sqlGroupID sql.NullInt64
	var sqlGrants sql.NullInt64
	var secStruct WsSecStruct
	var sqlText = "select secUserID, secGroupID, secGrants from " +
		protectSQL(tableName) +
		" where ID=?"
	localContext := context.Background()
	err := wsContext.Db.PingContext(localContext)
	if CheckErr(err) != nil { return false, err }
	err = wsContext.Db.QueryRowContext(localContext, sqlText, protectSQL(idx)).
		Scan(&sqlUserID, &sqlGroupID, &sqlGrants)
	if err == nil {
		secStruct.secUserID = sqlToWsGrants(sqlUserID)
		secStruct.secGroupID = sqlToWsGrants(sqlGroupID)
		secStruct.secGrants = sqlToWsGrants(sqlGrants)
		granted, err := secWriteGranted(wsContext, &secStruct)
		return granted, err
	} else {
		return false, fmt.Errorf("ERROR:St4rsend:WsSecSqlWrite:row scan error: %w", err)
	}
	return false, err
}

func WsSrvInsertSqlList(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if CheckSec(wsContext, "LISTE", "WRITE") {
		return err
	}
	var sqlText string
	var sqlResult sql.Result
	var table_name = protectSQL(message.Payload.Data[0])
	var column_name = protectSQL(message.Payload.Data[1])
	var position_name = protectSQL(message.Payload.Data[2])
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "insert into " + table_name +
		" (" + column_name + "," +
		position_name + "," +
		"secUserID, secGrants" +
		") values (?,?,?,?) "
	if (wsContext.Verbose > 4) {
		fmt.Printf("Processing SQL list Insert\n")
	}
	sqlResult, err = wsContext.Db.ExecContext(localContext,sqlText,
		message.Payload.Data[3],
		message.Payload.Data[4],
		wsContext.SecUserID,764)
	CheckErr(err)
	if (wsContext.Verbose > 4) {
		fmt.Printf("Processing SQL LIST result: %v\n", sqlResult)
	}
	return err
}

func WsSrvDeleteSqlList(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if CheckSec(wsContext, "LISTE", "WRITE") {
		return err
	}
	var sqlText string
	var sqlResult sql.Result
	var table_name = protectSQL(message.Payload.Data[0])
	var idx_name = protectSQL(message.Payload.Data[1])
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "delete from " + table_name + " where " + idx_name + "=?"
	if (wsContext.Verbose > 4) {
		fmt.Printf("Processing SQL LIST delete\n")
	}
	sqlResult, err = wsContext.Db.ExecContext(localContext,sqlText,
		message.Payload.Data[2])
	CheckErr(err)
	if (wsContext.Verbose > 4) {
		fmt.Printf("SQL LIST delete result: %v\n", sqlResult)
	}

	return err
}

func WsSrvUpdateSqlList(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if CheckSec(wsContext, "LISTE", "WRITE") {
		return err
	}
	var sqlText string
	var sqlResult sql.Result
	var table_name = protectSQL(message.Payload.Data[0])
	var idx_name = protectSQL(message.Payload.Data[1])
	var column_name = protectSQL(message.Payload.Data[2])
	var position_name = protectSQL(message.Payload.Data[3])
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "update " + table_name + " set " + column_name + "=?, " + position_name + "=? where " + idx_name + "=?"
	if (wsContext.Verbose > 4) {
		fmt.Printf("Processing SQL LIST update\n")
	}
	sqlResult, err = wsContext.Db.ExecContext(localContext,sqlText,
		message.Payload.Data[5],
		message.Payload.Data[6],
		message.Payload.Data[4])
	CheckErr(err)
	if (wsContext.Verbose > 4) {
		fmt.Printf("SQL LIST update result: %v\n", sqlResult)
	}
	return err
}

func WsSrvGetSqlList(wsContext *WsContext, message *WsMessage) (err error){
	var response *WsSQLSelect
	err = nil
	var sqlText string
	var table_name = protectSQL(message.Payload.Data[0])
	var idx_name = protectSQL(message.Payload.Data[1])
	var column_name = protectSQL(message.Payload.Data[2])
	var position_name = protectSQL(message.Payload.Data[3])
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "select " + idx_name + "," + column_name + "," + position_name + " from " + table_name + " order by "	+ position_name

	rows, err := wsContext.Db.QueryContext(localContext, sqlText)
	CheckErr(err)
	defer rows.Close()

	response, err = rowsToWsSQLSelect(rows)

	message.Payload.Command = "RESP_SQL_LIST"
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

func WsSrvGetSqlListFlt(wsContext *WsContext, message *WsMessage) (err error){
	var response *WsSQLSelect
	err = nil
	var sqlText string
	var table_name = protectSQL(message.Payload.Data[0])
	var idx_name = protectSQL(message.Payload.Data[1])
	var column_name = protectSQL(message.Payload.Data[2])
	var position_name = protectSQL(message.Payload.Data[3])
	var flt_idx_name = protectSQL(message.Payload.Data[4])
	var flt_idx_value = protectSQL(message.Payload.Data[5])
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	if (flt_idx_value == "") {
		sqlText = "select " + idx_name + "," + column_name + "," + position_name +
			" from " + table_name + " where " + flt_idx_name + " is null" +
			" order by "	+ position_name

	} else {
		sqlText = "select " + idx_name + "," + column_name + "," + position_name +
			" from " + table_name + " where " + flt_idx_name + "=" + flt_idx_value +
			" order by "	+ position_name
	}
	if (wsContext.Verbose > 4) {
		fmt.Printf("ListFK SQLTEXT: %v\n", sqlText)
	}
	rows, err := wsContext.Db.QueryContext(localContext, sqlText)
	CheckErr(err)
	defer rows.Close()

	response, err = rowsToWsSQLSelect(rows)

	message.Payload.Command = "RESP_SQL_LIST"
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

func rowsToWsSQLSelect(rows *sql.Rows ) (*WsSQLSelect, error) {
	var sqlData WsSQLSelect
	var err error
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
	return &sqlData, err
}

func ConnectSQL(user string, password string, host string, port int, database string) (db *sql.DB, err error) {
	var dataSource string
	dataSource = user + ":" + password + "@tcp(" + host + ":" + strconv.Itoa(port) + ")/" + database + "?charset=utf8mb4"
	db, err = sql.Open("mysql",dataSource)
	CheckErr(err)
	return db, err
}

func protectSQL (str string) (string) {
	reg, err := regexp.Compile("[^a-zA-Z0-9_]+")
	CheckErr(err)
	result := reg.ReplaceAllString(str, "")
	return result
}

/* SQL SECURITY WARNING: DANGEROUS 
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
*/

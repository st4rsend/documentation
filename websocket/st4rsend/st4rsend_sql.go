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
	if message.Payload.Command == "INSERT_LIST" {
		err = WsSrvInsertSqlList(wsContext, message)
	}
	if message.Payload.Command == "UPDATE_LIST" {
		err = WsSrvUpdateSqlList(wsContext, message)
	}
	if message.Payload.Command == "DELETE_LIST" {
		err = WsSrvDeleteSqlList(wsContext, message)
	}
	CheckErr(err)
	return err
}

func WsSrvInsertSqlList(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	var sqlText string
	var sqlResult sql.Result
	var table_name = protectSQL(message.Payload.Data[0])
	var column = protectSQL(message.Payload.Data[1])
	var sort = protectSQL(message.Payload.Data[2])
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "insert into " + table_name + " (" + column + "," + sort + ") values (?,?) "
	if (wsContext.Verbose > 4) {
		fmt.Printf("Processing SQL list Insert\n")
	}
	sqlResult, err = wsContext.Db.ExecContext(localContext,sqlText,
		message.Payload.Data[3],
		message.Payload.Data[4])
	CheckErr(err)
	if (wsContext.Verbose > 4) {
		fmt.Printf("Processing SQL LIST result: %v\n", sqlResult)
	}
	return err
}

func WsSrvDeleteSqlList(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
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
	var sqlText string
	var sqlResult sql.Result
	var table_name = protectSQL(message.Payload.Data[0])
	var idx = protectSQL(message.Payload.Data[1])
	var column = protectSQL(message.Payload.Data[2])
	var sort = protectSQL(message.Payload.Data[3])
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "update " + table_name + " set " + column + "=?, " + sort + "=? where " + idx + "=?"
	if (wsContext.Verbose > 4) {
		fmt.Printf("Processing SQL LIST update\n")
	}
	sqlResult, err = wsContext.Db.ExecContext(localContext,sqlText,
		message.Payload.Data[4],
		message.Payload.Data[5])
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
	var idx = protectSQL(message.Payload.Data[1])
	var column = protectSQL(message.Payload.Data[2])
	var sort = protectSQL(message.Payload.Data[3])
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "select " + idx + "," + column + "," + sort + " from " + table_name + " order by "	+ sort

	rows, err := wsContext.Db.QueryContext(localContext, sqlText)
	//rows, err := wsContext.Db.QueryContext(localContext, sqlText, idx, column, sort, sort)
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

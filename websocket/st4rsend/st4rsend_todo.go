package st4rsend

import(
	//"fmt"
	//"strconv"
	"context"
	//"database/sql"
)

func WsSrvTodoWrapper(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if message.Payload.Command == "GET_TODOS" {
		err = WsSrvGetTodos(wsContext, message)
	}
	if message.Payload.Command == "INSERT_TODO" {
		err = WsSrvInsertTodo(wsContext, message)
	}
	if message.Payload.Command == "UPDATE_TODO" {
		err = WsSrvUpdateTodo(wsContext, message)
	}
	if message.Payload.Command == "DELETE_TODO" {
		err = WsSrvDeleteTodo(wsContext, message)
	}
	CheckErr(err)
	return err
}

func WsSrvGetTodos(wsContext *WsContext, message *WsMessage) (err error){
	var response *WsSQLSelect
	err = nil
	var sqlText string
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "select T.ID, U.ID, identity, task, status, date_format(targetDate, '%Y-%m-%d'), date_format(doneDate,'%Y-%m-%d') from todos T left join users U on T.userID = U.ID"
	rows, err := wsContext.Db.QueryContext(localContext, sqlText)
	CheckErr(err)
	defer rows.Close()

	response, err = rowsToWsSQLSelect(rows)

	message.Payload.Command = "RESP_TODOS"
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
func WsSrvInsertTodo(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if CheckSec(wsContext, "TODO", "WRITE") {
		return err
	}
	var sqlText string
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "insert into todos (UserID, task, status, targetDate, doneDate) values(?,?,?,?,?)"
	var status int
	if message.Payload.Data[2]=="true" {
		status = 1
	} else {
		status = 0
	}
	_, err = wsContext.Db.ExecContext(localContext, sqlText,
		message.Payload.Data[0],
		message.Payload.Data[1],
		status,
		message.Payload.Data[3],
		message.Payload.Data[4]	)

	return err
}
func WsSrvUpdateTodo(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if CheckSec(wsContext, "TODO", "WRITE") {
		return err
	}
	var sqlText string
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "update todos set userID=?, task=?, targetDate=?, doneDate=?, status=? where ID=?"
	var status int
	if message.Payload.Data[4]=="true" {
		status = 1
	} else {
		status = 0
	}
	_, err = wsContext.Db.ExecContext(localContext, sqlText,
		message.Payload.Data[0],
		message.Payload.Data[1],
		message.Payload.Data[2],
		message.Payload.Data[3],
		status,
		message.Payload.Data[5])
	CheckErr(err)
	return err
}
func WsSrvDeleteTodo(wsContext *WsContext, message *WsMessage) (err error){
	err = nil
	if CheckSec(wsContext, "TODO", "WRITE") {
		return err
	}
	var sqlText string
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "delete from todos where ID=?"
	_, err = wsContext.Db.ExecContext(localContext, sqlText,message.Payload.Data[0])
	CheckErr(err)
	return err
}

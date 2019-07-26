package st4rsend

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
	//"database/sql"
	"context"
	"strconv"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password),10)
	return string(bytes), err
}
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func WsSrvSecParseMsg(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	if message.Payload.Command == "LOGIN" {
		err = WsSrvSecLogin(wsContext, message)
	}
	if message.Payload.Command == "SET_PWD" {
		err = WsSrvSecSetUserPassword(wsContext, message)
	}
	if message.Payload.Command == "GET_TOKEN" {
		err = WsSrvSecGetToken(wsContext, message)
	}
	if message.Payload.Command == "USR_INFO" {
		err = WsSrvSecGetUserInfo(wsContext, message)
	}
	CheckErr(err)
	return err
}
func WsSrvSecSetUserPassword(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	var sqlText string
	var user = message.Payload.Data[0]
	var password = message.Payload.Data[1]
	hash, err := HashPassword(password)
	CheckErr(err)
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	sqlText = "update users set password='" + hash +
			"' where identity='" + user + "'"
	if (wsContext.Verbose > 4) {
		fmt.Printf("Processing user's password update")
	}
	result, err := wsContext.Db.ExecContext(localContext,sqlText)
	CheckErr(err)
	rows, err := result.RowsAffected()
	CheckErr(err)
	if rows != 1 {
		fmt.Printf("expected single row affected, got %d rows affected\n", rows)
	}

	if (err == nil) {
	//	err = mysqlUpdatePasswordforuser
		fmt.Printf("Hash: %s\n", hash)
		CheckErr(err)
	}
	return err
}

func WsSrvSecLogin(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	var user = message.Payload.Data[0]
	var password = message.Payload.Data[1]
	var hash string
	var firstName string
	var lastName string
	var UID int64
	var sqlText string = "select ID, firstname, lastname, password from users where identity=?"
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	rows, err := wsContext.Db.QueryContext(localContext, sqlText, user)
	CheckErr(err)
	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(&UID, &firstName, &lastName, &hash)
		CheckErr(err)
	}
	if CheckPasswordHash(password, hash) {
		fmt.Printf("LOGIN SUCCESS UID: %d, firstname: %s, lastname: %s\n",
		 UID, firstName, lastName)
		wsContext.SecUserID = UID
	} else {
		wsContext.SecUserID = 0
		fmt.Printf("LOGIN FAILED\n")
	}
	return err
}

func WsSrvSecGetToken(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	fmt.Printf("GetSecToken\n")
	CheckErr(err)
	return err
}
func WsSrvSecGetUserInfo(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	var UID = message.Payload.Data[0]
	var firstName string
	var lastName string
	var sqlText string = "select ID, firstname, lastname from users where ID=?"
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	rows, err := wsContext.Db.QueryContext(localContext, sqlText, UID)
	CheckErr(err)
	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(&UID, &firstName, &lastName)
		CheckErr(err)
	}
	fmt.Printf("GetSecInfo\n")
	fmt.Printf("User ID: %s, name: %s %s\n", UID, firstName, lastName)

	message.Payload.Command = "RESP_USER_INFO"
	message.Payload.Data = nil
	message.Payload.Data = make([]string,3)
	message.Payload.Data[0] = UID
	message.Payload.Data[1] = firstName
	message.Payload.Data[2] = lastName
	err = sendMessage(wsContext, &message.Payload)
	CheckErr(err)


	sqlText = "select G.ID, G.description, G.position from users U left join usergroup UG on U.ID=UG.userID left join groups G on UG.groupID=G.ID where U.ID=?"
	localContext = context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	rowsGroup, err := wsContext.Db.QueryContext(localContext, sqlText, UID)
	CheckErr(err)
	defer rowsGroup.Close()
	var groupID int64
	var groupDescription string
	var groupPosition int64
	for rowsGroup.Next() {
		err = rowsGroup.Scan(&groupID, &groupDescription, &groupPosition)
		CheckErr(err)
		fmt.Printf("Member of group ID: %d, groupName: %s, position %d\n", groupID, groupDescription, groupPosition)
		message.Payload.Command = "RESP_USER_INFO"
		message.Payload.Data[0] = strconv.FormatInt(groupID,10)
		message.Payload.Data[1] = groupDescription
		message.Payload.Data[2] = strconv.FormatInt(groupPosition,10)
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
	//return userinfo then group user is part of 
	}

	message.Payload.Command = "EOF"
	message.Payload.Data = nil
	err = sendMessage(wsContext, &message.Payload)
	return err
}



package st4rsend

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
	//"database/sql"
	"context"
	"strconv"
)

func CheckSec(wsContext *WsContext, domain string, action string) bool {
	if domain == "SECURITY" {
		if action == "WRITE" {
			if wsContext.SecUserID > 0 {
				return false
			}
		}
	}
	if domain == "LISTE" {
		if action == "WRITE" {
			if wsContext.SecUserID > 0 {
				return false
			}
		}
	}
	if domain == "DOC" {
		if action == "WRITE" {
			if wsContext.SecUserID > 0 {
				return false
			}
		}
	}
	if domain == "TODO" {
		if action == "WRITE" {
			if wsContext.SecUserID > 0 {
				return false
			}
		}
	}
	wsContext.Status.Level = "SECURITY"
	wsContext.Status.Info = "Change denied for user " + strconv.FormatInt(wsContext.SecUserID, 10)
	fmt.Printf("change denied\n");
	return true
}

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
	if message.Payload.Command == "LOGOUT" {
		err = WsSrvSecLogout(wsContext, message)
	}
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
	if CheckSec(wsContext, "SECURITY", "WRITE") {
		return err
	}
	var sqlText string
	//var user = message.Payload.Data[0]
	var user = strconv.FormatInt(wsContext.SecUserID, 10)
	var DBHash string
	var oldPassword = message.Payload.Data[0]
	var newPassword = message.Payload.Data[1]
	newHash, err := HashPassword(newPassword)
	CheckErr(err)
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	if (wsContext.Verbose > 4) {
		fmt.Printf("Retrieving password hash for user ID %s", user)
	}
	sqlText = "select password from users where ID=?"
	err = wsContext.Db.QueryRowContext(localContext, sqlText, user).Scan(&DBHash)
	CheckErr(err)

	if CheckPasswordHash(oldPassword, DBHash) {

		sqlText = "update users set password=? where ID=?"
		if (wsContext.Verbose > 4) {
			fmt.Printf("Processing user's password update")
		}
		result, err := wsContext.Db.ExecContext(localContext,sqlText,
			newHash,
			user)
		CheckErr(err)
		rows, err := result.RowsAffected()
		CheckErr(err)
		if rows != 1 {
			fmt.Printf("expected single row affected, got %d rows affected\n", rows)
		}
	} else {
		fmt.Printf("Password change denied\n")
	}
	return err
}

func WsSrvSecLogout(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	wsContext.SecUserID = 0
	if ( wsContext.Verbose > 5 ) {
		fmt.Printf("USER LOGOUT\n")
	}
	return err
}
func WsSrvSecLogin(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	wsContext.SecUserID = 0
	wsContext.SecGroupIDs = nil
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
	message.Payload.Command = "RESP_LOGIN"
	message.Payload.Data = nil
	message.Payload.Data = make([]string,1)
	if CheckPasswordHash(password, hash) {
		if ( wsContext.Verbose > 5 ) {
			fmt.Printf("LOGIN SUCCESS UID: %d, firstname: %s, lastname: %s\n",
				UID, firstName, lastName)
		}
		wsContext.SecUserID = UID
		message.Payload.Data[0] = strconv.FormatInt(UID, 10)
		wsContext.Status.Level = "SECURITY"
		wsContext.Status.Info = "Logged as user ID:  " + strconv.FormatInt(wsContext.SecUserID, 10)
		err = secGroupIDsPopulate(wsContext, UID)
		CheckErr(err)
	} else {
		wsContext.SecUserID = 0
		if ( wsContext.Verbose > 5 ) {
			fmt.Printf("LOGIN FAILED\n")
		}
		wsContext.Status.Level = "SECURITY"
		wsContext.Status.Info = "Login failed"
		message.Payload.Data[0] = "0"
	}
	err = sendMessage(wsContext, &message.Payload)
	message.Payload.Command = "EOF"
	message.Payload.Data = nil
	err = sendMessage(wsContext, &message.Payload)
	fmt.Printf("wscontext GIDs: %v\n", wsContext.SecGroupIDs)
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
	if wsContext.SecUserID == 0 {
		return err
	}
	var UID = message.Payload.Data[0]
	var identity string
	var firstName string
	var lastName string
	var sqlText string = "select ID, identity, firstname, lastname from users where ID=?"
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	rows, err := wsContext.Db.QueryContext(localContext, sqlText, UID)
	CheckErr(err)
	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(&UID, &identity, &firstName, &lastName)
		CheckErr(err)
	}
	if ( wsContext.Verbose > 5 ) {
		fmt.Printf("GetSecInfo\n")
		fmt.Printf("User ID: %s, name: %s %s\n", UID, firstName, lastName)
	}
	message.Payload.Command = "RESP_USR_INF"
	message.Payload.Data = nil
	message.Payload.Data = make([]string, 4)
	message.Payload.Data[0] = UID
	message.Payload.Data[1] = identity
	message.Payload.Data[2] = firstName
	message.Payload.Data[3] = lastName
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
	message.Payload.Command = "RESP_UG_INF"
	for rowsGroup.Next() {
		err = rowsGroup.Scan(&groupID, &groupDescription, &groupPosition)
		CheckErr(err)
		if ( wsContext.Verbose > 5 ) {
			fmt.Printf("Member of group ID: %d, groupName: %s, position %d\n", groupID, groupDescription, groupPosition)
		}
		message.Payload.Data[0] = strconv.FormatInt(groupID,10)
		message.Payload.Data[1] = groupDescription
		message.Payload.Data[2] = strconv.FormatInt(groupPosition,10)
		err = sendMessage(wsContext, &message.Payload)
		CheckErr(err)
	}

	message.Payload.Command = "EOF"
	message.Payload.Data = nil
	err = sendMessage(wsContext, &message.Payload)
	return err
}

func secGroupIDsPopulate(wsContext *WsContext, UID int64) (err error) {
	err = nil
	var sqlGroupID int64
	var sqlText = "select G.ID from users U left join usergroup UG on U.ID=UG.userID left join groups G on UG.groupID=G.ID where U.ID=?"
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	rows, err := wsContext.Db.QueryContext(localContext, sqlText, UID)
	CheckErr(err)
	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(&sqlGroupID)
		CheckErr(err)
		wsContext.SecGroupIDs = append(wsContext.SecGroupIDs, sqlGroupID)
	}
	return err
}

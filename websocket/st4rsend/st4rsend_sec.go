package st4rsend

import (
	"fmt"
	"golang.org/x/crypto/bcrypt"
)

func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password),14)
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
	if message.Payload.Command == "GET_TOKEN" {
		err = WsSrvSecGetToken(wsContext, message)
	}
	CheckErr(err)
	return err
}
func WsSrvSecSetUserPassword(user, password string) (err error) {
	err = nil
	hash, err := HashPassword(password)
	CheckErr(err)
	if (err == nil) {
	//	err = mysqlUpdatePasswordforuser
		fmt.Printf("Hash: %s\n", hash)
		CheckErr(err)
	}
	return err
}

func WsSrvSecConfirmLogin(user, password string) bool {
	var hash string
	// hash := mysqlGetPasswordHashFromUser
	return CheckPasswordHash(password, hash)
}

func WsSrvSecLogin(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	var user = message.Payload.Data[0]
	var password = message.Payload.Data[1]
	fmt.Printf("LOGIN: %s\n", user)
	if (user == "vince" && password == "aaa") {
		fmt.Printf("LOGIN SUCCESS\n")
	} else {
		fmt.Printf("LOGIN FAILED\n")
	}
	CheckErr(err)
	return err
}
func WsSrvSecGetToken(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	fmt.Printf("GetSecToken\n")
	CheckErr(err)
	return err
}
func WsSrvSecGetInfo(wsContext *WsContext, message *WsMessage) (err error) {
	err = nil
	fmt.Printf("GetSecInfo\n")
	fmt.Print("SessionID: %s\n", wsContext.SecSessionID)
	fmt.Print("Token: %s\n", wsContext.SecToken)
	fmt.Print("User ID: %d, name: %s\n", wsContext.SecUserID, wsContext.SecUser)
	fmt.Print("Group ID: %d, group: %s\n", wsContext.SecGroupID, wsContext.SecGroup)
	CheckErr(err)
	return err
}

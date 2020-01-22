package st4rsend

import (
	"fmt"
	"context"
	//"strconv"
	"database/sql"
)

func WsDocSecArticleInsert(wsContext *WsContext, message *WsMessage) (bool, error) {
	if wsContext.SecUserID > 0 {
		return true, nil
	} else {
		return false, fmt.Errorf("ERROR:St4rsend:security:uid 0 requested Doc Article insert")
	}
}

func WsDocSecArticleWrite(wsContext *WsContext, message *WsMessage) (bool, error) {
	var sqlUserID sql.NullInt64
	var sqlGroupID sql.NullInt64
	var sqlGrants sql.NullInt64
	var secStruct WsSecStruct
	var sqlText = "select secUserID, secGroupID, secGrants from documentations where ID=?"
	articleIdx := message.Payload.Data[0]
	localContext := context.Background()
	err := wsContext.Db.PingContext(localContext)
	if CheckErr(err)!= nil { return false, err }
	err = wsContext.Db.QueryRowContext(localContext, sqlText, articleIdx).
		Scan(&sqlUserID, &sqlGroupID, &sqlGrants)
	if err == nil {
		secStruct.secUserID = sqlToWsGrants(sqlUserID)
		secStruct.secGroupID = sqlToWsGrants(sqlGroupID)
		secStruct.secGrants = sqlToWsGrants(sqlGrants)
		granted, err := secWriteGranted(wsContext, &secStruct)
		return granted, err
	} else {
			return false, fmt.Errorf("ERROR:St4rsend:WsDocSecArticleWrite:row scan error: %w", err)
	}
	return false, err
}

func WsDocSecListInsert(wsContext *WsContext, message *WsMessage) (bool, error) {
	if wsContext.SecUserID > 0 {
		return true, nil
	} else {
		return false, fmt.Errorf("ERROR:St4rsend:security:uid 0 requested Doc List insert")
	}
}

func WsDocSecListWrite(wsContext *WsContext, message *WsMessage) (bool, error) {
	var sqlUserID sql.NullInt64
	var sqlGroupID sql.NullInt64
	var sqlGrants sql.NullInt64
	var secStruct WsSecStruct
	var sqlText = "select secUserID, secGroupID, secGrants from documentation_list where ID=?"
	listIdx := message.Payload.Data[0]
	localContext := context.Background()
	err := wsContext.Db.PingContext(localContext)
	if CheckErr(err)!= nil { return false, err }
	err = wsContext.Db.QueryRowContext(localContext, sqlText, listIdx).
		Scan(&sqlUserID, &sqlGroupID, &sqlGrants)
	if err == nil {
		secStruct.secUserID = sqlToWsGrants(sqlUserID)
		secStruct.secGroupID = sqlToWsGrants(sqlGroupID)
		secStruct.secGrants = sqlToWsGrants(sqlGrants)
		granted, err := secWriteGranted(wsContext, &secStruct)
		return granted, err
	} else {
			return false, fmt.Errorf("ERROR:St4rsend:WsDocSecListWrite:row scan error: %w", err)
	}
	return false, err
}

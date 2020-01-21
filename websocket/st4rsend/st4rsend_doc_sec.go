package st4rsend

import (
	"fmt"
	"context"
	//"strconv"
	"database/sql"
)

func WsDocSecArticleInsert(wsContext *WsContext, message *WsMessage) (bool, error) {
	return true, nil
}

func WsDocSecArticleWrite(wsContext *WsContext, message *WsMessage) (granted bool, err error) {
	err = nil
	granted = false
	var sqlUserID sql.NullInt64
	var sqlGroupID sql.NullInt64
	var sqlGrants sql.NullInt64
	var secStruct WsSecStruct
	var sqlText = "select secUserID, secGroupID, secGrants from documentations where ID=?"
	articleIdx := message.Payload.Data[0]
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	CheckErr(err)
	rows, err := wsContext.Db.QueryContext(localContext, sqlText, articleIdx)
	CheckErr(err)
	defer rows.Close()
	for rows.Next() {
		err = rows.Scan(&sqlUserID, &sqlGroupID, &sqlGrants)
		if err == nil {
			secStruct.secUserID = sqlToWsGrants(sqlUserID)
			secStruct.secGroupID = sqlToWsGrants(sqlGroupID)
			secStruct.secGrants = sqlToWsGrants(sqlGrants)
			granted, err = secWriteGranted(wsContext, &secStruct)
			return granted, err
		} else {
			fmt.Printf("row scan error: %s\n", err)
			return false, err
		}
	}
	return false, err
}



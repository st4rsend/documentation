package st4rsend

import (
	"fmt"
	"context"
	//"strconv"
	"database/sql"
)

type WsSecStruct struct{
	secUserID int64
	secGroupID int64
	secGrants int64
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
	fmt.Printf("articleIdx: %s\n", articleIdx)
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

func secReadGranted (wsContext *WsContext, secStruct *WsSecStruct) (granted bool, err error) {
	return false, nil
}

func secWriteGranted (wsContext *WsContext, secStruct *WsSecStruct) (granted bool, err error) {
	fmt.Printf("secUserID: %d\nsecGroupID: %d\nsecGrants: %d\n", secStruct.secUserID, secStruct.secGroupID, secStruct.secGrants)
	return false, nil
}

func sqlToWsGrants(sqlValue sql.NullInt64) (int64) {
	var secValue int64
	if sqlValue.Valid {
		secValue = sqlValue.Int64
	} else {
		secValue = 0
	}
	return secValue
}

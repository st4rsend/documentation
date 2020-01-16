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


// Security based on Nux standards
// Items having an owner user and an owner group 
// ugo type controls 
// Read, Write standard options, Admin permitting security writing
// bits 1, 2, 3 => respectively Other Read, Write, Admin 
// bits 4, 5, 6 => respectively Group Read, Write, Admin 
// bits 7, 8, 9 => respectively User Read, Write, Admin 
// But stored in decimal so first to be transformed
func secReadGranted (wsContext *WsContext, secStruct *WsSecStruct) (granted bool, err error) {
	return false, nil
}

func secWriteGranted (wsContext *WsContext, secStruct *WsSecStruct) (bool, error) {
	fmt.Printf("Article secUserID: %d, secGroupID: %d, secGrants: %d\n", secStruct.secUserID, secStruct.secGroupID, secStruct.secGrants)
	fmt.Printf("ContextUserID: %d, ContextGroupID: %v\n", wsContext.SecUserID, wsContext.SecGroupIDs)
	var err error = nil
	var other int64
	var group int64
	var user int64
	other = secStruct.secGrants % 10
	group = ( secStruct.secGrants / 10 ) % 10
	user = ( secStruct.secGrants / 100 ) % 10
	fmt.Printf("other: %d, group: %d, user: %d\n", other, group, user)
	if other & 2 == 2 {
		return true, err
	}
	if ( wsContext.SecUserID == secStruct.secUserID ) && ( user & 2 == 2 ) {
		return true, err
	}
	for _, userGroup := range wsContext.SecGroupIDs {
		if ( userGroup == secStruct.secGroupID ) && ( group & 2 == 2) {
			return true, err
		}
	}
	return false, nil
}

func secAdminGranted (wsContext *WsContext, secStruct *WsSecStruct) (granted bool, err error) {
	var other int64
	var group int64
	var user int64
	other = secStruct.secGrants % 10
	group = ( secStruct.secGrants / 10 ) % 10
	user = ( secStruct.secGrants / 100 ) % 10
	fmt.Printf("other: %d, group: %d, user: %d\n", other, group, user)
	// confront other 
	if other & 4 == 4 {
		fmt.Printf("write granted for other\n")
	}
	if ( wsContext.SecUserID == secStruct.secUserID ) && ( user & 4 == 4 ) {
		fmt.Printf("Write granted for user\n")
	}
	for _, userGroup := range wsContext.SecGroupIDs {
		if ( userGroup == secStruct.secGroupID ) && ( group & 4 == 4) {
			fmt.Printf("Write granted for group\n")
		}
	}
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

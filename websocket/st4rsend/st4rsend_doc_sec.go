package st4rsend

import (
	//"log"
	"fmt"
	"context"
	//"strconv"
	"database/sql"
)

func WsDocSecArticleInsert(wsContext *WsContext, message *WsMessage) (error) {
	if wsContext.SecUserID > 0 {
		return nil
	} else {
		return fmt.Errorf("Article insert denied for uid 0")
	}
}

func WsDocSecArticleWrite(wsContext *WsContext, message *WsMessage) (err error) {
	var sqlUserID sql.NullInt64
	var sqlGroupID sql.NullInt64
	var sqlGrants sql.NullInt64
	var secStruct WsSecStruct
	var sqlText = "select secUserID, secGroupID, secGrants from documentations where ID=?"
	articleIdx := message.Payload.Data[0]
	localContext := context.Background()
	err = wsContext.Db.PingContext(localContext)
	if CheckErr(err) != nil { return err }
	err = wsContext.Db.QueryRowContext(localContext, sqlText, articleIdx).
		Scan(&sqlUserID, &sqlGroupID, &sqlGrants)
	if err != nil {
		return fmt.Errorf("WsDocSecArticleWrite:row scan error: %v", err)
	}
	secStruct.secUserID = sqlToWsGrants(sqlUserID)
	secStruct.secGroupID = sqlToWsGrants(sqlGroupID)
	secStruct.secGrants = sqlToWsGrants(sqlGrants)
	err = secWriteGranted(wsContext, &secStruct)
	if err != nil {
		return fmt.Errorf("Change denied on article %v has attributes %+v", articleIdx, secStruct)
	}
	return nil
}

func WsDocSecListInsert(wsContext *WsContext, message *WsMessage) (error) {
	if wsContext.SecUserID > 0 {
		return  nil
	} else {
		return fmt.Errorf("Denied uid 0 requesting Doc List insert")
	}
}

func WsDocSecListWrite(wsContext *WsContext, message *WsMessage) (error) {
	var sqlUserID sql.NullInt64
	var sqlGroupID sql.NullInt64
	var sqlGrants sql.NullInt64
	var secStruct WsSecStruct
	var sqlText = "select secUserID, secGroupID, secGrants from documentation_list where ID=?"
	listIdx := message.Payload.Data[0]
	localContext := context.Background()
	err := wsContext.Db.PingContext(localContext)
	if CheckErr(err) != nil { return err }
	err = wsContext.Db.QueryRowContext(localContext, sqlText, listIdx).
		Scan(&sqlUserID, &sqlGroupID, &sqlGrants)
	if err != nil {
		return fmt.Errorf("WsDocSecListWrite:row scan error: %v", err)
	}
	secStruct.secUserID = sqlToWsGrants(sqlUserID)
	secStruct.secGroupID = sqlToWsGrants(sqlGroupID)
	secStruct.secGrants = sqlToWsGrants(sqlGrants)
	err = secWriteGranted(wsContext, &secStruct)
	if err != nil {
		return fmt.Errorf("Change denied on list %v has attributes %v", listIdx)
	}
	return nil
}

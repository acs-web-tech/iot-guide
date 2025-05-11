import { insertData, select, deleteDataByIdentifier } from "../../DBSqlite/crudOperations"
import { generateRespone } from "../../Utils/ByteManupulator"
import { processPending } from "./handlePending"
export async function processConnect(dbconnection, responseType, requestData, reason, socket) {
    let statusInsert = await insertData([
        requestData.cliendID.toString(),
        requestData.qos,
        requestData.retain,
        requestData.willMessageLen > 0 ? 1 : 0,
        requestData.willMessage,
        requestData.willMessageTopic,
        requestData.clean,
        requestData.aliveTime,
        null
    ],
        dbconnection,
        "connection"
    )
      // connack
    generateRespone(responseType, reason, socket)
    //let selectdata = await select(dbconnection, ["*"], "connection")

}
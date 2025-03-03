import { insertData, select } from "../../DBSqlite/crudOperations"
import { generateRespone } from "../../Utils/ByteManupulator"
export async function processConnect(dbconnection, responseType, requestData, reason, socket) {
    let statusInsert = await insertData([
        requestData.cliendID,
        requestData.qos,
        requestData.retain,
        requestData.willMessageLen > 0 ? 1 : 0,
        requestData.willMessage,
        requestData.clean,
        requestData.aliveTime,
        null
    ],
        dbconnection.inMemory,
        "connection"
    )
    let selectdata = await select(dbconnection.inMemory, ["*"], "connection")
    return generateRespone(responseType, reason, socket)

}
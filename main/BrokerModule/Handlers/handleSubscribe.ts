import { insertData, select } from "../../DBSqlite/crudOperations"
import { generateResponeSuback } from "../../Utils/ByteManupulator"
export async function processSubscribe(dbconnection, responseType, clientID, payload, topic, connectionState, socket) {
    console.log("4",clientID)
    let insertStatus = await insertData(
        [
            clientID,
            payload.identifier,
            topic,
            payload.qos
        ],
        dbconnection,
        "subscription"
    )
    let selectdata = await select(dbconnection, ["*"], "subscription")
    generateResponeSuback(responseType, payload.identifier, socket)
} 
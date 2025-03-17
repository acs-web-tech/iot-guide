import { insertData, select, selectByClientId, selectTopic } from "../../DBSqlite/crudOperations"
import { generateResponeSuback } from "../../Utils/ByteManupulator"
export async function processSubscribe(dbconnection, responseType, clientID, payload, topic, connectionState, socket) {
    let hasSubscription:any = await selectByClientId(dbconnection, ["topic", "client_id"], "subscription", [clientID])
    if (hasSubscription.length == 0) {
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
    }
    let selectdata = await select(dbconnection, ["*"], "subscription")
    console.log(selectdata)
    generateResponeSuback(responseType, payload.identifier, socket)
} 
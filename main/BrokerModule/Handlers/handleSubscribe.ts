import { Client } from "mqtt/*"
import { insertData, select, selectByClientId, selectTopic } from "../../DBSqlite/crudOperations"
import { generateResponeSuback } from "../../Utils/ByteManupulator"
import { processPending } from "./handlePending"
export async function processSubscribe(dbconnection, responseType, clientID, payload, topic, connectionState, socket) {
    let hasSubscription: any = await selectByClientId(dbconnection, ["topic", "client_id"], "subscription", [clientID, topic])
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
    generateResponeSuback(responseType, payload.identifier, socket)
    let retain_messages: any = await selectTopic(dbconnection, ["*"], "retain_messages", [topic])
    if (retain_messages.length > 0) {
        socket.write(retain_messages[0].payload)
    }
    return true
} 
import { deliverMessage } from "../../Utils/messageDeliveryQueue"
import { update, selectByID, selectTopic } from "../../DBSqlite/crudOperations"
import { generateResponePuback } from "../../Utils/ByteManupulator"
import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
export async function processPubRel(dbconnection, payload, connectionState, socket) {
    let updateStatus = await update(dbconnection, [1, payload.identifier])
    let Message: any = await selectByID(dbconnection.inMemory, [
        "client_id",
        "topic",
        "payload"
    ],
        "publish",
        [payload.identifier]
    )
    let subscribedClients: any = await selectTopic(
        dbconnection.inMemory,
        [
            "client_id",
            "topic",
            "qos"
        ],
        "subscription",
        [Message[0].topic.toString()]
    )
    deliverMessage(
        subscribedClients,
        payload,
        Message[0].payload,
        dbconnection.inMemory,
        connectionState
    )
    generateResponePuback(SUPPORTED_PACKETS.PUBCOMP.type, payload.identifier, socket)
}
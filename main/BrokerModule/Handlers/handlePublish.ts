import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
import { selectTopic, insertData } from "../../DBSqlite/crudOperations"
import { deliverMessage } from "../../Utils/messageDeliveryQueue"
import { generateResponePuback } from "../../Utils/ByteManupulator"
export async function processPublish(dbconnection, responseType, receivedMessage, topic, cliendID, payload, connectionState, socket) {
    if (payload.qos == 1) {
        responseType = SUPPORTED_PACKETS.PUBACK.type
    }
    if (payload.qos == 2) {
        responseType = SUPPORTED_PACKETS.PUBREC.type
    }
    let subscribedClients: any = await selectTopic(
        dbconnection,
        [
            "client_id",
            "topic",
            "qos"
        ],
        "subscription",
        [topic]
    )
    if (payload.qos == 0) {
        deliverMessage(
            subscribedClients,
            payload,
            receivedMessage,
            dbconnection,
            connectionState
        )
    }
    if (payload.qos == 1) {
        deliverMessage(
            subscribedClients,
            payload,
            receivedMessage,
            dbconnection,
            connectionState
        )
        generateResponePuback(responseType, payload.identifier, socket)

    }
    if (payload.qos == 2) {
        let insertStatus = await insertData(
            [
                cliendID,
                payload.identifier,
                payload.topic,
                receivedMessage,
                payload.retain,
                payload.qos,
                payload.qos == 1 ? 1 : 0,
                payload.qos == 1 || payload.qos == 0 ? 1 : 0
            ],
            dbconnection,
            "publish"
        )

        subscribedClients.map((value) => {
            this.subscriberDeliveryQueue.push({ cliendID, topic:payload.topic, qos: payload.qos , identifier:payload.identifier })
        })
        generateResponePuback(responseType, payload.identifier, socket)
    }
}
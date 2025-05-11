import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
import { selectTopic, insertData, updateRetainMessage, updatePublish , deleteRetainMessage} from "../../DBSqlite/crudOperations"
import { deliverMessage } from "../../Utils/messageDeliveryQueue"
import { generateResponePuback } from "../../Utils/ByteManupulator"
export async function processPublish(dbconnection, responseType, receivedMessage, topic, cliendID, payload, connectionState,receivedPayloadMessage, socket) {
    if (payload.qos == 1) {
        responseType = SUPPORTED_PACKETS.PUBACK.type
    }
    if (payload.qos == 2) {
        responseType = SUPPORTED_PACKETS.PUBREC.type
    }
    if (payload.retain!=1) {
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
                payload.qos,
                receivedMessage,
                dbconnection,
                connectionState
            )
        }
        if (payload.qos == 1) {
            deliverMessage(
                subscribedClients,
                payload,
                payload.qos,
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
                this.subscriberDeliveryQueue.push({ cliendID, topic: payload.topic, qos: payload.qos, identifier: payload.identifier })
            })
            //socket.write(Buffer.from([SUPPORTED_PACKETS.PUBREC.type,0x02,...payload.identifier]))
            generateResponePuback(SUPPORTED_PACKETS.PUBREC.type, payload.identifier, socket)
        }
    }
    if (payload.retain == 1 && receivedPayloadMessage.length!=0) {
        let retain_messages: any = await selectTopic(dbconnection, ["*"], "retain_messages", [topic])
        if (retain_messages.length == 0) {
            let insertRetain = await insertData([cliendID, payload.identifier, topic, receivedMessage], dbconnection, "retain_messages")
            // let insertStatus = await insertData(
            //     [
            //         cliendID,
            //         payload.identifier,
            //         payload.topic,
            //         receivedMessage,
            //         payload.retain,
            //         payload.qos,
            //         payload.qos == 1 ? 1 : 0,
            //         payload.qos == 1 || payload.qos == 0 ? 1 : 0
            //     ],
            //     dbconnection,
            //     "publish"
            // )
        } else {
            // update retain message
            let updateRetain = await updateRetainMessage(dbconnection, [cliendID, payload.identifier, topic, receivedMessage],"retain_messages")
            // let insertUpdateStatus = await updatePublish(
            //     dbconnection,
            //     [
            //         cliendID,
            //         payload.identifier,
            //         payload.topic,
            //         receivedMessage,
            //         payload.retain,
            //         payload.qos,
            //         payload.qos == 1 ? 1 : 0,
            //         payload.qos == 1 || payload.qos == 0 ? 1 : 0
            //     ],
            //     "publish"
            // )
        }
      generateResponePuback(responseType, payload.identifier, socket)
    }
    if(payload.retain==1&&receivedPayloadMessage.length==0){
        console.log("delete will",receivedPayloadMessage)
        await deleteRetainMessage(dbconnection,[topic],"retain_messages")
    }
}
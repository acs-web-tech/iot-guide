import { deliverMessage } from "../../Utils/messageDeliveryQueue"
import { update, selectByID, selectTopic, select } from "../../DBSqlite/crudOperations"
import { generateResponePuback } from "../../Utils/ByteManupulator"
import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
import { DestructurePayload_Publish } from "../../Utils/publishPacket"
export async function processPubRel(dbconnection, payload, connectionState, socket) {
    console.log("rel")
    let updateStatus = await update(dbconnection, [1, payload.identifier])
    let Message: any = await selectByID(dbconnection, [
        "client_id",
        "topic",
        "payload",
        "qos"
    ],
        "publish",
        [payload.identifier]
    )
    let subscribedClients: any = await selectTopic(
        dbconnection,
        [
            "client_id",
            "topic",
            "qos",
            "identifier"
        ],
        "subscription",
        [Message[0].topic.toString()]
    )
    let payloadData = DestructurePayload_Publish(Message[0].payload)
    if(payloadData.retain!=1){
    await deliverMessage(
        subscribedClients,
        payload,
        Message[0].qos,
        Message[0].payload,
        dbconnection,
        connectionState
    )
}
    // console.log("comp",Buffer.from([SUPPORTED_PACKETS.PUBCOMP.type,0x02,...payload.identifier]))
    generateResponePuback(SUPPORTED_PACKETS.PUBCOMP.type, payload.identifier, socket)
}
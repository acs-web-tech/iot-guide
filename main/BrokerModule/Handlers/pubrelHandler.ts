import { deliverMessage } from "../../Utils/messageDeliveryQueue"
import { generateResponePuback } from "../../Utils/ByteManupulator"
import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
import { destructurePayloadPublish } from "../../Utils/publishPacket"
import { extractID } from "../../Utils/getResponseType"
export async function processPubRel(payload, connectionState, socket) {
    console.log("rel")
    let id = extractID(payload.identifier)
    let pub = this.publisherQueue[id]
    let sub = Object.keys(this.subscription[pub?.topic.toString()]??{})
    //let updateStatus = await update(dbconnection, [1, payload.identifier])
    // let Message: any = await selectByID(dbconnection, [
    //     "client_id",
    //     "topic",
    //     "payload",
    //     "qos"
    // ],
    //     "publish",
    //     [payload.identifier]
    // )
    // let subscribedClients: any = await selectTopic(
    //     dbconnection,
    //     [
    //         "client_id",
    //         "topic",
    //         "qos",
    //         "identifier"
    //     ],
    //     "subscription",
    //     [Message[0].topic.toString()]
    // )

    let payloadData = destructurePayloadPublish(pub.receivedMessage)
    if(payloadData.retain!=1){
    await deliverMessage.apply(this,[
        sub,
        pub.qos,
        pub.receivedMessage,
        pub.topic
    ]
    )
}
     //console.log("comp",Buffer.from([SUPPORTED_PACKETS.PUBCOMP.type,0x02,...payload.identifier]))
    generateResponePuback(SUPPORTED_PACKETS.PUBCOMP.type, payload.identifier, socket)
}
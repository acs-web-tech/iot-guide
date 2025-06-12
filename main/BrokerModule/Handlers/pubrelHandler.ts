import { deliverMessage } from "../../Utils/messageDeliveryQueue"
import { generateResponePuback } from "../../Utils/ByteManupulator"
import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
import { destructurePayloadPublish } from "../../Utils/publishPacket"
import { extractID } from "../../Utils/getResponseType"
export function processPubRel(payload, connectionState, socket) {
    let id = extractID(payload.identifier)
    let pub = this.publisherQueue[id] || this.retainQueue.get(id)
    this.subscriberDeliveryQueue = Object.keys(this.subscription[pub?.topic.toString()] ?? {})
    if (pub) {
        let payloadData = destructurePayloadPublish(pub.receivedMessage)
        if (payloadData.retain != 1) {
            deliverMessage.apply(this, [
                this.subscriberDeliveryQueue,
                pub.qos,
                pub.receivedMessage,
                pub.topic
            ]
            )
        } this.subscriberDeliveryQueue = []
        //console.log("comp",Buffer.from([SUPPORTED_PACKETS.PUBCOMP.type,0x02,...payload.identifier]))
        generateResponePuback(SUPPORTED_PACKETS.PUBCOMP.type, payload.identifier, socket)
    }
}
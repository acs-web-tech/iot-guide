import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
import { deliverMessage } from "../../Utils/messageDeliveryQueue"
import { generateResponePuback } from "../../Utils/ByteManupulator"
import { extractID } from "../../Utils/getResponseType"
import { topicInspect } from "../../Utils/validateTopic"
export async function processPublish(receivedMessage, topic, cliendID, payload, receivedPayloadMessage, socket) {
    let responseType = 0
    if (!topicInspect(topic)) {
        if (payload.qos == 1) {
            responseType = SUPPORTED_PACKETS.PUBACK.type
        }
        if (payload.qos == 2) {
            responseType = SUPPORTED_PACKETS.PUBREC.type
        }
        let id = extractID(payload.identifier)
        if (payload.retain != 1) {
            this.subscriberDeliveryQueue = Object.keys(this.subscription[topic] || {})
            if (payload.qos == 0) {
                deliverMessage.apply(this, [
                    this.subscriberDeliveryQueue,
                    payload.qos,
                    receivedMessage,
                    topic
                ]
                )
                this.subscriberDeliveryQueue = []
            }
            if (payload.qos == 1) {
                this.publisherQueue[id] = { ...payload, receivedMessage }
                deliverMessage.apply(this,
                    [
                        this.subscriberDeliveryQueue,
                        payload.qos,
                        receivedMessage,
                        topic
                    ]
                )
                this.subscriberDeliveryQueue = []
                generateResponePuback(responseType, payload.identifier, socket)

            }
            if (payload.qos == 2) {
                this.publisherQueue[id] = { ...payload, receivedMessage, }
                generateResponePuback(SUPPORTED_PACKETS.PUBREC.type, payload.identifier, socket)
            }
        }

        if (payload.retain == 1 && receivedPayloadMessage.length != 0) {
            this.retainQueue.set(topic, receivedMessage)
            this.publisherQueue[id] = { ...payload, receivedMessage }
            generateResponePuback(responseType, payload.identifier, socket)
        }
        if (payload.retain == 1 && receivedPayloadMessage.length == 0) {
            this.retainQueue.delete(topic)
        }
    }
}
import { generateResponeSuback } from "../../Utils/ByteManupulator"
export async function processSubscribe(responseType, clientID, payload, topic, connectionState, socket) {
    if (this.subscription[topic]) {
        this.subscription[topic][clientID] = {
            identifier: payload.identifier,
            topic,
            qos: payload.qos,
            clientID
        }
    } else {
        this.subscription[topic] = {
            [clientID]: {
                identifier: payload.identifier,
                topic,
                qos: payload.qos,
                clientID
            }
        }
    }
    this.connection[clientID].subscriptions.push(topic)
    generateResponeSuback(responseType, payload.identifier, socket)
    let retain_messages: any = this.retainQueue.get(topic.toString())
    if (retain_messages) {
        socket.write(retain_messages)
    }
    return true
} 
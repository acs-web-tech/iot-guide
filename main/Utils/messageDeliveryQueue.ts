import { destructurePayloadPublish } from "./publishPacket"
import { extractID } from "./getResponseType"
import { Socket } from "net"
import { PacketStructure_Publish } from "./Interface/packets"
export function deliverMessage(deliveryQueue, qos = null, message, topic: string) {
    for (let subscriber of deliveryQueue) {
        const socket: Socket = this.socketQueue.get(subscriber)
        const id = extractID(destructurePayloadPublish(message).identifier)
        if ((socket && socket.destroyed) && (qos === 2 || qos === 1)) {

            if (!this.pendingQueue[subscriber]) {
                this.pendingQueue = {
                    [subscriber]:{[topic]:{}}
                }
            }

            this.pendingQueue[subscriber][topic][id] = message
        }
        //  console.log("del", this.pendingQueue)
        socket?.write(message)
    }
    return true;

}
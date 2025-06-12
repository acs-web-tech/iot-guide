import { destructurePayloadPublish } from "./publishPacket"
import { extractID } from "./getResponseType"
import { Socket } from "net"
export function deliverMessage(deliveryQueue, qos = null, message, topic: string) {
    for (let subscriber of deliveryQueue) {
        const socket: Socket = this.socketQueue.get(subscriber)
        const id = extractID(destructurePayloadPublish(message).identifier)
        if ((socket == undefined || socket?.destroyed) && (qos === 2 || qos === 1)) {
            if (!this.pendingQueue[subscriber]) {
                this.pendingQueue = {
                    [subscriber]:{[topic]:{[id]:message}}
                }
            }else{

            this.pendingQueue[subscriber][topic][id] = message
            }
        }
      socket?.write(message)
    
}
    return true;

}
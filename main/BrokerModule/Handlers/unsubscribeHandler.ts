import { extractID } from "../../Utils/getResponseType"
import { generateResponeUnSuback } from "../../Utils/ByteManupulator"
import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
export async function processUnSubscribe(clientID:string, identifier:Buffer, topic:string, socket) {
    let id = extractID(identifier)
    delete this.subscription[topic][clientID]
    console.log("uns",this.subscription)
    // this.subscriberDeliveryQueue.forEach((subscriber, index) => {
    //     if (subscriber.topic == topic && clientID == subscriber.cliendID) {
    //         this.subscriberDeliveryQueue.splice(index, 1)
    //     }
    // });
    generateResponeUnSuback(SUPPORTED_PACKETS.UNSUBACK.type, identifier, socket)
} 
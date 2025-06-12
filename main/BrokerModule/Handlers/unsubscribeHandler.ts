import { extractID } from "../../Utils/getResponseType"
import { generateResponeUnSuback } from "../../Utils/ByteManupulator"
import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
export async function processUnSubscribe(clientID:string, identifier:Buffer, topic:string, socket) {
    let id = extractID(identifier)
    delete this.subscription?.[topic]?.[clientID]
    generateResponeUnSuback(SUPPORTED_PACKETS.UNSUBACK.type, identifier, socket)
} 
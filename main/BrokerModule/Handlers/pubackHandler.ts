import { PacketStructure_PublishReleaseAck } from "../../Utils/Interface/packets"
import { extractID } from "../../Utils/getResponseType"
export async function processPubAck(identifier) {
     let id = extractID(identifier)
     delete this.publisherQueue[id]
}
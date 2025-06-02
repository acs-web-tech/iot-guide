import { PacketStructure_Subscribe } from "./Interface/packets";
import { bytesConsumed } from "./connectPacket";
export function destructurePayloadSubscribe(buffer: Buffer):object {
    let cursor = 0
    const willFitOneByte = bytesConsumed(buffer.byteLength)
    let topicLen = 0 
    const packets: PacketStructure_Subscribe = {
              type: buffer[cursor],
              remainingLength: buffer.subarray(++cursor, cursor = cursor + willFitOneByte).length,
              identifier: buffer.subarray(cursor++,++cursor),
              topicLen: topicLen = buffer[cursor]+buffer[++cursor],
              topic: buffer.subarray(++cursor,cursor = cursor + topicLen),
              qos: buffer[cursor]
    }
    // check MSB for Message Identifier is within the limit
    return packets

}
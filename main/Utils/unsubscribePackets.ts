import { PacketStructure_UnSubscribe } from "./Interface/packets";
import { bytesConsumed } from "./connectPacket";
export function destructurePayloadUnSubscribe(buffer: Buffer):object {
    let cursor = 0
    const willFitOneByte = bytesConsumed(buffer.byteLength)
    let topicLen = 0 
    const packets: PacketStructure_UnSubscribe ={
        type:buffer[cursor],
        remainingLength: buffer.subarray(++cursor, cursor = cursor + willFitOneByte).length,
        identifier: buffer.subarray(cursor++,++cursor),
        topicLen: topicLen = buffer[cursor]+buffer[++cursor],
        topic : buffer.subarray(++cursor,cursor = cursor + topicLen)
    };

    // check MSB for Message Identifier is within the limit
    return packets

}
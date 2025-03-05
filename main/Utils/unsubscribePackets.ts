import { PacketStructure_UnSubscribe } from "./Interface/packets";
import { bytesConsumed } from "./connectPacket";
export function DestructurePayload_UnSubscribe(buffer: Buffer) {
    let packets: PacketStructure_UnSubscribe = {
        type: 0,
        remainingLength: 0,
        topicLen: 0,
        topic: Buffer.from([]),
        identifier: Buffer.from([]) || null
    }
    let cursor = 0
    packets.type = buffer[cursor]
    let willFitOneByte = bytesConsumed(buffer.byteLength)
    packets.remainingLength = buffer.subarray(++cursor, cursor = cursor + willFitOneByte).length
    packets.identifier = buffer.subarray(cursor++,++cursor)
    packets.topicLen = buffer[cursor]+buffer[++cursor]
    packets.topic = buffer.subarray(++cursor,cursor = cursor + packets.topicLen)
    // check MSB for Message Identifier is within the limit
    return packets

}
import { PacketStructure_Publish } from "./Interface/packets";
import { bytesConsumed } from "./connectPacket";
export function DestructurePayload_Publish(buffer: Buffer) {
    let packets: PacketStructure_Publish = {
        type: 0,
        remainingLength: 0,
        dup: 0,
        retain: 0,
        topicLen: 0,
        topic: Buffer.from([]),
        qos: 0,
        payload: Buffer.from([]) || null,
        identifier: Buffer.from([]) || null
    }
    let cursor = 0
    packets.type = 3
    packets.dup = ((buffer[cursor] >> 3) & 1)
    packets.qos = ((buffer[cursor] >> 1) & 0b11)
    packets.retain = (buffer[cursor] & 1)
    let willFitOneByte = bytesConsumed(buffer.byteLength)
    packets.remainingLength = buffer.subarray(++cursor, cursor = cursor + willFitOneByte).length
    packets.topicLen = buffer[cursor] + buffer[++cursor]
    packets.topic = buffer.subarray(++cursor, cursor = packets.topicLen + cursor++)
    console.log(packets.topic.toString())
    // check MSB for Message Identifier is within the limit
    packets.identifier = buffer.subarray(cursor++, ++cursor)
    packets.payload = buffer.subarray(cursor)
    return packets

}
import { PacketStructure_Publish } from "./Interface/packets";
import { bytesConsumed } from "./connectPacket";
export function DestructurePayload_Publish(buffer: Buffer) {
    let packets: PacketStructure_Publish = {
        type: 0,
        remainingLength: 0,
        dup: 0,
        retain: 0,
        topicLen: 0,
        topic: Buffer.from([]) || null,
        payload: Buffer.from([]) || null
    }
    let cursor = 0
    packets.type = 3
    packets.dup = ((buffer[cursor] >> 3) & 1)
    packets.retain = ((buffer[cursor] >> 0) & 1)
    let willFitOneByte = bytesConsumed(buffer.byteLength)
    packets.remainingLength = buffer.subarray(++cursor, cursor = cursor + willFitOneByte).byteLength

}
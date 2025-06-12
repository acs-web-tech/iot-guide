import { PacketStructure_Publish,PacketStructure_PublishRelease , PacketStructure_PublishReleaseAck ,PacketStructure_Comp} from "./Interface/packets";
import { bytesConsumed } from "./connectPacket";
export function destructurePayloadPublish(buffer: Buffer):PacketStructure_Publish {
    let cursor = 0
    const willFitOneByte = bytesConsumed(buffer.byteLength)
    let topicLen = 0
    let qos = 0 
    const packets: PacketStructure_Publish = {
        type: buffer[cursor],
        dup: ((buffer[cursor] >> 3) & 1),
        qos: qos = ((buffer[cursor] >> 1) & 0b11),
        retain: (buffer[cursor] & 1),
        remainingLength: buffer.subarray(++cursor, cursor = cursor + willFitOneByte).length,
        topicLen: topicLen = buffer[cursor] + buffer[++cursor],
        topic: buffer.subarray(++cursor, cursor = topicLen + cursor++),
        identifier:qos>0? buffer.subarray(cursor++, ++cursor):Buffer.from([]),
        payload: buffer.subarray(cursor)
    }
    return packets

}
export function destructurePayloadPublishRelease(buffer: Buffer):PacketStructure_PublishRelease {
    let cursor = 0
    const willFitOneByte = bytesConsumed(buffer.byteLength)
    const packets: PacketStructure_PublishRelease = {
        type: buffer[cursor],
        remainingLength: buffer.subarray(++cursor,cursor = willFitOneByte + cursor).length,
        identifier: buffer.subarray(cursor++,cursor+1)
    }
    return packets
}
export function destructurePayloadPublishComp(buffer: Buffer):PacketStructure_Comp {
    let cursor = 0
    const willFitOneByte = bytesConsumed(buffer.byteLength)
    const packets: PacketStructure_Comp = {
        type: buffer[cursor],
        remainingLength: buffer.subarray(++cursor,cursor = cursor+willFitOneByte).byteLength,
        identifier: buffer.subarray(cursor)

    }
    return packets
}
export function destructurePayloadPublishAck(buffer: Buffer):PacketStructure_PublishReleaseAck {
    const willFitOneByte = bytesConsumed(buffer.byteLength)
    let cursor = 0
    const packets: PacketStructure_PublishReleaseAck = {
       type: buffer[cursor],
       remainingLength: buffer.subarray(++cursor,cursor = cursor+willFitOneByte).byteLength,
       identifier: buffer.subarray(cursor)
    }
    return packets
}
export function destructurePayloadPubRec(buffer: Buffer) {
    let cursor = 0
    const willFitOneByte = bytesConsumed(buffer.byteLength)
    const packets: PacketStructure_PublishReleaseAck = {
        type: buffer[cursor],
        remainingLength: buffer.subarray(++cursor,cursor = cursor+willFitOneByte).byteLength,
        identifier: buffer.subarray(cursor)
    }
    return packets
}
import { PacketStructure } from "./Interface/packets"
export function connect_Payload(buffer: Buffer) {
    let packets: PacketStructure = {
        type: 0,
        remainingLength: 0,
        protocolLength: 0,
        protocolName: Buffer.from([]),
        protocolLevel: 0,
        flags: 0,
        aliveTime: 0,
        clientLength: 0,
        cliendID: Buffer.from([]),
        usernameLen: 0,
        username: Buffer.from([]),
        passwordLen: 0,
        password: Buffer.from([]),
        willMessageLen: 0,
        willMessage: Buffer.from([]) || null,
        willMessageTopicLen: 0,
        willMessageTopic: Buffer.from([]) || null
    }
    let cursor = 0
    packets.type = buffer[cursor]
    let willFitOneByte = bytesConsumed(buffer.byteLength)
    packets.remainingLength = buffer.subarray(++cursor, cursor + willFitOneByte).byteLength
    packets.protocolLength = (buffer[cursor = cursor + packets.remainingLength] + buffer[++cursor])
    packets.protocolName = buffer.subarray(cursor, cursor = cursor + packets.protocolLength)
    packets.protocolLevel = buffer[++cursor]
    packets.flags = buffer[++cursor]
    packets.aliveTime = buffer[++cursor] + buffer[++cursor]
    packets.clientLength = buffer[++cursor] + buffer[++cursor]
    packets.cliendID = buffer.subarray(++cursor, cursor = cursor + packets.clientLength)
    if (((packets.flags >> 2) & 1) == 1) {
        packets.willMessageTopicLen = buffer[cursor] + buffer[++cursor]
        if (packets.willMessageTopicLen == 0) {
            packets.willMessageTopic = null
        } else {
            packets.willMessageTopic = buffer.subarray(++cursor, cursor = cursor + packets.willMessageTopicLen)
            packets.willMessageLen = cursor + packets.willMessageTopicLen
        }
        packets.willMessageLen = buffer[cursor] + buffer[++cursor]
        if (packets.willMessageLen == 0) {
            packets.willMessage = null
        } else {
            packets.willMessage = buffer.subarray(++cursor, cursor = cursor + packets.willMessageLen)
        }
    }
    packets.usernameLen = buffer[cursor++] + buffer[cursor++]
    packets.username = buffer.subarray(cursor, cursor = cursor + packets.usernameLen)
    packets.passwordLen = buffer[cursor++] + buffer[cursor++]
    packets.password = buffer.subarray(cursor, cursor + packets.passwordLen)
}
export let bytesConsumed = (totalLength: number): number => {
    if ((totalLength < 0x7F)) {
        return 1
    }
    if ((totalLength > 0x7F)) {
        return 2
    }

}
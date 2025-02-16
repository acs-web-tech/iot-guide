import { allowedNodeEnvironmentFlags, pid } from "node:process"
import { PacketStructure, VaraiblesHex, GLOBALS } from "./Interface/packets"
// will be depricated Soon not Recommended to use
export function ExtractUnamePassword(eventDataHex): Array<string> {
    let buffer = Buffer.from(eventDataHex, "hex")
    let bufferLength = buffer.byteLength
    let credentials = buffer.subarray(29, bufferLength).toString()
    let split_credentials = credentials.match(/[a-z0-9A-Z]+/igm)
    buffer.forEach((value) => {
        console.log(value);
    })
    return split_credentials

}
// deprication warning end

//Use this instead
export function DestructurePayload(eventDataHex: Buffer): PacketStructure {
    let buffer: Buffer = eventDataHex
    // Refactored Method
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
    let willFitOneByte = Math.floor((buffer.byteLength) / 128)
    packets.remainingLength = buffer.subarray(++cursor, cursor = cursor + willFitOneByte).byteLength
    packets.protocolLength = (buffer[++cursor] + buffer[++cursor])
    packets.protocolName = buffer.subarray(cursor, ++cursor + packets.protocolLength)
    packets.protocolLevel = buffer[cursor = packets.protocolLength + cursor++]
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
            packets.willMessageLen = buffer[cursor] + buffer[++cursor]
        }
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
    return packets
}
export let bufferHexToDecimal = (buffer: Buffer): number => {
    let hexString = buffer.toString("hex")
    return parseInt(hexString, 16)
}
let bufferToString = (buffer: Buffer): string => buffer.toString()
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
        password: Buffer.from([])
    }
    let cursor = 0
    packets.type = buffer[cursor]
    packets.remainingLength = buffer[++cursor]
    packets.protocolLength = (buffer[++cursor] + buffer[++cursor])
    packets.protocolName = buffer.subarray(cursor, ++cursor + packets.protocolLength)
    packets.protocolLevel = buffer[cursor = packets.protocolLength + cursor++]
    packets.flags = buffer[++cursor]
    packets.aliveTime = buffer[++cursor] + buffer[++cursor]
    packets.clientLength = buffer[++cursor] + buffer[++cursor]
    packets.cliendID = buffer.subarray(++cursor, cursor = cursor + packets.clientLength)
    packets.usernameLen = buffer[cursor++] + buffer[cursor++]
    packets.username = buffer.subarray(cursor, cursor = cursor + packets.usernameLen)
    packets.passwordLen = buffer[cursor++] + buffer[cursor++]
    packets.password = buffer.subarray(cursor, cursor + packets.passwordLen)
    return packets
}
let bufferHexToDecimal = (buffer: Buffer): number => {
    let hexString = buffer.toString("hex")
    return parseInt(hexString, 16)
}
let bufferToString = (buffer: Buffer): string => buffer.toString()
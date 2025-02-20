import { allowedNodeEnvironmentFlags, pid } from "node:process"
import { PacketStructure, VaraiblesHex, GLOBALS, PacketStructure_Publish } from "./Interface/packets"
import { ReasonCode } from "../BrokerModule/Interfaces/EventConfig"
import { SUPPORTED_PACKETS } from "../BrokerModule/Interfaces/Enums"
import { connect_Payload } from "./connectPacket"
import { DestructurePayload_Publish } from "./publishPacket"
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
export function DestructurePayload(eventDataHex: Buffer) {
    let buffer: Buffer = eventDataHex
    // Refactored Method
    let packets;
    if (SUPPORTED_PACKETS.CONNECT.type == eventDataHex[0]) {
        packets = connect_Payload(buffer)
    }
    if (((eventDataHex[0] >> 0x3) & 1) == 1) {
        packets = DestructurePayload_Publish(buffer)
    }
    return packets
}
export let bufferHexToDecimal = (buffer: Buffer): number => {
    let hexString = buffer.toString("hex")
    return parseInt(hexString, 16)
}

export let generateRespone = function (type: number, errorType: null | number, socket) {
    let remainingLength = SUPPORTED_PACKETS.CONNACK.remainingLength
    let connAckBuffer = Buffer.from([type, remainingLength, 0, errorType])
    if (errorType > 0) {
        socket.write(connAckBuffer)
        socket.destroy()
        return;
    }
    socket.write(connAckBuffer)
}

let bufferToString = (buffer: Buffer): string => buffer.toString()
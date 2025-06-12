import { SUPPORTED_PACKETS } from "../BrokerModule/Interfaces/Enums"
import { connect_Payload } from "./connectPacket"
import { destructurePayloadPublish } from "./publishPacket"

//Use this instead
export function DestructurePayload(eventDataHex: Buffer) {
    let buffer: Buffer = eventDataHex
    // Refactored Method
    let packets;
    if (SUPPORTED_PACKETS.CONNECT.type == eventDataHex[0]) {
        packets = connect_Payload(buffer)
    }
    if (((eventDataHex[0] >> 0x3) & 1) == 1) {
        packets = destructurePayloadPublish(buffer)
    }
    return packets
}
export let bufferHexToDecimal = (buffer: Buffer): number => {
    const hexString = buffer.toString("hex")
    return parseInt(hexString, 16)
}

export let generateRespone = function (type: number, errorType: number, socket) {
    const remainingLength = SUPPORTED_PACKETS.CONNACK.remainingLength
    const AckBuffer = Buffer.from([type, remainingLength, 0, errorType])
    if (errorType > 0) {
        socket.write(AckBuffer)
        socket.destroy()
        return;
    }
    socket.write(AckBuffer)
}
export let generateResponePuback = function (type: number,identity, socket) {
    const remainingLength = SUPPORTED_PACKETS.PUBACK.remainingLength
    const AckBuffer = Buffer.from([type, 0x02,...identity])
    console.log(AckBuffer)   
    socket.write(AckBuffer)
    
}
export let generateResponePing = function (type: number,identity, socket) {
    const AckBuffer = Buffer.from([type, identity])
      socket.write(AckBuffer)
    
}
export let generateResponeSuback = function (type: number,identity, socket) {
    const remainingLength = SUPPORTED_PACKETS.SUBACK.remainingLength
    const AckBuffer = Buffer.from([type, remainingLength,...identity,1])
    socket.write(AckBuffer)
    
}
export let generateResponeUnSuback = function (type: number,identity, socket) {
    const remainingLength = SUPPORTED_PACKETS.UNSUBACK.remainingLength
    const AckBuffer = Buffer.from([type, remainingLength,...identity])
    socket.write(AckBuffer)
    
}
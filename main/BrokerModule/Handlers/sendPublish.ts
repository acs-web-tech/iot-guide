import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
import { bytesConsumed } from "../../Utils/connectPacket"
export function publishMessage(topic,message,qos){
    let rand = Math.floor(Math.random()+1000)*65535
    let buffer:any = Buffer.from([
        ((qos!=null?SUPPORTED_PACKETS.PUBLISH.type+qos:SUPPORTED_PACKETS.PUBLISH.type)),
        0x00,
        0x00,
        topic.length,
        ...topic,
        rand,
        ...message
    ])
    buffer[1] = buffer.length - 2
  
    return {buffer}
}
import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
import { bytesConsumed } from "../../Utils/connectPacket"
// IBM Spec https://public.dhe.ibm.com/software/dw/webservices/ws-mqtt/mqtt-v3r1.html#msg-format
 /*do
    digit = X MOD 128
    X = X DIV 128
    // if there are more digits to encode, set the top bit of this digit
    if ( X > 0 )
      digit = digit OR 0x80
    endif
    'output' digit
   while ( X> 0 ) 
 */
function encodeRemainingLength(length: number): number[] {
    const bytes:number[] = [];
    do {
        let byte = length % 128;
        length = Math.floor(length / 128);
        // if there are more digits to encode, set the top bit of this byte
        if (length > 0) byte = byte | 0x80;
        bytes.push(byte);
    } while (length > 0);
    return bytes;
}


export function publishMessage(topic, message, qos) {
    this.idQueue++
    let produceEmptyBytes = (id) => {
        let bytes: Array<number> = []
        bytes[0] = (id >> 8) & 0xff
        bytes[1] = id & 0xff
        return bytes;
    }
    let qosID = ((qos != null ? SUPPORTED_PACKETS.PUBLISH.type + qos
        : SUPPORTED_PACKETS.PUBLISH.type))
    let topicLen = topic.length
    let packid = produceEmptyBytes(this.idQueue < 0xff ? this.idQueue : this.idQueue = 1)
    let totalLen = topic.length + message.length + packid.length + 2 
    let arrayLike = [
        //Fixed header
        qosID,
        // Fixed header remaining length
        ...encodeRemainingLength(totalLen),
       ,
       ...encodeRemainingLength(topicLen),
        ...topic,
        ...packid,
        ...message
    ]
    let buffer: any = Buffer.from(arrayLike)
    return buffer 
}

//console.log(publishMessage(Buffer.from([74, 65, 73, 74]), Buffer.from([0x30, 0xd, 0x0, 0x4, 74, 65, 73, 74, 68, 65, 0x6c, 0x6c, 0x6f]), 2))
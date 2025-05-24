import { connect_Payload } from "./connectPacket";
import {
    DestructurePayload_Publish,
    DestructurePayload_PubRec,
    DestructurePayload_PublishAck,
    DestructurePayload_PublishComp,
    DestructurePayload_PublishRelease
} from "./publishPacket";
import { DestructurePayload_Subscribe } from "./subscribePacket";
import { DestructurePayload_UnSubscribe } from "./unsubscribePackets";
import { DestructurePayload } from "./ByteManupulator";
let bufferll = Buffer.from([
  0x82, 0x25, 0x48, 0x68, 0x00, 0x08, 0x61, 0x63,
  0x73, 0x2f, 0x74, 0x65, 0x6d, 0x70, 0x02, 0x00,
  0x0a, 0x6b, 0x76, 0x62, 0x2f, 0x73, 0x63, 0x72,
  0x65, 0x65, 0x6e, 0x02, 0x00, 0x08, 0x74, 0x65,
  0x6d, 0x70, 0x2f, 0x61, 0x69, 0x72, 0x02
]);
export function checkPayload(payload) {

  //  console.log("p15",payload)
    let offset = 1
    let buffers = []
    let padding = 1
    let executedLen = 0 
    while (executedLen <= payload.length) {
        let byte = ((payload[offset] >> 7) & 1)
        let buffer = Buffer.from([])
        if (!byte) {
            let length = payload.subarray(offset, offset + padding).reduce((prev, curr) => prev + curr)
            buffer = Buffer.from(payload.subarray(offset - 1, offset + length + 1))
            executedLen += buffer.length
            buffers.push(
                buffer
            )
            payload = payload.subarray(buffer.length)
            padding = 1
            offset = 1
        }
        padding += byte
        offset += byte
    }
    return buffers

}


//console.log("48",checkPayload(bufferll))
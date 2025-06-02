export function checkPayload(payload:Buffer) {

  //  console.log("p15",payload)
    let offset = 1
    const buffers:Buffer[] = []
    let padding = 1
    let executedLen = 0 
    while (executedLen <= payload.length) {
        const byte:number = ((payload[offset] >> 7) & 1)
        let buffer:Buffer = Buffer.from([])
        if (!byte) {
            const length = payload.subarray(offset, offset + padding).reduce((prev, curr) => prev + curr)
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
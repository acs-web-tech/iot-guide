export function ExtractUnamePassword(eventDataHex):Array<string>{
    let buffer = Buffer.from(eventDataHex,"hex")
    let bufferLength = buffer.byteLength
    let credentials = buffer.subarray(29,bufferLength).toString()
    let split_credentials = credentials.match(/[a-z0-9A-Z]+/igm)
    return split_credentials
        
}
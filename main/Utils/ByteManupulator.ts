import { PacketStructure } from "./Interface/packets"
export function ExtractUnamePassword(eventDataHex):Array<string>{
    let buffer = Buffer.from(eventDataHex,"hex")
    let bufferLength = buffer.byteLength
    let credentials = buffer.subarray(29,bufferLength).toString()
    let split_credentials = credentials.match(/[a-z0-9A-Z]+/igm)
    buffer.forEach((value)=>{
        console.log(value);
    })
    return split_credentials
        
}
export function DestructurePayload(eventDataHex:Buffer):PacketStructure{
    // The following code is implemented only for testing after verifying it's accuracy refactoring required 
     let tempLengthHolder:number = 0  
     let buffer:Buffer = eventDataHex
     let packetType:Buffer = buffer.subarray(0,2)
     tempLengthHolder = packetType.byteLength 
     let protocolLength:Buffer = buffer.subarray(tempLengthHolder,tempLengthHolder+2)
     tempLengthHolder += protocolLength.byteLength
     let protocolName = buffer.subarray(tempLengthHolder,tempLengthHolder+4)
     tempLengthHolder += protocolName.byteLength
     let protocolLevel:Buffer = buffer.subarray(tempLengthHolder,tempLengthHolder+1)
     tempLengthHolder += protocolLevel.byteLength
     let connectFlag = buffer.subarray(tempLengthHolder,tempLengthHolder+1)  
     tempLengthHolder += connectFlag.byteLength
     let aliveTime:Buffer = buffer.subarray(tempLengthHolder,tempLengthHolder+2)
     tempLengthHolder += aliveTime.byteLength
     let clientidlen:any = buffer.subarray(tempLengthHolder,tempLengthHolder+2) 
     tempLengthHolder += clientidlen.byteLength
     let clientid =buffer.subarray(tempLengthHolder,tempLengthHolder+parseInt(clientidlen.toString("hex"),16)) 
     tempLengthHolder += clientid.byteLength
     let usernameLen =buffer.subarray(tempLengthHolder,tempLengthHolder+2)
     tempLengthHolder+=usernameLen.byteLength
    let username = buffer.subarray(tempLengthHolder,tempLengthHolder+parseInt(usernameLen.toString("hex"),16))
    tempLengthHolder+=username.byteLength
    let passwordLen =buffer.subarray(tempLengthHolder,tempLengthHolder+2)
    tempLengthHolder +=passwordLen.byteLength
    let password = buffer.subarray(tempLengthHolder,tempLengthHolder+parseInt(passwordLen.toString("hex"),16))
    return {packetType,protocolLength,protocolName,protocolLevel,connectFlag,username,password}
}
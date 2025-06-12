export function extractID(idBuffer:Buffer):number{
    const idStringHex = idBuffer.toString("hex")
    return parseInt(idStringHex,16)
} 
export function handleTimeout(){

}
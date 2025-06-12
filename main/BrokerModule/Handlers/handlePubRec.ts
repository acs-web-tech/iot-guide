import { extractID } from "../../Utils/getResponseType"
import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
export  function processPubRec(identifier,socket){
   let id =  extractID(identifier)
   if(this.publisherQueue[id]){
    socket.write(Buffer.from([SUPPORTED_PACKETS.PUBRELRESP.type,0x2,...identifier]))
   }
}
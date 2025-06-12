import { destructurePayloadPublish } from "../../Utils/publishPacket"
import { deliverMessage } from "../../Utils/messageDeliveryQueue"
import { extractID } from "../../Utils/getResponseType"
export  function processPending(cliendID,topic, socket) {   
  let subscriptionTopic = this.subscription?.[topic]?.[cliendID]
  let pendingMessage:any = this.pendingQueue?.[cliendID]?.[topic]
  pendingMessage = pendingMessage?Object.values(pendingMessage):[]
  console.log("8",pendingMessage,this.pendingQueue)
  if(subscriptionTopic){
  for(const bufs of pendingMessage) {
    // add dup flag
    let idBuffer = destructurePayloadPublish(bufs).identifier
    let id = extractID(idBuffer)
    socket?.write(bufs)
   // bufferSend[0] = bufferSend[0] | 0x08
    //console.log("pen",bufferSend)   
  }
  // delete this.pendingQueue?.[cliendID]
  }
  return true
}
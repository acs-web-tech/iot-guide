import { DestructurePayload_Publish } from "../../Utils/publishPacket"
import { selectByClientIdOnly, deleteDataByIdentifier, selectByIdentifier, select, selectByClientId, selectTopic } from "../../DBSqlite/crudOperations"
import { deliverMessage } from "../../Utils/messageDeliveryQueue"
export async function processPending(dbconnection, cliendID,topic, socket) {
  let sel = await select(dbconnection,["*"],"qos_2_pending_list")
  let pendingMessage: any = await selectByClientId(dbconnection, ["payload", "topic", "client_id", "identifier"], "qos_2_pending_list", [cliendID,topic])
  let hasSubscription:any = await selectByClientId(dbconnection, ["topic", "client_id"], "subscription", [cliendID,topic])
   //console.log("pen",pendingMessage)
  if(hasSubscription.length>0){
  for await (const message of pendingMessage) {
    // add dup flag
    let bufferSend = message.payload
    let payload = DestructurePayload_Publish(message.payload)
   // bufferSend[0] = bufferSend[0] | 0x08
    //console.log("pen",bufferSend)
    let buf = bufferSend
    socket.write(bufferSend)
    let deletePendingMessage = await deleteDataByIdentifier(
      dbconnection,
      [payload.identifier],
      "qos_2_pending_list"
    )
  
    
  }

  }
  return true
}
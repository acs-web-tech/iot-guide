import { DestructurePayload_Publish } from "../../Utils/publishPacket"
import { selectByClientIdOnly, deleteDataByIdentifier, selectByIdentifier, select, selectByClientId } from "../../DBSqlite/crudOperations"
export async function processPending(dbconnection, cliendID,topic, socket) {
  let pendingMessage: any = await selectByClientId(dbconnection, ["payload", "topic", "client_id", "identifier"], "qos_2_pending_list", [cliendID,topic])
  let hasSubscription:any = await selectByClientId(dbconnection, ["topic", "client_id"], "subscription", [cliendID,topic])
  if(hasSubscription.length>0){
  for await (const message of pendingMessage) {
    // add dup flag
    let bufferSend = message.payload
    bufferSend[0] = bufferSend[0] | 0x08
    let deletePendingMessage = await deleteDataByIdentifier(
      dbconnection,
      [message.identifier],
      "qos_2_pending_list"
    )
    if(socket.readyState =="open"){
    socket.write(bufferSend)
    }
    
  }

  }
  return true
}
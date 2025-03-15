import { selectByClientId,deleteDataByIdentifier } from "../../DBSqlite/crudOperations"
export async function processPending(dbconnection,cliendID,connectionState) {
     let pendingMessage:any = await selectByClientId(dbconnection,["payload","topic","client_id","identifier"],"qos_2_pending_list",cliendID)
     pendingMessage.forEach(async (message)=>{
         let socket = connectionState.get(message.client_id)
         if(!socket.destroyed){
           socket.write(message.payload)
           let deletePendingMessage = await deleteDataByIdentifier(
            dbconnection,
            [message.identifier],
            "qos_2_pending_list"
           )
         }
   })
  
}
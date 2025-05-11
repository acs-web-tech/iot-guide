import { select,deleteDataByClientID } from "../../DBSqlite/crudOperations"
export async function processDisconnect(dbconnection,cliendID,socket,clean){
                     let index = 0 
                     if(clean != 0 ){
                     for(let subscribers of this.subscriberDeliveryQueue){
                         if(subscribers.cliendID == cliendID.toString()){
                               this.subscriberDeliveryQueue.splice(index,1)
                          
                          index++
                     }
                   }
                   let clientRemoved = await deleteDataByClientID(dbconnection.inMemory,
                     [
                          cliendID
                     ],
                     "connection"
                )
                let subscriptionRemoved = await deleteDataByClientID(dbconnection.inMemory,
                     [
                          cliendID
                     ],
                     "subscription"
                )
                let removePending = await deleteDataByClientID(dbconnection.inMemory,
                     [
                          cliendID
                     ],
                     "qos_2_pending_list"
                )
                let removeRetainMessage = await deleteDataByClientID(dbconnection.inMemory,
                     [
                          cliendID
                     ],
                     "retain_messages"
                )   
               }
                clearTimeout(socket.timerID)      
}
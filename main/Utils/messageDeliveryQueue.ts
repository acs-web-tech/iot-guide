import { deleteDataByIdentifier,insertData,select,selectByClientId,selectByClientIdOnly } from "../DBSqlite/crudOperations"
import { DestructurePayload_Publish } from "./publishPacket"
export async function deliverMessage(deliveryQueue: Array<any>, payload,qos=null,message, dbconnection, socketQueue: Map<any, any>) {
   return deliveryQueue.map(async (value, index) => {
        let socket = socketQueue.get(value.client_id.toString())
     let identifier = DestructurePayload_Publish(message).identifier
       if(((!socket||socket.destroy) && qos == 2)){    
            let addPendingList = await insertData([
                value.client_id,
                identifier,
                value.topic,
                message
            ],
            dbconnection,
            "qos_2_pending_list"
        )
        let pendingMessage: any = await select(dbconnection, ["payload", "topic", "client_id", "identifier"], "qos_2_pending_list")
        }
        socket?.write(message)
        if (deliveryQueue.length - 1 == index) {
            if (payload.qos == 0) {
                let deleteStatus = deleteDataByIdentifier(dbconnection, [message.identifier],"publish")
            }
        }
        return true;
    })
}
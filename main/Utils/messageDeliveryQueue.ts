import { deleteDataByIdentifier,insertData } from "../DBSqlite/crudOperations"
export  function deliverMessage(deliveryQueue: Array<any>, payload,qos=null,message, dbconnection, socketQueue: Map<any, any>) {
    deliveryQueue.forEach(async (value, index) => {
        let socket = socketQueue.get(value.client_id.toString())
        if(!socket.destroyed){
        socket.write(message)
        }
        if(socket.destroyed && qos == 2){
            let addPendingList = await insertData([
                value.client_id,
                value.identifier,
                value.topic,
                message
            ],
            dbconnection,
            "qos_2_pending_list"
        ) 
        }
        if (deliveryQueue.length - 1 == index) {
            if (payload.qos == 0) {
                let deleteStatus = deleteDataByIdentifier(dbconnection, [message.identifier],"publish")
            }
        }
    })
}
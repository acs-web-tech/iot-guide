import { deleteDataByIdentifier } from "../DBSqlite/crudOperations"
export function deliverMessage(deliveryQueue: Array<any>, payload,message, dbconnection, socketQueue: Map<any, any>) {
    deliveryQueue.forEach((value, index) => {
        let socket = socketQueue.get(value.client_id)
        socket.write(message)
        if (deliveryQueue.length - 1 == index) {
            if (payload.qos == 0) {
                let deleteStatus = deleteDataByIdentifier(dbconnection, [message.identifier],"publish")
            }
        }
    })
}
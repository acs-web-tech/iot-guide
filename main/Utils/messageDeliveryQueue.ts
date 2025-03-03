import { deleteData } from "../DBSqlite/crudOperations"
export function deliverMessage(deliveryQueue: Array<any>, payload,message, dbconnection, socketQueue: Map<any, any>) {
    deliveryQueue.forEach((value, index) => {
        let socket = socketQueue.get(value.client_id)
        console.log("5",socket,deliveryQueue)
        socket.write(message)
        if (deliveryQueue.length - 1 == index) {
            if (payload.qos == 0) {
                let deleteStatus = deleteData(dbconnection, "publish", [message.identifier])
            }
        }
    })
}
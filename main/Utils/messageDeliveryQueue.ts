import { deleteDataByIdentifier } from "../DBSqlite/crudOperations"
export function deliverMessage(deliveryQueue: Array<any>, payload,message, dbconnection, socketQueue: Map<any, any>) {
    console.log("clientsub",deliveryQueue)
    deliveryQueue.forEach((value, index) => {
        console.log(value)
        let socket = socketQueue.get(value.client_id.toString())
        socket.write(message)
        if (deliveryQueue.length - 1 == index) {
            if (payload.qos == 0) {
                let deleteStatus = deleteDataByIdentifier(dbconnection, [message.identifier],"publish")
            }
        }
    })
}
import { deleteData } from "../DBSqlite/crudOperations"
export function deliverMessage(deliveryQueue: Array<any>, payload, message, dbconnection, socketQueue: Map<any, any>) {
    return new Promise((resolve, reject) => {
        deliveryQueue.forEach((value, index) => {
            let socket = socketQueue.get(value.client_id)
            socket.write(message)

            if (deliveryQueue.length - 1 == index) {
                if (payload.qos == 0) {
                    let deleteStatus = deleteData(dbconnection, "publish", [message.identifier])
                }
                resolve(true)
            }
        })
    })
}
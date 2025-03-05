import { deleteData, select } from "../../DBSqlite/crudOperations"
import { generateResponeUnSuback } from "../../Utils/ByteManupulator"
import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
export async function processUnSubscribe(dbconnection, clientID, identifier, topic, socket) {
    let deleteStatus = await deleteData(dbconnection,
        [
            clientID,
            topic
        ],
        "subscription"
    )
    this.subscriberDeliveryQueue.forEach((subscriber, index) => {
        if (subscriber.topic == topic) {
            this.subscriberDeliveryQueue.splice(index, 1)
        }
    });
    generateResponeUnSuback(SUPPORTED_PACKETS.UNSUBACK.type, identifier, socket)
} 
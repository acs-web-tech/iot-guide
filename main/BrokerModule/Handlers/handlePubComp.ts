import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
import { selectByIdentifier, deleteDataByIdentifier } from "../../DBSqlite/crudOperations"
import { deliverMessage } from "../../Utils/messageDeliveryQueue"
import { generateResponePuback } from "../../Utils/ByteManupulator"
export async function processPubComp(dbconnection, cliendID, payload, connectionState, socket) {
    let publishMessage: any = await selectByIdentifier(dbconnection, ["topic", "identifier"], "publish", [payload.identifier])
    let avaliableSubscribers = this.subscriberDeliveryQueue.filter((subscriber) => subscriber.topic == publishMessage.topic)
    if (avaliableSubscribers.length > 0) {
        this.subscriberDeliveryQueue.forEach((subscriber, index) => {
            if (subscriber.cliendID == cliendID && subscriber.topic == publishMessage.topic) {
                this.subscriberDeliveryQueue.splice(index, 1)
            }
        })
    }
    if(avaliableSubscribers.length<=0){
         let deleteStatus = await  deleteDataByIdentifier(dbconnection,["identifier"],"publish")
    }
    console.log("18",this.subscriberDeliveryQueue)

}
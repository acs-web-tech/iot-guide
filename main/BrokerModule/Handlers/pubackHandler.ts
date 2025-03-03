import { selectByID } from "../../DBSqlite/crudOperations"
export async function processPubAck(dbconnection,payload) {
    let topics: any = await selectByID(dbconnection, ["*"], "subscription", [payload.identifier])
                    let isRemaining = this.subscriberDeliveryQueue.filter((value, index) => {

                         if (value.topic == topics.topic) {
                              this.subscriberDeliveryQueue.splice(index, 1)
                              return true
                         }

                    })
}
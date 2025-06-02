import { selectByClientIdOnly } from "../../DBSqlite/crudOperations";
import { publishMessage } from "./sendPublish";
export  function processWill(cliendID, socket) {
    let connection: any = this.connection?.[cliendID]
    console.log("will",connection,this.connection)
    if (connection) {
        if (connection.willMessage) {
            return  publishMessage(connection.willMessageTopic, connection.willMessage, 2)
        }
    }
}
import { selectByClientIdOnly } from "../../DBSqlite/crudOperations";
import { publishMessage } from "./sendPublish";
export async function processWill(dbconnection, cliendID, socket) {
    let connection: any = await selectByClientIdOnly(dbconnection, ["*"], "connection", [cliendID])
    if (connection.length > 0) {
        if (connection[0].willmessage) {
            return  publishMessage(connection[0].willtopic, connection[0].willmessage, connection[0].qos)
        }
    }
}
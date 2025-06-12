import { publishMessage } from "./sendPublish";
export  function processWill(cliendID, socket) {
    let connection: any = this.connection?.[cliendID]
    if (connection) {
        if (connection.willMessage) {
            return  publishMessage.apply(this,[connection.willMessageTopic, connection.willMessage, 2])
        }
    }
}
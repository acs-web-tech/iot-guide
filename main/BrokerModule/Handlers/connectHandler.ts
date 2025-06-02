import { generateRespone } from "../../Utils/ByteManupulator"
export async function processConnect(responseType, requestData, reason,connection,socket) {
    this.connection[requestData.cliendID.toString()]= {
        cliendID:requestData.cliendID.toString(),
        qos:requestData.qos,
        retain:requestData.retain,
        willMessageLen:requestData.willMessageLen > 0 ? 1 : 0,
        willMessage:requestData.willMessage,
        willMessageTopic:requestData.willMessageTopic,
        clean:socket.clean,
        aliveTime:requestData.aliveTime,
        subscriptions:[]
    }
      // connack
    generateRespone(responseType, reason, socket)
    //let selectdata = await select(dbconnection, ["*"], "connection")

}
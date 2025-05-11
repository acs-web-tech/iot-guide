import { processDisconnect } from "./handleDisconnect"
export function processTimer(dbconnection,cliendID,keepAlive,socket,connectionState){
    let timerID = setTimeout( async ()=>{
                              let conn = dbconnection
                              let clId = cliendID
                              let soc = socket
                              await processDisconnect.apply(this,[conn,clId,soc,soc.clean])
                              //connectionState.delete(clId)
                              socket.destroy()
                        },keepAlive*1000)
                        socket.timerID = timerID
}
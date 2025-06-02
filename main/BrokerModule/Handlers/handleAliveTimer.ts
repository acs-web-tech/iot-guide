import { processDisconnect } from "./handleDisconnect"
export function processTimer(cliendID,keepAlive,socket,connectionState){
    let timerID = setTimeout( async ()=>{
                              let clId = cliendID
                              let soc = socket
                              await processDisconnect.apply(this,[clId,soc,soc.clean])
                              //connectionState.delete(clId)
                              socket.destroy()
                        },keepAlive*1000)
                        socket.timerID = timerID
}
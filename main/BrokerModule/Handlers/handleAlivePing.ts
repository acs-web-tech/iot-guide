import { processDisconnect } from "./handleDisconnect"
export function processTimerPing(dbconnection,cliendID, keepAlive, socket) {
      clearTimeout(socket.timerID)
      socket.timerID = setTimeout(() => {
            let conn = dbconnection
            let clId = cliendID
            let soc = socket
           // processDisconnect.apply(this, [conn, clId, soc])
      }, keepAlive)
}
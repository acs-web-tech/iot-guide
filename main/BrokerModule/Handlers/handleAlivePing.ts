import { processDisconnect } from "./handleDisconnect"
export function processTimerPing(cliendID, keepAlive, socket) {
      clearTimeout(socket.timerID)
      socket.timerID = setTimeout(() => {
            let clId = cliendID
            let soc = socket
           // processDisconnect.apply(this, [conn, clId, soc])
      }, keepAlive)
}
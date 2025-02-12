import * as net from "net";
import { BrokerEventHandler } from "./BrokerModule/main";
import { packets } from "./BrokerModule/Interfaces/Enums";
let initServer = net.createServer((socket) => {
   // Wrapper interface implemented here 
   socket.on("close", (action) => BrokerEventHandler.emit(action, socket))
   //Not Implemented
   socket.on("connect", (action) => {
      BrokerEventHandler.emitPayload(action, socket)
   })
   socket.on("data", (action) => {
      BrokerEventHandler.emitPayload(action, socket)
   })
})
initServer.listen(1883, () => {
   //Test
})
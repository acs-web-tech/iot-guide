import * as net from "net";
import {BrokerEventHandler} from "./BrokerModule/main";
import { packets } from "./BrokerModule/Interfaces/Enums";
let initServer = net.createServer((socket)=>{
   // Wrapper interface implemented here 
   socket.on("close",(action)=>BrokerEventHandler.emit(action))
   socket.on("connection",(action)=>BrokerEventHandler.emit(action))
   //Not Implemented
   socket.on("data",(action)=>{
   socket.write(packets.conack)

   BrokerEventHandler.emitPayload(action)
  })
})
initServer.listen(1883,()=>{
   //Test
})
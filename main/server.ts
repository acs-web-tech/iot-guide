import net from "net";
import BrokerEventHandler from "./BrokerModule/main";
let initServer = net.createServer((socket)=>{
   // Wrapper interface implemented here 
   socket.on("close",(action)=>BrokerEventHandler.emit(action))
   socket.on("connection",(action)=>BrokerEventHandler.emit(action))
   //Not Implemented
   socket.on("data",(action)=>BrokerEventHandler.emitPayload(action))
})
initServer.listen(1883,()=>{
   //Test
})
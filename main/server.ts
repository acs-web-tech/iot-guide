import * as net from "net";
import { BrokerEventHandler } from "./BrokerModule/main";
import { openDataBase,createTableDependency } from "./DBSqlite/init";
let inMemory = openDataBase(":memory:");
let onDisk = openDataBase("../Datastore/clients.db");
(async()=>await createTableDependency({inMemory,onDisk}))();
let initServer = net.createServer(async (socket) => {
  
   // Wrapper interface implemented here 
   let state = {}
   socket.on("close", (action) => BrokerEventHandler.emitPayload(action, socket,{onDisk,inMemory},state))
   //Not Implemented
   socket.on("connect", (action) => {
      BrokerEventHandler.emitPayload(action, socket,{onDisk,inMemory},state)
   })
   socket.on("data", (action) => {
      BrokerEventHandler.emitPayload(action, socket,{onDisk,inMemory},state)
   })
   socket.on("error",()=>{
      socket.destroy()
   })
})
initServer.listen(1883, () => {
   //Test
})
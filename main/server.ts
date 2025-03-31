import * as net from "net";
import { BrokerEventHandler } from "./BrokerModule/main";
import { openDataBase,createTableDependency } from "./DBSqlite/init";
let inMemory = openDataBase(":memory:")
let onDisk = openDataBase("../Datastore/clients.db")
let initServer = net.createServer(async (socket) => {
   let memory = await createTableDependency({inMemory,onDisk})
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
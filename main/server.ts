import * as net from "net";
import { BrokerEventHandler } from "./BrokerModule/main";
import { openDataBase,createTableDependency } from "./DBSqlite/init";
let inMemory = openDataBase(":memory:")
let onDisk = openDataBase("../Datastore/clients.db")
let initServer = net.createServer(async (socket) => {
   let memory = await createTableDependency({inMemory,onDisk})
   // Wrapper interface implemented here 
   socket.on("close", (action) => BrokerEventHandler.emit(action, socket))
   //Not Implemented
   socket.on("connect", (action) => {
      BrokerEventHandler.emitPayload(action, socket,{onDisk,inMemory})
   })
   socket.on("data", (action) => {
      BrokerEventHandler.emitPayload(action, socket,{onDisk,inMemory})
   })
})
initServer.listen(1883, () => {
   //Test
})
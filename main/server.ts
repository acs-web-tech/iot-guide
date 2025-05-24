import * as net from "net";
import { BrokerEventHandler } from "./BrokerModule/main";
import { openDataBase, createTableDependency } from "./DBSqlite/init";
import { checkPayload } from "./Utils/deStructure";
let inMemory = openDataBase(":memory:");
let onDisk = openDataBase("../Datastore/clients.db");
(async () => await createTableDependency({ inMemory, onDisk }))();
let initServer = net.createServer({}, async (socket) => {

   // Wrapper interface implemented here 
   let state = {}
   //Not Implemented
   socket.on("connect", (action) => {
      BrokerEventHandler.emitPayload(action, socket, { onDisk, inMemory }, state)
   })
   socket.on("data", (action) => {
      let bufs = checkPayload(action)
     // console.log("bfs",bufs)
      bufs.map((value) => {
         BrokerEventHandler.emitPayload(value, socket,{onDisk,inMemory},state)
      })
   })
   // socket.on("close",(action)=>{
   //    console.log("closed")
   //    BrokerEventHandler.emitPayload(400, socket,{onDisk,inMemory},state)
   // })
   socket.on("error", () => {
      BrokerEventHandler.emitPayload(400, socket, { onDisk, inMemory }, state)
      //socket.destroy()
   })
})
initServer.listen(1883, () => {
   //Test
})
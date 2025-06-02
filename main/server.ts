import * as tls from "tls";
import * as fs from "fs"
import { BrokerEventHandler } from "./BrokerModule/main"
import { checkPayload } from "./Utils/deStructure";
const PORT = 8883;
const ERROR_CODE = 400;
const initServer = tls.createServer({
  key: fs.readFileSync('./certs/server-key.pem'),
  cert: fs.readFileSync('./certs/server-cert.pem'),
  ALPNProtocols:["mqtt","mqtts"],
  rejectUnauthorized:false,
  requestCert:false

  }, function (socket) {

   // Wrapper interface implemented here 
   //Not Implemented
   socket.on("connect", (action) => {
      BrokerEventHandler.emitPayload(action, socket)
   })
   socket.on("data", (action) => {
      const bufs = checkPayload(action)
      bufs.forEach((value) => {
         BrokerEventHandler.emitPayload(value, socket)
      })
   })
   // socket.on("close",()=>{
   //     BrokerEventHandler.emitPayload(400, socket, { onDisk, inMemory }, state)
   // })
   socket.on("tlsClientError", (err) => {
      console.warn("error",err)
      BrokerEventHandler.emitPayload(ERROR_CODE, socket)
   })
   socket.on("error", (err) => {
      console.warn("error",err)
      BrokerEventHandler.emitPayload(ERROR_CODE, socket)
   })
})
initServer.listen(PORT, () => {
   //Test
   console.log("running")
})
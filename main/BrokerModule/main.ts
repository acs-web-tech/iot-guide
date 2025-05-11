import EventConfig from "./Interfaces/BrokerEvent";
import { SUPPORTED_PACKETS } from "./Interfaces/Enums";
import { ExtractUnamePassword, DestructurePayload, generateRespone, generateResponePuback, generateResponeSuback, generateResponePing } from "../Utils/ByteManupulator";
import { validatePayload, validatePublish } from "../Utils/PayloadValidation";
import { DestructurePayload_Publish, DestructurePayload_PubRec, DestructurePayload_PublishAck, DestructurePayload_PublishRelease, DestructurePayload_PublishComp } from "../Utils/publishPacket";
import { DestructurePayload_UnSubscribe } from "../Utils/unsubscribePackets";
import { DestructurePayload_Subscribe } from "../Utils/subscribePacket"
import { bytesConsumed } from "../Utils/connectPacket";
import { select, insertData, update, selectByID, selectTopic } from "../DBSqlite/crudOperations";
import { deliverMessage } from "../Utils/messageDeliveryQueue";
import { processConnect } from "./Handlers/connectHandler";
import { validateConnection } from "./Handlers/validateConnect";
import { processPublish } from "./Handlers/handlePublish";
import { processSubscribe } from "./Handlers/handleSubscribe";
import { processPubRel } from "./Handlers/pubrelHandler";
import { processPubAck } from "./Handlers/pubackHandler";
import { processUnSubscribe } from "./Handlers/unsubscribeHandler";
import { processPubComp } from "./Handlers/handlePubComp";
import { processPending } from "./Handlers/handlePending";
import { processPubRec } from "./Handlers/handlePubRec";
import { processDisconnect } from "./Handlers/handleDisconnect";
import { processTimer } from "./Handlers/handleAliveTimer";
import * as sqlite from "sqlite3";
import * as net from "net"
import { subscribe } from "diagnostics_channel";
import { deleteDataByClientID } from "../DBSqlite/crudOperations";
import { processTimerPing } from "./Handlers/handleAlivePing";
import { processWill } from "./Handlers/handleWill";
let connectionState = new Map()
export class BrokerEventHandler {
     public static state: any = { reject: false, reasonCode: 0, request: {}, socket: {} };
     public static publishHandlerCallback: Function | null = null
     public static subscribeHandlerCallback: Function | null = null
     public static diskConnection: sqlite.Database | null = null
     public static inMemory;
     public static memoeryConnection: sqlite.Database | null = null
     public static subscriberDeliveryQueue = []
     public static subscribers = {}
     public static publisherQueue = {}
     public static retainQueue = new Map()
     public static pendingQueue = new Map()
     public static eventData
     public static clients  = new Map()
     constructor() {

     }
     @validatePayload
     public static async validateRequest(payload: Buffer, dbconnection): Promise<boolean | null> {
          let password = this.state.request.password.toString()
          let username = this.state.request.username.toString()
          let credentials_from_db: any = await select(dbconnection.onDisk, ["username", "password"], "clients")
          credentials_from_db = credentials_from_db[0] ?? null
          if (credentials_from_db != null && username == credentials_from_db.username && credentials_from_db.password == password) {
               return true
          }

          return null
     }
     @validatePublish
     public static handlePublish(payload) {
          if (this.state.reasonCode != 0) throw new Error("Need a Proper connection first!")
          let publishProcess = this.publishHandlerCallback(this.state)
          return publishProcess
     }
     public static async emitPayload<EventConfig>(EventData, socket, dbconnection, state) {
          let payload;
          this.eventData = EventData
          this.diskConnection = dbconnection.onDisk
          this.inMemory = dbconnection.inMemory
          switch ((EventData[0] & ~((1 << 4) - 1))) {
               // 10 Represents connection packet
               case SUPPORTED_PACKETS.CONNECT.type:
                    payload = DestructurePayload(EventData)
                    let action = await this.validateRequest(EventData, dbconnection)
                    let reason = this.state.reasonCode
                    let responseType = SUPPORTED_PACKETS.CONNACK.type
                    socket.aliveTime = payload.aliveTime
                    let keepAlive = socket.aliveTime
                    let cliendID = payload.cliendID.toString()
                    socket.state = payload
                    console.log("conn",socket.state)
                    socket.clean = ((payload.flags >> 1) & 1)
                    // Error generation function required to replace these code
                    connectionState.set(cliendID, socket)
                   
                         let requestData = socket.state
                         let process = await processConnect.apply(this,[
                              dbconnection.inMemory,
                              responseType,
                              requestData,
                              reason,
                              socket])

                    
                    processTimer.apply(
                         this,
                         [
                              dbconnection,
                              cliendID,
                              keepAlive,
                              socket,
                              connectionState
                         ]
                    )
                    validateConnection(responseType, reason, socket)
                    break;
               case SUPPORTED_PACKETS.PUBLISH.type:
                    if (this.state.request.type == 16) {
                         payload = DestructurePayload_Publish(EventData)
                         let topic = payload.topic.toString()
                         cliendID = socket.state.cliendID.toString()
                         await processPublish.apply(this,
                              [
                                   dbconnection.inMemory,
                                   responseType,
                                   EventData,
                                   topic,
                                   cliendID,
                                   payload,
                                   connectionState,
                                   payload.payload,
                                   socket,
                              ]
                         )
                    }
                    break;
               case SUPPORTED_PACKETS.SUBSCRIBE.type:
                    payload = DestructurePayload_Subscribe(EventData)
                    let topic = payload.topic.toString()
                    responseType = SUPPORTED_PACKETS.SUBACK.type
                    cliendID = socket.state.cliendID.toString()
                    await processSubscribe.apply(this,[
                         dbconnection.inMemory,
                         responseType,
                         cliendID,
                         payload,
                         topic,
                         connectionState,
                         socket])
                         await processPending(
                         dbconnection.inMemory,
                         cliendID,
                         topic,
                         socket)
                    break;
               case SUPPORTED_PACKETS.PUBREL.type:
                    payload = DestructurePayload_PublishRelease(EventData)
                    await processPubRel.apply(this,
                         [
                              dbconnection.inMemory,
                              payload,
                              connectionState,
                              socket
                         ]
                    )
                    break;
               case SUPPORTED_PACKETS.PUBREC.type:
                    payload = DestructurePayload_PubRec(EventData)
                    await processPubRec(dbconnection.inMemory, payload.identifier, socket)
                    break;
               case SUPPORTED_PACKETS.PUBACK.type:
                    payload = DestructurePayload_PublishAck(EventData)
                    await processPubAck.apply(this,
                         [
                              dbconnection.inMemory,
                              payload
                         ]
                    )
                    break;
               case SUPPORTED_PACKETS.PUBCOMP.type:
                    cliendID = socket.state.cliendID.toString()
                    payload = DestructurePayload_PublishComp(EventData)
                    await processPubComp.apply(
                         this,
                         [
                              dbconnection.inMemory,
                              cliendID,
                              payload,
                              connectionState,
                              socket
                         ]
                    )
                    break;
               case SUPPORTED_PACKETS.UNSUBSCRIBE.type:
                    payload = DestructurePayload_UnSubscribe(EventData)
                    let identifier = payload.identifier
                    cliendID = socket.state.cliendID.toString()
                    topic = payload.topic.toString()
                    await processUnSubscribe.apply(
                         this,
                         [
                              dbconnection.inMemory,
                              cliendID,
                              identifier,
                              topic,
                              socket
                         ]
                    )
                    break;
               case SUPPORTED_PACKETS.PINGREQ.type:
                    cliendID = socket.state.cliendID.toString()
                    processTimerPing.apply(this, [dbconnection, cliendID, keepAlive, socket])
                    generateResponePing(SUPPORTED_PACKETS.PINGRESP.type, keepAlive, socket)
                    break;
               case SUPPORTED_PACKETS.DISCONNECT.type:
                    cliendID = socket.state.cliendID.toString()
                    await processDisconnect.apply(this, [dbconnection, cliendID, connectionState,socket.clean])
                    connectionState.delete(cliendID)
                    socket.destroy()
                    break;
               default:
                    //Unexpected disconnection
                    if(socket.state){
                    if (EventData == 400) {
                         console.log("dis",socket.state)
                         let cliendID = socket.state.cliendID.toString()
                         let block: any = await processWill(dbconnection.inMemory, cliendID, socket)
                         let payload = DestructurePayload_Publish(block.buffer)
                         let subscribedClients: any = await selectTopic(
                              dbconnection.inMemory,
                              [
                                   "client_id",
                                   "topic",
                                   "qos"
                              ],
                              "subscription",
                              [payload.topic.toString()]
                         )
          
                         await deliverMessage(
                              subscribedClients,
                              payload,
                              payload.qos,
                              block.buffer,
                              dbconnection.inMemory,
                              connectionState
                         )
                         await 
                         await processDisconnect.apply(this, [dbconnection, cliendID, connectionState,socket.clean])

                         connectionState.delete(cliendID)
                         socket.destroy()
                         break;
                    }

          }
     }


     }

}
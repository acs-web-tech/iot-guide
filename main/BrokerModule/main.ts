import EventConfig from "./Interfaces/BrokerEvent";
import { SUPPORTED_PACKETS } from "./Interfaces/Enums";
import { ExtractUnamePassword, DestructurePayload, generateRespone, generateResponePuback, generateResponeSuback, generateResponePing } from "../Utils/ByteManupulator";
import { validatePayload, validatePublish } from "../Utils/PayloadValidation";
import { Request_State } from "./Interfaces/EventConfig";
import { PacketStructure } from "../Utils/Interface/packets";
import { ReasonCode, ReasonCode_PUBACK } from "./Interfaces/EventConfig";
import { TakeDecision } from "../Utils/getResponseType";
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
import * as sqlite from "sqlite3";
import * as net from "net"
let connectionState = new Map()
export class BrokerEventHandler {
     public static state: any = { reject: false, reasonCode: 0, request: {}, socket: {} };
     public static publishHandlerCallback: Function | null = null
     public static subscribeHandlerCallback: Function | null = null
     public static diskConnection: sqlite.Database | null = null
     public static inMemory;
     public static memoeryConnection: sqlite.Database | null = null
     public static subscriberDeliveryQueue = []
     public static publisherQueue = []
     public static eventData
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
                    let action = await this.validateRequest(EventData, dbconnection)
                    let reason = this.state.reasonCode
                    let responseType = SUPPORTED_PACKETS.CONNACK.type
                    let keepAlive = this.state.request.keepAlive
                    let cliendID = this.state.request.cliendID.toString()
                    socket.state = this.state.request
                    // Error generation function required to replace these code
                    if (action && !this.state.reject) {
                         let requestData = socket.state
                         connectionState.set(cliendID, socket)
                         let process = await processConnect(
                              dbconnection.inMemory,
                              responseType,
                              requestData,
                              reason,
                              socket
                         )

                    }
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
                    await processSubscribe(
                         dbconnection.inMemory,
                         responseType,
                         cliendID,
                         payload,
                         topic,
                         connectionState,
                         socket)

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
                    generateResponePing(SUPPORTED_PACKETS.PINGRESP.type, keepAlive, socket)
                    break;
               case SUPPORTED_PACKETS.DISCONNECT.type:
                    connectionState.delete(cliendID)
                    socket.destroy()
                    break;
               // Unexpected disconnection
               case 400:
                    break;

          }
     }

}
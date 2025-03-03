import EventConfig from "./Interfaces/BrokerEvent";
import { SUPPORTED_PACKETS } from "./Interfaces/Enums";
import { ExtractUnamePassword, DestructurePayload, generateRespone, generateResponePuback, generateResponeSuback } from "../Utils/ByteManupulator";
import { validatePayload, validatePublish } from "../Utils/PayloadValidation";
import { Request_State } from "./Interfaces/EventConfig";
import { PacketStructure } from "../Utils/Interface/packets";
import { ReasonCode, ReasonCode_PUBACK } from "./Interfaces/EventConfig";
import { TakeDecision } from "../Utils/getResponseType";
import { DestructurePayload_Publish, DestructurePayload_PublishAck, DestructurePayload_PublishRelease } from "../Utils/publishPacket";
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
import * as sqlite from "sqlite3";
let connectionState = new Map()
export class BrokerEventHandler {
     private EventState: Object = new Object();
     private Activities = new Map();
     public static eventData: Buffer;
     public static state: any = { reject: false, reasonCode: 0, request: {}, socket: {} };
     public static publishHandlerCallback: Function | null = null
     public static subscribeHandlerCallback: Function | null = null
     public static diskConnection: sqlite.Database | null = null
     public static memoeryConnection: sqlite.Database | null = null
     public static subscriberDeliveryQueue = []
     public static publisherQueue = []
     constructor() {

     }
     // Start1: Validations are still to be extended
     public static emit<EventConfig>(EventData, socket) {
          console.log(EventData)
     }
     private addConnection(timeStamp: Date, cliendID: string) {

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

     public static async emitPayload<EventConfig>(EventData, socket, dbconnection) {
          this.eventData = EventData
          this.diskConnection = dbconnection.onDisk
          this.memoeryConnection = dbconnection.inMemory
          let payload;
          switch ((EventData[0] & ~((1 << 4) - 1))) {
               // 10 Represents connection packet

               case SUPPORTED_PACKETS.CONNECT.type:
                    let action = await this.validateRequest(EventData, dbconnection)
                    let reason = this.state.reasonCode
                    let responseType = SUPPORTED_PACKETS.CONNACK.type
                    // Error generation function required to replace these code
                    if (action && !this.state.reject) {
                         let requestData = this.state.request
                         let process = await processConnect(
                              dbconnection.inMemory,
                              responseType,
                              requestData,
                              reason,
                              socket
                         )
                         break;
                    }
                    validateConnection(responseType, reason, socket)
                    generateRespone(responseType, 5, socket)
                    break;
               case SUPPORTED_PACKETS.PUBLISH.type:
                    if (this.state.request.type == 16) {
                         payload = DestructurePayload_Publish(EventData)
                         let requestData = this.state
                         let topic = payload.topic.toString()
                         let cliendID = requestData.request.cliendID.toString()
                         connectionState.set(cliendID, socket)
                         await processPublish(
                              dbconnection.inMemory,
                              responseType,
                              EventData,
                              topic,
                              cliendID,
                              payload,
                              connectionState,
                              socket)
                    }
                    break;
               case SUPPORTED_PACKETS.SUBSCRIBE.type:
                    payload = DestructurePayload_Subscribe(EventData)
                    let requestData = this.state
                    let clientID = requestData.request.cliendID.toString()
                    let topic = payload.topic.toString()
                    responseType = SUPPORTED_PACKETS.SUBACK.type
                    connectionState.set(clientID, socket)
                    await processSubscribe(
                         dbconnection.inMemory,
                         responseType, clientID,
                         payload,
                         topic,
                         connectionState,
                         socket)
                    break;
               case SUPPORTED_PACKETS.PUBREL.type:
                    requestData = this.state
                    payload = DestructurePayload_PublishRelease(EventData)
                    await processPubRel(
                         dbconnection.inMemory,
                         payload,
                         connectionState,
                         socket
                    )
                    break;
               case SUPPORTED_PACKETS.PUBACK.type:
                    requestData = this.state
                    payload = DestructurePayload_PublishAck(EventData)
                    await processPubAck.apply(this,
                         [
                              dbconnection,
                              payload
                         ]
                    )
                    break;
          }
     }
}
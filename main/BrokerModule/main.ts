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
import { select, insertData, update, selectByID } from "../DBSqlite/crudOperations";
import { deliverMessage } from "../Utils/messageDeliveryQueue";
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
          //console.log(credentials_from_db, username, password)
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
          //console.log(dbconnection)
          switch ((EventData[0] & ~((1 << 4) - 1))) {
               // 10 Represents connection packet

               case SUPPORTED_PACKETS.CONNECT.type:

                    let action = await this.validateRequest(EventData, dbconnection)
                    //this.state.socket = socket
                    let reason = this.state.reasonCode
                    let responseType = SUPPORTED_PACKETS.CONNACK.type
                    // Error generation function required to replace these code
                    if (action && !this.state.reject) {
                         let requestData = this.state.request
                         let statusInsert = await insertData([requestData.cliendID,
                         requestData.qos,
                         requestData.retain,
                         requestData.willMessageLen > 0 ? 1 : 0,
                         requestData.willMessage,
                         requestData.clean,
                         requestData.aliveTime,
                              null
                         ],
                              dbconnection.inMemory,
                              "connection"
                         )
                         let selectdata = await select(dbconnection.inMemory, ["*"], "connection")
                         //console.log(selectdata)
                         generateRespone(responseType, reason, socket)
                         break;
                    }
                    if (reason == ReasonCode.BAD_USER_NAME_PASSWORD || reason == ReasonCode.NO_USERNAME_PASSWORD_FOUND) {
                         generateRespone(responseType, reason, socket)
                         break;
                    }
                    if (reason == ReasonCode.WILL_FLAG_SET_BUT_NO_MESSAGE || reason == ReasonCode.WILL_FLAG_SET_BUT_NO_TOPIC_PAYLOAD) {
                         generateRespone(responseType, reason, socket)
                         break;
                    }
                    if (reason == ReasonCode.UNSUPPORTED_PROTOCOL_VERSION || reason == ReasonCode.UNSUPPORTED_QOS_LEVEL) {
                         generateRespone(responseType, reason, socket)
                         break;
                    }
                    generateRespone(responseType, 5, socket)
                    break;
               case SUPPORTED_PACKETS.PUBLISH.type:
                    if (this.state.request.type == 16) {
                         payload = DestructurePayload_Publish(EventData)
                         let requestData = this.state
                         let topic = payload.topic.toString()
                         let cliendID = requestData.request.cliendID.toString()
                         connectionState.set(cliendID, socket)
                         if (payload.qos == 1) {
                              responseType = SUPPORTED_PACKETS.PUBACK.type
                         }
                         if (payload.qos == 2) {
                              responseType = SUPPORTED_PACKETS.PUBREC.type
                         }
                         let subscribedClients: any = await select(
                              dbconnection.inMemory,
                              [
                                   "client_id",
                                   "topic",
                                   "qos"
                              ],
                              "subscription",
                              [payload.topic]
                         )
                         if (payload.qos == 0) {
                            await  deliverMessage(
                                   subscribedClients,
                                   payload,
                                   EventData,
                                   dbconnection.inMemory,
                                   connectionState
                              )
                         }
                         if (payload.qos == 1) {
                             await deliverMessage(
                                   subscribedClients,
                                   payload,
                                   EventData,
                                   dbconnection.inMemory,
                                   connectionState
                              )
                              //generateResponePuback(responseType, payload.identifier, socket)

                         }
                         if (payload.qos == 2) {
                              console.log("qos")
                              let insertStatus = await insertData(
                                   [
                                        cliendID,
                                        payload.identifier,
                                        payload.topic,
                                        EventData,
                                        payload.retain,
                                        payload.qos,
                                        payload.qos == 1 ? 1 : 0,
                                        payload.qos == 1 || payload.qos == 0 ? 1 : 0
                                   ],
                                   dbconnection.inMemory,
                                   "publish"
                              )

                              subscribedClients.map((value) => {
                                   this.subscriberDeliveryQueue.push({ cliendID, ack: 0 })
                              })
                              generateResponePuback(responseType, payload.identifier, socket)
                         }
                    }
                    let selectdata = await select(dbconnection.inMemory, ["*"], "publish")
                    console.log("128", selectdata)
                    // Sample case


                    // if (payload.qos != 0 && payload.qos == 2) {
                    //      generateResponePuback(responseType, payload.identifier, socket)
                    //      responseType = SUPPORTED_PACKETS.PUBCOMP.type
                    //      // Do whatever in between
                    //      generateResponePuback(responseType, payload.identifier, socket)
                    // }
                    // if (payload.qos == 1) {
                    //      generateResponePuback(responseType, payload.identifier, socket)
                    // }

                    break;
               case SUPPORTED_PACKETS.SUBSCRIBE.type:
                    payload = DestructurePayload_Subscribe(EventData)
                    let requestData = this.state
                    let clientID = requestData.request.cliendID.toString()
                    let topic = payload.topic.toString()
                    responseType = SUPPORTED_PACKETS.SUBACK.type
                    let insertStatus = await insertData(
                         [
                              clientID,
                              payload.identifier,
                              topic,
                              payload.qos
                         ],
                         dbconnection.inMemory,
                         "subscription"
                    )
                    selectdata = await select(dbconnection.inMemory, ["*"], "subscription")
                    console.log(requestData)
                    connectionState.set(clientID, socket)
                    generateResponeSuback(responseType, payload.identifier, socket)
                    break;
               case SUPPORTED_PACKETS.PUBREL.type:
                    console.log('rel')
                    requestData = this.state
                    payload = DestructurePayload_PublishRelease(EventData)
                    let updateStatus = await update(dbconnection.inMemory, [1, payload.identifier])
                    let Message: any = await selectByID(dbconnection.inMemory, [
                         "client_id",
                         "topic",
                         "payload"
                    ],
                         "publish",
                         [payload.identifier]
                    )
                    let subscribedClients: any = await select(
                         dbconnection.inMemory,
                         [
                              "client_id",
                              "topic",
                              "qos"
                         ],
                         "subscription",
                         [payload.topic]
                    )
                    await deliverMessage(
                         subscribedClients,
                         payload,
                         Message.payload,
                         dbconnection.inMemory,
                         connectionState
                    )
                    generateResponePuback(SUPPORTED_PACKETS.PUBCOMP.type, payload.identifier, socket)
                    break;
               case SUPPORTED_PACKETS.PUBACK.type:
                    requestData = this.state
                    payload = DestructurePayload_PublishAck(EventData)
                    //  selectdata = await select(dbconnection.inMemory, ["*"], "publish")
                    //console.log(selectdata)
                    console.log("248", payload.identifier, EventData)
                    let topics: any = await selectByID(dbconnection.inMemory, ["*"], "subscription", [payload.identifier])
                    let isRemaining = this.subscriberDeliveryQueue.filter((value, index) => {

                         if (value.topic == topics.topic) {
                              this.subscriberDeliveryQueue.splice(index, 1)
                              return true
                         }

                    })
                    console.log("cleared", this.subscriberDeliveryQueue)
                    break;




          }
     }
}
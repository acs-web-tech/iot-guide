import EventConfig from "./Interfaces/BrokerEvent";
import { SUPPORTED_PACKETS } from "./Interfaces/Enums";
import {DestructurePayload, generateResponeSuback, generateResponePing } from "../Utils/ByteManupulator";
import { validatePayload, validatePublish } from "../Utils/PayloadValidation";
import {destructurePayloadPublish, destructurePayloadPubRec, destructurePayloadPublishAck, destructurePayloadPublishRelease, destructurePayloadPublishComp } from "../Utils/publishPacket";
import { destructurePayloadUnSubscribe } from "../Utils/unsubscribePackets";
import { destructurePayloadSubscribe } from "../Utils/subscribePacket"
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
import { processTimerPing } from "./Handlers/handleAlivePing";
import { processWill } from "./Handlers/handleWill";
let connectionState = new Map()
export class BrokerEventHandler {
     public static state: any = { reject: false, reasonCode: 0, request: {}, socket: {} };
     public static publishHandlerCallback: Function | null = null
     public static subscription = {}
     public static diskConnection: sqlite.Database | null = null
     public static inMemory;
     public static memoeryConnection: sqlite.Database | null = null
     public static subscriberDeliveryQueue = []
     public static subscribers = {}
     public static publisherQueue = {}
     public static retainQueue = new Map()
     public static pendingQueue = {}
     public static socketQueue = new Map()
     public static idQueue = 0
     public static connection = {}
     public static eventDataHex ;
       public static eventData;
     constructor() {
     }
     @validatePayload
     public static async validateRequest(payload: Buffer): Promise<boolean | null> {
          let password = this.state.request.password.toString()
          let username = this.state.request.username.toString()
          if (username == "arun" && password == "1234") {
               return true
          }

          return null
     }
     @validatePublish
     public static handlePublish(payload) {
          if (this.state.reasonCode != 0) throw new Error("Need a Proper connection first!")
          let publishProcess = this.publishHandlerCallback?this.publishHandlerCallback(this.state):null
          return publishProcess
     }
     public static  emitPayload<EventConfig>(EventData, socket) {
          let payload;
          this.eventDataHex = EventData
          this.eventData = EventData
          switch ((EventData[0] & ~((1 << 4) - 1))) {
               // 10 Represents connection packet
               case SUPPORTED_PACKETS.CONNECT.type:
                    //console.log("cenn",EventData)
                    payload = DestructurePayload(EventData)
                    let action =  this.validateRequest(EventData)
                    let reason = this.state.reasonCode
                    let responseType = SUPPORTED_PACKETS.CONNACK.type
                    socket.aliveTime = payload.aliveTime
                    let keepAlive = socket.aliveTime
                    let cliendID = payload.cliendID.toString()
                    socket.state = payload
                    //console.log("conn",socket.state)
                    socket.clean = ((payload.flags >> 1) & 1)
                    // Error generation function required to replace these code
                    this.socketQueue.set(cliendID,socket)
                         let requestData = socket.state
                         let process =  processConnect.apply(this,[
                              responseType,
                              requestData,
                              reason,
                              this.connection,
                              socket])

                    
                    processTimer.apply(
                         this,
                         [
                              cliendID,
                              keepAlive,
                              socket,
                              connectionState
                         ]
                    )
                    validateConnection(responseType, reason, socket)
                    break;
               case SUPPORTED_PACKETS.PUBLISH.type:
                    if (true) {
                         payload = destructurePayloadPublish(EventData)
                         let topic = payload.topic.toString()
                         cliendID = socket.state.cliendID.toString()
                          processPublish.apply(this,
                              [
                                   EventData,
                                   topic,
                                   cliendID,
                                   payload,
                                   payload.payload,
                                   socket,
                              ]
                         )
                    }
                    break;
               case SUPPORTED_PACKETS.SUBSCRIBE.type:
                    payload = destructurePayloadSubscribe(EventData)
                    let topic = payload.topic.toString()
                    responseType = SUPPORTED_PACKETS.SUBACK.type
                    cliendID = socket.state.cliendID.toString()
                     processSubscribe.apply(this,[
                         responseType,
                         cliendID,
                         payload,
                         topic,
                         connectionState,
                         socket])
                         processPending.apply(this,[
                         cliendID,
                         topic,
                         socket
                    ])
                    break;
               case SUPPORTED_PACKETS.PUBREL.type:
                    //console.log("pubrel",EventData)
                    payload = destructurePayloadPublishRelease(EventData)
                    processPubRel.apply(this,
                         [
                              payload,
                              connectionState,
                              socket
                         ]
                    )
                    break;
               case SUPPORTED_PACKETS.PUBREC.type:
                    payload = destructurePayloadPubRec(EventData)
                    processPubRec.apply(this,[payload.identifier, socket])
                    break;
               case SUPPORTED_PACKETS.PUBACK.type:
                    {
                    payload = destructurePayloadPublishAck(EventData)
                    let identifier = payload.identifier
                    processPubAck.apply(this,[identifier])
                    }
                    break;
               case SUPPORTED_PACKETS.PUBCOMP.type:
                    cliendID = socket.state.cliendID.toString()
                    payload = destructurePayloadPublishComp(EventData)
                    processPubComp.apply(
                         this,
                         [
                              cliendID,
                              payload,
                              connectionState,
                              socket
                         ]
                    )
                    break;
               case SUPPORTED_PACKETS.UNSUBSCRIBE.type:
                    payload = destructurePayloadUnSubscribe(EventData)
                    let identifier = payload.identifier
                    cliendID = socket.state.cliendID.toString()
                    topic = payload.topic.toString()
                    processUnSubscribe.apply(
                         this,
                         [
                              cliendID,
                              identifier,
                              topic,
                              socket
                         ]
                    )
                    break;
               case SUPPORTED_PACKETS.PINGREQ.type:
                    cliendID = socket.state.cliendID.toString()
                    processTimerPing.apply(this, [ cliendID, keepAlive, socket])
                    generateResponePing(SUPPORTED_PACKETS.PINGRESP.type, keepAlive, socket)
                    break;
               case SUPPORTED_PACKETS.DISCONNECT.type:
                    console.log("dis")
                    cliendID = socket.state.cliendID.toString()
                    processDisconnect.apply(this, [cliendID, socket ,socket.clean])
                    this.socketQueue.delete(cliendID)
                    socket.destroy()
                    break;
               default:
                    //Unexpected disconnection
                    if(socket.state){
                    if (EventData == 400) {
                         let cliendID = socket.state.cliendID.toString()
                         let block: any = processWill.apply(this,[ cliendID, socket])
                         console.log("blk",block)
                         if(block){
                         let payload:any = destructurePayloadPublish(block)
                         let subscribedClients: any = Object.keys(this.subscription[payload.topic]||{})
                         console.log("dissub",subscribedClients)
                          deliverMessage.apply(this,
                              [
                              subscribedClients,
                              payload.qos,
                              block,
                              payload.topic.toString(),
                              ]
                         ) 
                    }
                          processDisconnect.apply(this, [cliendID,socket,socket.clean])

                         this.socketQueue.delete(cliendID)
                        
                         break;
                    }

          }
     }


     }

}
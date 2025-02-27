import EventConfig from "./Interfaces/BrokerEvent";
import { packets, SUPPORTED_PACKETS } from "./Interfaces/Enums";
import { ExtractUnamePassword, DestructurePayload, generateRespone } from "../Utils/ByteManupulator";
import { validatePayload, validatePublish } from "../Utils/PayloadValidation";
import { Request_State } from "./Interfaces/EventConfig";
import { PacketStructure } from "../Utils/Interface/packets";
import { ReasonCode } from "./Interfaces/EventConfig";
import { TakeDecision } from "../Utils/getResponseType";
import { DestructurePayload_Publish } from "../Utils/publishPacket";
import { bytesConsumed } from "../Utils/connectPacket";
export class BrokerEventHandler {
     private EventState: Object = new Object();
     private Activities = new Map();
     public static eventData: Buffer;
     public static state: any = { reject: false, reasonCode: 0, request: {}, actionState: [] };
     public static publishHandlerCallback: Function | null = null
     constructor() {

     }
     // Start1: Validations are still to be extended
     public static emit<EventConfig>(EventData, socket) {
          console.log(EventData)
     }
     private addConnection(timeStamp: Date, cliendID: string) {

     }
     @validatePayload
     public static validateRequest(payload: Buffer): boolean | null {
          let password = this.state.request.password.toString()
          let username = this.state.request.username.toString()
          console.log(username, password)
          if (password == "1234" && username == "arun900") {
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
     public static emitPayload<EventConfig>(EventData, socket) {
          this.eventData = EventData
          let eventDataHex: string = EventData.toString("hex")
          console.log("worled", (EventData[0] & ~((1 << 4) - 1)))
          switch ((EventData[0] & ~((1 << 4) - 1))) {
               // 10 Represents connection packet

               case SUPPORTED_PACKETS.CONNECT.type:
                    let action = this.validateRequest(EventData)
                    let reason = this.state.reasonCode
                    let responseType = SUPPORTED_PACKETS.CONNACK.type
                    // Error generation function required to replace these code
                    if (action && !this.state.reject) {
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
                    reason = this.state.reasonCode
                    responseType = SUPPORTED_PACKETS.CONNACK.type
                    this.publishHandlerCallback = function (payload) {
                         let topic = payload.request.topic.toString()
                         if (topic == "test/topic") {
                              let response = Buffer.from([0x40, 0x02, ...payload.request.identifier, 0])
                              socket.write(response)
                         }
                    }
                    this.handlePublish(EventData)
                    break;
          }
     }
}
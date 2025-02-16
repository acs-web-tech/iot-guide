import EventConfig from "./Interfaces/BrokerEvent";
import { packets } from "./Interfaces/Enums";
import { ExtractUnamePassword, DestructurePayload } from "../Utils/ByteManupulator";
import { validatePayload } from "../Utils/PayloadValidation";
import { Request_State } from "./Interfaces/EventConfig";
import { PacketStructure } from "../Utils/Interface/packets";
import { ReasonCode } from "./Interfaces/EventConfig";
export class BrokerEventHandler {
     private EventState: Object = new Object();
     private Activities = new Map();
     public static eventData: Buffer;
     public static state: any = { reject: false, reasonCode: 0, request: {} };
     constructor() {

     }
     // Start1: Validations are still to be extended
     public static emit<EventConfig>(EventData, socket) {
          console.log(EventData)
     }
     private addConnection(timeStamp: Date, cliendID: string) {

     }
     @validatePayload
     public static validateRequest(payload: Buffer):boolean|null {
               let password = this.state.request.password.toString()
               let username = this.state.request.username.toString()
               console.log(username,password)
               if (password == "1234" && username == "arun900") {
                    return true
               }
          
          return null
     }
     public static emitPayload<EventConfig>(EventData, socket) {
          this.eventData = EventData
          let eventDataHex: string = EventData.toString("hex")
          let action = this.validateRequest(EventData)
          switch (this.state.request.type) {
               // 10 Represents connection packet
          
               case 16:
                    
                    let reason = this.state.reasonCode
                    // Error generation function required to replace these code
                    if (action && !this.state.reject) {
                         socket.write(packets.conack)
                         break;
                    }
                    if (reason == ReasonCode.BAD_USER_NAME_PASSWORD || reason == ReasonCode.NO_USERNAME_PASSWORD_FOUND ) {
                         socket.write(packets.conaerror)
                         break;
                    }
                    if (reason == ReasonCode.WILL_FLAG_SET_BUT_NO_MESSAGE || reason == ReasonCode.WILL_FLAG_SET_BUT_NO_TOPIC_PAYLOAD) {
                         socket.write(packets.conaauthorerr)
                         break;
                    }
                    if(reason == ReasonCode.UNSUPPORTED_PROTOCOL_VERSION || reason == ReasonCode.UNSUPPORTED_QOS_LEVEL){
                         socket.write(packets.connprotocolerror)
                         break;
                    }
                    socket.write(packets.conaauthorerr)
                    break;
          }
     }
}
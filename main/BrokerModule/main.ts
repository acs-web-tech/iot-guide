import EventConfig from "./Interfaces/BrokerEvent";
import { packets } from "./Interfaces/Enums";
import { ExtractUnamePassword,DestructurePayload } from "../Utils/ByteManupulator";
export class BrokerEventHandler {
     private EventState: Object = new Object()
     //private Stages:<  = 
     constructor() {

     }
     // Start1: Validations are still to be extended
     public static emit<EventConfig>(EventData, socket) {
          console.log(EventData)
     }
     public static checkCredentials(payload) {
          let plainPayload  = DestructurePayload(payload)
          return plainPayload.username.toString() == "arun" && plainPayload.password.toString() == "1234"
     }
     public static emitPayload<EventConfig>(EventData, socket) {
          let eventDataHex: string = EventData.toString("hex")
          let action = parseInt(eventDataHex.substring(0, 2))
          console.log(eventDataHex)
          switch (action) {
               // 10 Represents connection packet
               case 10:
                    if (this.checkCredentials(EventData)) {
                         socket.write(packets.conack)
                         break;
                    }
                    socket.write(packets.conaerror)
                    break;
               }
     }
}
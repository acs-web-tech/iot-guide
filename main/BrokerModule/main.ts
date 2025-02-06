import EventConfig from "./Interfaces/BrokerEvent";
import { packets } from "./Interfaces/Enums";
import { ExtractUnamePassword } from "../Utils/ByteManupulator";
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
          let [username, password] = ExtractUnamePassword(payload)
          return username == "arun" && password == "1234"
     }
     public static emitPayload<EventConfig>(EventData, socket) {
          let eventDataHex: string = EventData.toString("hex")
          let action = parseInt(eventDataHex.substring(0, 2))
          switch (action) {
               // 10 Represents connection packet
               case 10:
                    if (this.checkCredentials(eventDataHex)) {
                         socket.write(packets.conack)
                         break;
                    }
                    socket.write(packets.conaerror)
                    break;
               }
     }
}
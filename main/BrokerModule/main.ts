import EventConfig from "./Interfaces/BrokerEvent";
import { packets } from "./Interfaces/Enums";
import { ExtractUnamePassword, DestructurePayload } from "../Utils/ByteManupulator";

export class BrokerEventHandler {
     private EventState: Object = new Object()
     private Activities = new Map()
     constructor() {

     }
     // Start1: Validations are still to be extended
     public static emit<EventConfig>(EventData, socket) {
          console.log(EventData)
     }
     private addConnection(timeStamp: Date, cliendID: string) {

     }
     public static validateRequest(payload) {
          let plainPayload = DestructurePayload(payload)
          if (plainPayload.protocolLevel == 4) {
               let trimUser = plainPayload.username.toString("ascii")
               let trimPassword = plainPayload.password.toString("ascii")
               return trimUser == "arun900" && trimPassword == "1234"
          }
          return null
     }
     public static emitPayload<EventConfig>(EventData, socket) {
          let eventDataHex: string = EventData.toString("hex")
          let action = DestructurePayload(EventData)
          switch (action.type) {
               // 10 Represents connection packet
               case 16:
                    if (this.validateRequest(EventData)) {

                         socket.write(packets.conack)
                         break;
                    }
                    socket.write(packets.conaerror)
                    break;
          }
     }
}
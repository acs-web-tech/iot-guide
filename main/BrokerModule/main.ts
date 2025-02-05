import EventConfig from "./Interfaces/BrokerEvent";
import { packets } from "./Interfaces/Enums";
export  class BrokerEventHandler{
    private EventState:Object = new Object() 
    //private Stages:<  = 
    constructor(){

    }
    // Start1: Validations are still to be extended
    public static emit<EventConfig>(EventData){
         console.log(EventData)
    }
    public static emitPayload<EventConfig>(EventData,socket){
     let eventDataHex:string = EventData.toString("hex")
     let action = parseInt(eventDataHex.substring(0,2))
       // 10 Represents connection packet
        if(action == 10){
          socket.write(packets.conack)
        }
   }
}
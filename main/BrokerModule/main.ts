import EventConfig from "./Interfaces/BrokerEvent";
export default class BrokerEventHandler{
    private EventState:Object = new Object() 
    //private Stages:<  = 
    constructor(){

    }
    // Start1: Validations are still to be extended
    public static emit<EventConfig>(EventData){
         console.log(EventData)
    }
    public static emitPayload<EventConfig>(EventData){
         if(EventData != null){
              
         }
    }
    // End1
}
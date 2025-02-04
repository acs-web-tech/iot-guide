import EventConfig from "./Interfaces/BrokerEvent";
export  class BrokerEventHandler{
    private EventState:Object = new Object() 
    //private Stages:<  = 
    constructor(){

    }
    // Start1: Validations are still to be extended
    public static emit<EventConfig>(EventData){
         console.log(EventData)
    }
    public static emitPayload<EventConfig>(EventData){
        console.log(EventData)
   }
}
import EventConfig from "./Interfaces/BrokerEvent";
export default class BrokerEventHandler{
    private EventState:Object = new Object() 
    constructor(){

    }
    public static emit<EventConfig>(EventData){
         console.log(EventData)
    }
}
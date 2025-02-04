"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerEventHandler = void 0;
var BrokerEventHandler = /** @class */ (function () {
    //private Stages:<  = 
    function BrokerEventHandler() {
        this.EventState = new Object();
    }
    // Start1: Validations are still to be extended
    BrokerEventHandler.emit = function (EventData) {
        console.log(EventData);
    };
    BrokerEventHandler.emitPayload = function (EventData) {
        console.log(EventData);
    };
    return BrokerEventHandler;
}());
exports.BrokerEventHandler = BrokerEventHandler;

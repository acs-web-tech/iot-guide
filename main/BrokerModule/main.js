"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerEventHandler = void 0;
var Enums_1 = require("./Interfaces/Enums");
var BrokerEventHandler = /** @class */ (function () {
    //private Stages:<  = 
    function BrokerEventHandler() {
        this.EventState = new Object();
    }
    // Start1: Validations are still to be extended
    BrokerEventHandler.emit = function (EventData, socket) {
        console.log(EventData);
    };
    BrokerEventHandler.emitPayload = function (EventData, socket) {
        var eventDataHex = EventData.toString("hex");
        var action = parseInt(eventDataHex.substring(0, 2));
        // 10 Represents connection packet
        if (action == 10) {
            socket.write(Enums_1.packets.conack);
        }
    };
    return BrokerEventHandler;
}());
exports.BrokerEventHandler = BrokerEventHandler;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrokerEventHandler = void 0;
var Enums_1 = require("./Interfaces/Enums");
var ByteManupulator_1 = require("../Utils/ByteManupulator");
var BrokerEventHandler = /** @class */ (function () {
    //private Stages:<  = 
    function BrokerEventHandler() {
        this.EventState = new Object();
    }
    // Start1: Validations are still to be extended
    BrokerEventHandler.emit = function (EventData, socket) {
        console.log(EventData);
    };
    BrokerEventHandler.checkCredentials = function (payload) {
        var _a = (0, ByteManupulator_1.ExtractUnamePassword)(payload), username = _a[0], password = _a[1];
        return username == "arun" && password == "1234";
    };
    BrokerEventHandler.emitPayload = function (EventData, socket) {
        var eventDataHex = EventData.toString("hex");
        var action = parseInt(eventDataHex.substring(0, 2));
        switch (action) {
            // 10 Represents connection packet
            case 10:
                if (this.checkCredentials(eventDataHex)) {
                    socket.write(Enums_1.packets.conack);
                    break;
                }
                socket.write(Enums_1.packets.conaerror);
                break;
        }
    };
    return BrokerEventHandler;
}());
exports.BrokerEventHandler = BrokerEventHandler;

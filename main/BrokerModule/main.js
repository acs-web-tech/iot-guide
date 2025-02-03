"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var BrokerEventHandler = /** @class */ (function () {
    function BrokerEventHandler() {
        this.EventState = new Object();
    }
    BrokerEventHandler.emit = function (EventData) {
        console.log(EventData);
    };
    BrokerEventHandler.emitPayload = function (EventData) {
        console.log(EventData)

    };
    return BrokerEventHandler;
}());
exports.default = BrokerEventHandler;

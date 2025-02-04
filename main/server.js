"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var net = require("net");
var main_1 = require("./BrokerModule/main");
var initServer = net.createServer(function (socket) {
    // Wrapper interface implemented here 
    socket.on("close", function (action) { return main_1.BrokerEventHandler.emit(action); });
    socket.on("connection", function (action) { return main_1.BrokerEventHandler.emit(action); });
    //Not Implemented
    socket.on("data", function (action) { return main_1.BrokerEventHandler.emitPayload(action); });
});
initServer.listen(1883, function () {
    //Test
});

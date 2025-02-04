"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packets = void 0;
var node_buffer_1 = require("node:buffer");
var packets = {
    conack: node_buffer_1.Buffer.from([0x20, 0x02, 0x00, 0x00])
};
exports.packets = packets;

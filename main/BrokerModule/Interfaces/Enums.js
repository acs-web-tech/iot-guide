"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packets = void 0;
var node_buffer_1 = require("node:buffer");
var packets = {
    connect: node_buffer_1.Buffer.from([0x10, 0x14, 0x00, 0x04, 0x4D, 0x51, 0x54, 0x54, 0x04, 0x02, 0x00, 0x3C, 0x00, 0x00]),
    conack: node_buffer_1.Buffer.from([0x20, 0x02, 0x00, 0x00]), // 0x20,
    puback: node_buffer_1.Buffer.from([0x40, 0x02, 0x12, 0x34])
};
exports.packets = packets;

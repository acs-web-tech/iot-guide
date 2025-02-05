"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var node_buffer_1 = require("node:buffer");
var sourceBuffer = node_buffer_1.Buffer.from("hello", "utf-8");
console.log(sourceBuffer.toString("utf-8"));

import {Buffer} from "node:buffer" 
let sourceBuffer = Buffer.from("hello","utf-8")
console.log(sourceBuffer.toString("utf-8"))
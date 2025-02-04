import { Buffer } from "node:buffer"
let packets = {
    conack:Buffer.from([0x20, 0x02, 0x00, 0x00])
}
export {packets}
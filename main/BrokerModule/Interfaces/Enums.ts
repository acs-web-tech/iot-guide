import { Buffer } from "node:buffer"
// Packet will be removed after forming all packets
let packets = {
    //connect: Buffer.from([0x10, 0x14, 0x00, 0x04, 0x4D, 0x51, 0x54, 0x54, 0x04, 0x02, 0x00, 0x3C, 0x00, 0x00]),
   // conack: Buffer.from([0x20, 0x02, 0x00, 0x00]),
    //conaerror: Buffer.from([0x20, 0x02, 0x00, 0x04]),
    //conaauthorerr: Buffer.from([0x20, 0x02, 0x00, 0x05]),
    //connprotocolerror: Buffer.from([0x20, 0x02, 0x00, 0x01]),// 0x20,
    publish: Buffer.from([0x30, 0x12, 0x00, 0x0A, 0x74, 0x65, 0x73, 0x74,
        0x2F, 0x74, 0x6F, 0x70, 0x69, 0x63, 0x48, 0x65,
        0x6C, 0x6C, 0x6F]),
    puback: Buffer.from([0x40, 0x02, 0x00, 0x01]),
    pubrec: Buffer.from([0x50, 0x02, 0x00, 0x01]),
    pubrel: Buffer.from([0x62, 0x02, 0x00, 0x01]),
    pubcomp: Buffer.from([0x70, 0x02, 0x00, 0x01])
}
let ERROR_CODE_CONNACK = {
    ACCEPTED:0,
    BAD_PROTOCOL:1,
    BAD_IDENTITY:2,
    SERVER_UNAVAILABLE:3,
    BAD_CREDENTIALS:4,
    NOT_AUTHORIZED:5
}
export let SUPPORTED_PACKETS = {
    CONNECT: {type:16},
    CONNACK: {type:32,remainingLength:2},
    PUBLISH: {type:3},
    PUBACK: 64,
    PUBREC: 80,
    PUBREL: 96,
    PUBCOMP: 112,
    SUBSCRIBE: 128,
    SUBACK: 144,
    UNSUBSCRIBE: 160,
    UNSUBACK: 176,
    PINGREQ: 192,
    PINGRESP: 208,
    DISCONNECT: 224
}
export enum flags {
    CONNACK_FLAG_WITH_USERNAME_PASSWORD = 194,
    //     CONNACK_FLAG_WITH_USERNAME_PASSWORD_CLEAN_SET= 192+flags.CONNACK_FLAG_WITH_USERNAME_PASSWORD
    //     CONNACK_FLAG_WITH_USERNAME_PASSWORD_CLEAN_SET_QOS_0 = CONNACK_FLAG_WITH_USERNAME_PASSWORD_CLEAN_SET
}
export { packets }
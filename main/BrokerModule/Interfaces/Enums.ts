import { Buffer } from "node:buffer"
let ERROR_CODE_CONNACK = {
    ACCEPTED: 0,
    BAD_PROTOCOL: 1,
    BAD_IDENTITY: 2,
    SERVER_UNAVAILABLE: 3,
    BAD_CREDENTIALS: 4,
    NOT_AUTHORIZED: 5
}
export let SUPPORTED_PACKETS = {
    CONNECT: { type: 16 },
    CONNACK: { type: 32, remainingLength: 2 },
    PUBLISH: { type: 48 },
    PUBACK: { type: 64, remainingLength: 2 },
    PUBREC: { type: 80 },
    PUBREL: { type: 96 },
    PUBCOMP: { type: 112 },
    SUBSCRIBE: { type: 128 },
    SUBACK: { type: 144, remainingLength: 3 },
    UNSUBSCRIBE: { type: 160 },
    UNSUBACK: { type: 176 , remainingLength:2 },
    PINGREQ: { type: 192 },
    PINGRESP: { type: 208 },
    DISCONNECT: { type: 224 }
}
export enum flags {
    CONNACK_FLAG_WITH_USERNAME_PASSWORD = 194,
    //     CONNACK_FLAG_WITH_USERNAME_PASSWORD_CLEAN_SET= 192+flags.CONNACK_FLAG_WITH_USERNAME_PASSWORD
    //     CONNACK_FLAG_WITH_USERNAME_PASSWORD_CLEAN_SET_QOS_0 = CONNACK_FLAG_WITH_USERNAME_PASSWORD_CLEAN_SET
}
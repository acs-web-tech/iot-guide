import { PacketStructure } from "../../Utils/Interface/packets"
export interface Request_State {
    reject: boolean,
    request: PacketStructure | { type: null },
    reasonCode: number
}
export enum ReasonCode {
    NO_USERNAME_PASSWORD_FOUND = 200,
    BAD_USER_NAME_PASSWORD = 300,
    UNSUPPORTED_QOS_LEVEL = 400,
    WILL_FLAG_SET_BUT_NO_MESSAGE = 500,
    UNSUPPORTED_PROTOCOL_VERSION = 600,
    WILL_FLAG_SET_BUT_NO_TOPIC_PAYLOAD = 700
}
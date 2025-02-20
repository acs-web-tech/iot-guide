import { PacketStructure } from "../../Utils/Interface/packets"
export interface Request_State {
    reject: boolean,
    request: PacketStructure | { type: null },
    reasonCode: number
}
export enum ReasonCode {
    NO_USERNAME_PASSWORD_FOUND = 4,
    BAD_USER_NAME_PASSWORD = 4,
    UNSUPPORTED_QOS_LEVEL = 5,
    WILL_FLAG_SET_BUT_NO_MESSAGE = 5,
    UNSUPPORTED_PROTOCOL_VERSION = 1,
    WILL_FLAG_SET_BUT_NO_TOPIC_PAYLOAD = 5,
    BAD_CLIENT_ID = 2 ,
    SERVER_UNAVAILABLE = 3,
    UN_ATHORIZED = 5
}
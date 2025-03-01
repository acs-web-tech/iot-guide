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
    UN_ATHORIZED = 5,
    MSG_NO_PAYLOAD = 6,

}

export enum ReasonCode_PUBACK {
   NO_MATCHING_SUBS = 16,
   UN_SPECIFIED_ERROR = 128,
   IMP_ERROR = 131,
   NOT_AUTHORIZED = 135,
   TOPIC_NAME_INVALID = 144,
   PACKET_IN_USE = 145,
   QUOTA_END = 151,
   INVALID_FORMAT = 153
}
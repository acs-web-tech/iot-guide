import { ReasonCode } from "../Interfaces/EventConfig";
import { generateRespone } from "../../Utils/ByteManupulator";
export function validateConnection(responseType, reason, socket) {
    if (reason == ReasonCode.BAD_USER_NAME_PASSWORD || reason == ReasonCode.NO_USERNAME_PASSWORD_FOUND) {
        generateRespone(responseType, reason, socket)
    }
    if (reason == ReasonCode.WILL_FLAG_SET_BUT_NO_MESSAGE || reason == ReasonCode.WILL_FLAG_SET_BUT_NO_TOPIC_PAYLOAD) {
        generateRespone(responseType, reason, socket)
    }
    if (reason == ReasonCode.UNSUPPORTED_PROTOCOL_VERSION || reason == ReasonCode.UNSUPPORTED_QOS_LEVEL) {
        generateRespone(responseType, reason, socket)
       
    }
    return reason
}
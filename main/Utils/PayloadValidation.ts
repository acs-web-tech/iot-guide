import { DestructurePayload } from "./ByteManupulator"
import { SUPPORTED_PACKETS } from "../BrokerModule/Interfaces/Enums"
import { PacketStructure } from "./Interface/packets"
import { ReasonCode } from "../BrokerModule/Interfaces/EventConfig"
export let validationFunction = {
    CONNECT: function (bufferdata: Buffer) {
        //    if(payload){

        //    }
    }
}
export function validatePayload(target, methodName, propdes: PropertyDescriptor) {
    let originalMethod = propdes.value
    propdes.value = function () {
        // for (let prop in SUPPORTED_PACKETS) {
        //     let bufferSingle = SUPPORTED_PACKETS[prop]
        //     if (this.eventData.includes(bufferSingle)) {
        //         let validator = validationFunction[prop]
        //         let state = validator(this.eventData)
        //         this.requestState = state
        //     }
        // }
        let plainPayload = DestructurePayload(this.eventData)
        if ((((plainPayload.flags) >> 6) & 1) == 0 && ((((plainPayload.flags) >> 7) & 1) == 0)) {
            this.state.reject = true
            this.state.reasonCode = ReasonCode.NO_USERNAME_PASSWORD_FOUND
        }
        if ((((plainPayload.flags) >> 3) & 0b11) > 3) {
            this.state.reject = true
            this.state.reasonCode = ReasonCode.UNSUPPORTED_QOS_LEVEL
        }
        if (plainPayload.protocolLevel != 4) {
            this.state.reject = true
            this.state.reasonCode = ReasonCode.UNSUPPORTED_PROTOCOL_VERSION
        }
        if (!plainPayload.willMessage) {
            this.state.reject = true
            this.state.reasonCode = ReasonCode.WILL_FLAG_SET_BUT_NO_MESSAGE
        }
        if (!plainPayload.willMessage) {
            this.state.reject = true
            this.state.reasonCode = ReasonCode.WILL_FLAG_SET_BUT_NO_TOPIC_PAYLOAD
        }
        this.state.request = plainPayload
        return originalMethod.apply(this, plainPayload)
    }
    return propdes
}
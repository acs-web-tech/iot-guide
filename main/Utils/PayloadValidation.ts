import { DestructurePayload } from "./ByteManupulator"
import { SUPPORTED_PACKETS } from "../BrokerModule/Interfaces/Enums"
import { PacketStructure } from "./Interface/packets"
import { ReasonCode } from "../BrokerModule/Interfaces/EventConfig"
import { DestructurePayload_Publish } from "./publishPacket"
export function validatePayload(target, methodName, propdes: PropertyDescriptor) {
    let decoratingMethod = propdes.value
    propdes.value = function () {
        let plainPayload = DestructurePayload(this.eventData)
        if ((((plainPayload.flags) >> 6) & 1) == 0 && ((((plainPayload.flags) >> 7) & 1) == 0)) {
            this.state.reject = true
            this.state.reasonCode = ReasonCode.NO_USERNAME_PASSWORD_FOUND
        }
        console.log((((plainPayload.flags) >> 3) & 0b11))
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
        if (!plainPayload.willMessageTopic) {
            this.state.reject = true
            this.state.reasonCode = ReasonCode.WILL_FLAG_SET_BUT_NO_TOPIC_PAYLOAD
        }
        this.state.request = plainPayload
        return decoratingMethod.apply(this, [plainPayload,{onDisk:this.diskConnection,inMemory:this.inMemory}])
    }
    return propdes
}

export function validatePublish(target, methodName, propdes) {
    let decoratingMethod = propdes.value
    propdes.value = function () {
        let plainPayload = DestructurePayload_Publish(this.eventData)
        if (plainPayload.payload.length == 0) {
            this.state.reasonCode = ReasonCode.MSG_NO_PAYLOAD
            this.state.reject = true
        }
        this.state.request = plainPayload
        return decoratingMethod.apply(this, plainPayload)
    }
    return propdes
}
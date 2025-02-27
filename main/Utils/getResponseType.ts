import { SUPPORTED_PACKETS } from "../BrokerModule/Interfaces/Enums"
// not needed
export function TakeDecision(type): number {
    let connType
    for (let props in SUPPORTED_PACKETS) {
        connType = (SUPPORTED_PACKETS[props].type & type)
        console.log(connType)
        if (connType == SUPPORTED_PACKETS[props].type) {
            break;
        }
    }
    return connType
}
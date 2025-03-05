import { Buffer } from "node:buffer"
export interface PacketStructure {

    type: number,
    remainingLength: number,
    protocolLength: number,
    protocolName: Buffer,
    protocolLevel: number,
    flags: number,
    aliveTime: number,
    clientLength: number,
    cliendID: Buffer,
    usernameLen: number,
    username: Buffer,
    password: Buffer,
    passwordLen: number,
    willMessageTopicLen: number,
    willMessageTopic: Buffer | null,
    willMessageLen: number,
    willMessage: Buffer | null

}
export interface PacketStructure_Publish {
    type: number,
    remainingLength: number,
    dup: number,
    qos: number,
    retain: number,
    topicLen: number,
    topic: Buffer | null,
    identifier: Buffer | null | number
    payload: Buffer | null
}
export interface PacketStructure_PublishRelease {
    type: number,
    remainingLength: number,
    identifier: Buffer | number | null
}
export interface PacketStructure_PublishReleaseAck {
    type: number,
    remainingLength:number,
    identifier: Buffer | null | number
}
export interface PacketStructure_Subscribe {
    type: number,
    remainingLength: number,
    qos: number,
    topicLen: number,
    topic: Buffer | null,
    identifier: Buffer | null | number
}
export interface PacketStructure_UnSubscribe {
    type: number,
    remainingLength: number,
    topicLen: number,
    topic: Buffer | null,
    identifier: Buffer | null | number
}
export let VaraiblesHex = {
    variableLength: Buffer.from([0x4, 0Xc2]),
    MQTTHEX: Buffer.from([0x4D, 51, 54, 54])
}
export let GLOBALS = {
    //3.1.1 version
    supportedVersionsDecimal: [4]
}
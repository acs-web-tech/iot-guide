export interface PacketStructure{
    packetType:Buffer,
    protocolLength:Buffer,
    protocolName:Buffer
    ,protocolLevel:Buffer,
    connectFlag:Buffer,
    username:Buffer,
    password:Buffer
}
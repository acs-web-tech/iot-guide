import { deleteDataByIdentifier } from "../../DBSqlite/crudOperations"
import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
export async function processPubRec(dbconnection,identifier,socket){
    console.log("corr",Buffer.from([SUPPORTED_PACKETS.PUBRELRESP.type,0x2,...identifier]))
    socket.write(Buffer.from([SUPPORTED_PACKETS.PUBRELRESP.type,0x2,...identifier]))

}
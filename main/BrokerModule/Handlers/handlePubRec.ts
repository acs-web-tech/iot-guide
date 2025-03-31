import { deleteDataByIdentifier } from "../../DBSqlite/crudOperations"
import { SUPPORTED_PACKETS } from "../Interfaces/Enums"
export async function processPubRec(dbconnection,identifier,socket){
    socket.write(Buffer.from([SUPPORTED_PACKETS.PUBRELRESP.type,0x2,...identifier]))

}
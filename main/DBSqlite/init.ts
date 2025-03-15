import * as sqlite from "sqlite3"
import { insertData, select, deleteData, showTables } from "./crudOperations"
export function openDataBase(path: string): sqlite.Database {
    let sqlite3 = sqlite.verbose()
    let database = new sqlite3.Database(path)
    return database
}
export async function createTableDependency(dbconnection) {
    let filterTables = await showTables(dbconnection.inMemory)
    let defaults = filterTables.map((value) => value.name)
    if (!defaults.includes("connection")) {
        let datastore_connection = dbconnection.inMemory.exec(`create table connection(
        client_id varchar,
        qos int , 
        retain int,
        haswill int ,
        willmessage varchar,
        clean int,
        keepalive int,
        start_time timestamp default current_timestamp
        )`)
    }
    if (!defaults.includes("subscription")) {
        let datastore_subscription = dbconnection.inMemory.exec(`create table subscription(
            client_id varchar,
            identifier varchar,
            topic varchar,
            qos int
            )`)
    }
    if (!defaults.includes("publish")) {
        let datastore_publish = dbconnection.inMemory.exec(`create table publish(
        client_id varchar,
        identifier varchar,
        topic varchar,
        payload blob,
        retain int,
        qos int,
        got_pub_rel int,
        is_completed int
        )`)
    }
    // if (!filterTables.includes("clients")) {
    //     let datastore_client = dbconnection.onDisk.exec(`create table clients(
    //     client_id varchar,
    //     username varchar,
    //     password varchar,
    //     is_admin int,
    //     admin_id varchar
    //     )`)
    // }


}

// async function StartTest() {
//     let inMemory = openDataBase(":memory:")
//     let onDisk = openDataBase("../../Datastore/clients.db")
//     //let memory = createTableDependency({inMemory,onDisk})
//     //await insertData(['76767uy', 'arun', '1234', 0, ''], onDisk)
//     let result =await  select(onDisk)
//     console.log(result)
// }
//StartTest()
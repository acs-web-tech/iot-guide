import * as sqlite from "sqlite3"
export function createTable(connection, tablename) {
    let checkTableExisits = connection.inMemory.exec("show tables")
}
export async function insertData(data: Array<any>, dbconnection, where) {
    return new Promise(async (resolve, reject) => {
        let lengthOfPrecedence = data.map((value) => "?")
        let insertStatus = dbconnection.run(`insert into ${where} values(${lengthOfPrecedence})`, data, (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}

export function select(connection, props, where, condition = []) {
    return new Promise(async (resolve, reject) => {
        let result = connection.all(
            `select ${props} from ${where} ${condition.length > 0 ? ` where topic =? ` : ";"} `,
            condition, (err, rows) => {
                if (!err) resolve(rows)
                if (err) reject(err)
            })
    })
}
export function selectTopic(connection, props, where, condition = []) {
    return new Promise(async (resolve, reject) => {
        let result = connection.all(
            `select ${props} from ${where}  where topic =?  `,
            condition, (err, rows) => {
                if (!err) resolve(rows)
                if (err) reject(err)
            })
    })
}
export function selectByIdentifier(connection, props, where, condition = []) {
    return new Promise(async (resolve, reject) => {
        let result = connection.all(
            `select ${props} from ${where}  where identifier =?  `,
            condition, (err, rows) => {
                if (!err) resolve(rows)
                if (err) reject(err)
            })
    })
}
// Don't use this in vital situations
export function deleteData(connection, condition = [], where) {
    return new Promise(async (resolve, reject) => {
        let result = connection.all(`delete  from ${where} where topic=? and client_id=? `, condition, (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}
export function deleteRetainMessage(connection, condition = [], where) {
    return new Promise(async (resolve, reject) => {
        let result = connection.all(`delete  from ${where} where topic=? `, condition, (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}
export function deleteDataByIdentifier(connection, condition = [], where) {
    return new Promise(async (resolve, reject) => {
        let result = connection.all(`delete  from ${where} where identifier=? `, condition, (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })

    })
}
export function deleteDataByClientID(connection, condition = [], where) {
    return new Promise(async (resolve, reject) => {
        let result = connection.all(`delete  from ${where} where client_id=? `, condition, (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })

    })
}
export function showTables(connection): Promise<Array<any>> {
    return new Promise(async (resolve, reject) => {
        let result = await connection.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {

            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}
export function update(connection, condition = []): Promise<Array<any>> {
    return new Promise(async (resolve, reject) => {
        let result = connection.all("update publish set got_pub_rel=? where  identifier=? ", condition, (err, rows) => {
          
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}
export function selectByID(connection, props, where, condition = []): Promise<Array<any>> {
    return new Promise(async (resolve, reject) => {
        let result = connection.all(`select ${props} from ${where} where identifier=? `, condition, (err, rows) => {
            
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}
export function selectByClientId(connection, props, where, condition = []): Promise<Array<any>> {
    return new Promise(async (resolve, reject) => {
        let result = await connection.all(`select ${props} from ${where} where client_id=? and topic=? `, condition, (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}

export function selectByClientIdOnly(connection, props, where, condition = []): Promise<Array<any>> {
    return new Promise(async (resolve, reject) => {
        let result = await connection.all(`select ${props} from ${where} where client_id=? `, condition, (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}
export function updateRetainMessage(connection, condition = [], where): Promise<Array<any>> {
    // [cliendID, payload.identifier, topic, receivedMessage]
    return new Promise(async (resolve, reject) => {
        let result = await connection.all(`update ${where}  set client_id=?
            , identifier=? , topic=? , payload=?  `, condition, (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}
export function updatePublish(connection, condition = [], where): Promise<Array<any>> {
    // [cliendID, payload.identifier, topic, receivedMessage]
    return new Promise(async (resolve, reject) => {
        let result = await connection.all(`update ${where}  set client_id=?
            , identifier=? , topic=? , payload=? , retain=? , qos=? , got_pub_rel=? , is_completed=? `, condition, (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}
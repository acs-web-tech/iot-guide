import * as sqlite from "sqlite3"
export function createTable(connection,tablename){
      let checkTableExisits = connection.inMemory.exec("show tables") 
}
export async function insertData(data:Array<any>,dbconnection,where){
    return new Promise((resolve,reject)=>{
        let lengthOfPrecedence = data.map((value)=>"?")
        let insertStatus = dbconnection.run(`insert into ${where} values(${lengthOfPrecedence})`,data,(err,rows)=>{
            if(!err)resolve(rows)
            if(err)reject(err)
            return;
        })
    })
  
}

export function select(connection,props,where,condition=[]) {
    return new Promise((resolve, reject) => {
        let result = connection.all(
            `select ${props} from ${where}
            ${condition.length>0?"client=? and topic =?":";"} `,
            [], (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}
// Don't use this in vital situations
export function deleteData(connection) {
    return new Promise((resolve, reject) => {
        let result = connection.all("delete  from clients", [], (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}
export function showTables(connection):Promise<Array<any>> {
    return new Promise((resolve, reject) => {
        let result = connection.all("SELECT name FROM sqlite_master WHERE type='table';", [], (err, rows) => {
            if (!err) resolve(rows)
            if (err) reject(err)
        })
    })
}
const mysql = require('mysql')
const { MYSQL_CONF } = '../conf/db.js'

const con = mysql.createConnection(MYSQL_CONF)

// 开始链接
con.connect()

// 统一执行sql语句函数
const exec = (sql) => {
    const Promise = new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if(err) {
                reject(err)
                return
            }
    
            resolve(result)
        })
    })
    
    return Promise
}

module.exports = {
    exec   
}


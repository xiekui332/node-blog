const { exec } = require('../db/mysql')

const login = (username, password) => {
    const sql = `SELECT username, realname FROM USERS WHERE username='${username}' and password='${password}';`
    return exec(sql).then(rows => {
        return rows[0] || {}
    })

    
}

module.exports = {
    login
}
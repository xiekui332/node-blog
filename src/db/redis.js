const redis = require('redis');
const { REDIS_CONF } = require('../conf/db.js')

const redisCLient = redis.createClient(REDIS_CONF.port, REDIS_CONF.host);


// 监听错误并抛出
redisCLient.on('error', err => {
    console.log(err)
})

function set(name, val) {
    if(typeof val === "object") {
        val = JSON.stringify(val)
    }
    redisCLient.set(name, val, redis.print)
}

function get(name) {
    const promise = new Promise((resolve, reject) => {
        redisCLient.get(name, (err, val) => {
            if(err) {
                reject(err)
                return
            }

            if(val == null) {
                resolve(null)
                return
            }

            try {
                resolve(JSON.parse(val))
            } catch (error) {
                resolve(val)
            }
        })
    })

    return promise
    
}

module.exports = {
    set,
    get
}
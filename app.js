const querystring = require('querystring')
const { set, get } = require('./src/db/redis')
const { access } = require('./src/utils/log')
const { handleBlogRouter } = require('./src/router/blog')
const { handleUserRouter } = require('./src/router/user')

// const SESSION_DATA = {}

const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}

// 处理postdata
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if(req.method !== "POST") {
            resolve({})
            return
        }

        if(req.headers['content-type'] !== 'application/json') {
            resolve({})
            return
        }

        let postData = ''

        req.on('data', chunk => {
            postData += chunk.toString()
        })

        req.on('end', () => {
            if(!postData) {
                resolve({})
                return
            }

            resolve(
                JSON.parse(postData)
            )
        })
    })

    return promise
}

const serverHandle = (req, res) => {
    // 记录access log
    access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

    // 设置返回格式
    res.setHeader('content-type', 'application/json')
    
    const url = req.url
    req.path = url.split('?')[0]
    req.query = querystring.parse(url.split('?')[1])

    // 解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ""
    cookieStr.split(';').forEach(element => {
        if(!element) {
            return
        }
        const arr = element.split('=')
        const key = arr[0].trim()
        const val = arr[1].trim()
        req.cookie[key] = val
    });

    

    // 解析session
    // let needSetCookie = false;
    // let userId = req.cookie.userid;
    // if(userId) {
    //     if(!SESSION_DATA[userId]) {
    //         SESSION_DATA[userId] = {}
    //     }
    // }else{
    //     needSetCookie = true;
    //     userId = `${Date.now()}_${Math.random()}`
    //     SESSION_DATA[userId] = {}
    // }
    // req.session = SESSION_DATA[userId]

    // 解析session (使用redis)
    let needSetCookie = false;
    let userId = req.cookie.userid;
    if(!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化redis中的 session 值
        set(userId, {})
    }

    // 获取session
    req.sessionId = userId
    get(req.sessionId).then((sessionData) => {
        if(sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, null)
            // 设置 session
            req.session = {}
        }else {
            // 设置 session
            req.session = sessionData
        }

        // 处理 post data
        return getPostData(req)
    })
    
    .then(postData => {
        req.body = postData
        
        const blogResult = handleBlogRouter(req, res)
        const userData = handleUserRouter(req, res)

        // 处理blog路由
        if(blogResult) {
            blogResult.then((blogData) => {
                if(needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }

                res.end(
                    JSON.stringify(blogData)
                ) 
            })
            return
        }

        // 处理user路由
        if(userData) {
            userData.then(result => {
                if(needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }

                res.end(
                    JSON.stringify(result)
                )
            })
            return
        }

        // 未名中路由
        res.writeHead(404, {'content-type':'text/plain'})
        res.write('404, Not Found \n')
        res.end()
    })
}

module.exports = {
    serverHandle
}
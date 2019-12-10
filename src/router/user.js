const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const { set } = require('../db/redis')



const handleUserRouter = (req, res) => {
    const method = req.method

    if(method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        const result = login(username, password)
        return result.then(userData => {
            if(userData.username) {
                // 设置session
                req.username = userData.username
                req.realname = userData.realname

                // 同步到 redis 中
                set(req.sessionId, req.session)

                return new SuccessModel(userData)
            }else{
                return new ErrorModel('登录失败')
            }
        })
        
    }
}

module.exports = {
    handleUserRouter
}
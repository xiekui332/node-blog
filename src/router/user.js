const { login } = require('../controller/user')
const { SuccessModele, ErrorModele } = require('../model/resModel')

const handleUserRouter = (req, res) => {
    const method = req.method

    if(method === 'POST' && req.path === '/api/user/login') {
        const { username, password } = req.body
        const result = login(username, password)
        if(result) {
            return new SuccessModele(result)
        }else{
            return new ErrorModele('登录失败')
        }
    }
}

module.exports = {
    handleUserRouter
}
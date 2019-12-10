const { 
    getList, 
    getDetail, 
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')

const { SuccessModel, ErrorModel } = require('../model/resModel')

const loginCheck = (req) => {
    if(!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}

const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.body.id
    

    if(method === "GET" && req.path === "/api/blog/list") {
        const author = req.query.author || ''
        const keywords = req.query.keywords || ''
        const result = getList(author, keywords)

        return result.then((listData) => {
            if(listData) {
                return  new SuccessModel(listData)
            }
        })
        return
    }

    if(method === "GET" && req.path === "/api/blog/detail") {
        
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModel(data)
        })
        
    }

    if(method === "POST" && req.path === "/api/blog/new") {
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult) {
            return loginCheck
        }

        req.body.author = req.session.username
        req.body.createtime = Date.now()
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModel(data)
        })
        
    }

    if(method === "POST" && req.path === "/api/blog/update") {
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult) {
            return loginCheck
        }

        const result = updateBlog(req.body)
        return result.then(data => {
            if(data) {
                return new SuccessModel(data)
            }else{
                return new ErrorModel('更新博客失败')
            }
        })
        
    }

    if(method === "POST" && req.path === "/api/blog/del") {
        const loginCheckResult = loginCheck(req)
        if(loginCheckResult) {
            return loginCheck
        }

        const author = req.session.username
        const result = delBlog(id, author)
        return result.then(delData => {
            if(delData) {
                return new SuccessModel(delData)
            }else{
                return new ErrorModel('删除博客失败')
            }
        })
        
    }
}

module.exports = {
    handleBlogRouter
}
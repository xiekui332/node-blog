const { 
    getList, 
    getDetail, 
    newBlog,
    updateBlog,
    delBlog
} = require('../controller/blog')

const { SuccessModele, ErrorModele } = require('../model/resModel')

const handleBlogRouter = (req, res) => {
    const method = req.method
    const id = req.body.id
    

    if(method === "GET" && req.path === "/api/blog/list") {
        const author = req.query.author || ''
        const keywords = req.query.keywords || ''
        const result = getList(author, keywords)

        return result.then((listData) => {
            if(listData) {
                return  new SuccessModele(listData)
            }
        })
        return
    }

    if(method === "GET" && req.path === "/api/blog/detail") {
        
        const result = getDetail(id)
        return result.then(data => {
            return new SuccessModele(data)
        })
        
    }

    if(method === "POST" && req.path === "/api/blog/new") {
        req.body.author = '谢奎'
        req.body.createtime = Date.now()
        const result = newBlog(req.body)
        return result.then(data => {
            return new SuccessModele(data)
        })
        
    }

    if(method === "POST" && req.path === "/api/blog/update") {
        const result = updateBlog(req.body)
        return result.then(data => {
            if(data) {
                return new SuccessModele(data)
            }else{
                return new ErrorModele('更新博客失败')
            }
        })
        
    }

    if(method === "POST" && req.path === "/api/blog/del") {
        const result = delBlog(id, req.body)
        return result.then(delData => {
            if(delData) {
                return new SuccessModele(delData)
            }else{
                return new ErrorModele('删除博客失败')
            }
        })
        
    }
}

module.exports = {
    handleBlogRouter
}
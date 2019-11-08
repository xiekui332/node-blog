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
    const id = req.query.id || ''
    

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
        
        const data = getDetail(id)

        return new SuccessModele(data)
    }

    if(method === "POST" && req.path === "/api/blog/new") {
        const data = newBlog(req.body)

        return new SuccessModele(data)
    }

    if(method === "POST" && req.path === "/api/blog/update") {
        const result = updateBlog(id, req.body)
        if(result) {
            return new SuccessModele(result)
        }else{
            return new ErrorModele('更新博客失败')
        }
    }

    if(method === "POST" && req.path === "/api/blog/del") {
        const result = delBlog(id)
        if(result) {
            return new SuccessModele(result)
        }else{
            return new ErrorModele('删除博客失败')
        }
    }
}

module.exports = {
    handleBlogRouter
}
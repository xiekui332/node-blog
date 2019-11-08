const { exec } = require('../db/mysql')

const getList = (author, keywords) => {
     let sql = `select * from blogs where 1=1 `
     if(author) {
        sql += `and author = '${author}' `
     }
     if(keywords) {
        sql += `and keywords like '%${keywords}%' `
     }

     // 列表一般倒序
     sql += `and order by createtime desc;`

     // 返回的是promise
     return exec(sql)
}

const getDetail = (id) => {
    return {
        id:1,
        title:'标题A',
        content:'内容A',
        createTime:1572511246065,
        author:'xiekui'
    }
}

const newBlog = (postData = {}) => {
    return {
        id:3
    }
}

const updateBlog = (id, postData = {}) => {
    return true
}

const delBlog = (id) => {
    return true
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
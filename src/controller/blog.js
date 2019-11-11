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
     sql += `order by createtime desc`

     // 返回的是promise
     return exec(sql)
}

const getDetail = (id) => {
    let sql = `select * from blogs where id='${id}'`
    return exec(sql).then(rows => {
        return rows[0]
    })
}

const newBlog = (blogData = {}) => {
    let title = blogData.title
    let content = blogData.content
    let createtime = blogData.createtime
    let author = blogData.author
    let sql = `insert into blogs (title, content, createtime, author) values ('${title}', '${content}', '${createtime}', '${author}');`

    return exec(sql).then(insertData => {
        return {
            id:insertData.insertId
        }
    })
}

const updateBlog = (blogData = {}) => {
    let id = blogData.id
    let title = blogData.title
    let content = blogData.content
    let sql = `UPDATE blogs SET title='${title}', content='${content}' WHERE id='${id}';`
    return exec(sql).then(updateData => {
        // console.log(updateData)
        if(updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, delData = {}) => {
    const author = delData.author
    let sql = `DELETE FROM blogs WHERE id='${id}' and author='${author}';`
    return exec(sql).then(delData => {
        if(delData.affectedRows > 0) {
            return true
        }
        return false
    })
}

module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}
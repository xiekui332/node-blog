const login = (username, password) => {
    if(username === 'xiekui' && password === '123') {
        return true
    }else{
        return false
    }
}

module.exports = {
    login
}
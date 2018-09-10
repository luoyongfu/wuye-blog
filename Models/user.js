const { db } = require('../Schema/config')


const UserSchema = require('../Schema/user')
//通过db对象 创建操作Article 数据库的模型对象
const User = db.model('users', UserSchema)


module.exports = User
const { db } = require('../Schema/config')


const CommentSchema = require('../Schema/comment')
//通过db对象 创建操作Article 数据库的模型对象
const Comment = db.model('comments', CommentSchema)


module.exports = Comment
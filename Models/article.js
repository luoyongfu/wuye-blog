const { db } = require('../Schema/config')


const ArticleSchema = require('../Schema/article')
//通过db对象 创建操作Article 数据库的模型对象
const Article = db.model('articles', ArticleSchema)


module.exports = Article
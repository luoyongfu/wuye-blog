const { Schema } = require('./config')


const ArticleSchema = new Schema({
  title: String,
  content: String,
  author: String,
  tips: String
},{
  versionKey: false,
  timestamps: {
    createdAt: 'created'
  }
})
//versionKey 显示版本号
//timestamps 显示创建时间 和 更新时间
module.exports = ArticleSchema 
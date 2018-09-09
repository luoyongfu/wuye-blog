const { Schema } = require('./config')
const ObjectId = Schema.Types.ObjectId

const CommentSchema = new Schema({
  //头像 用户名 文章 内容
  content:String,
  //关联用户表
  from: {
    type: ObjectId,
    ref: 'users'
  },
  //关联到article 表
  article: {
    type: ObjectId,
    ref: 'articles'
  }
},{
  versionKey: false,
  timestamps: {
    createdAt: 'created'
  }
})
//versionKey 显示版本号
//timestamps 显示创建时间 和 更新时间
module.exports = CommentSchema
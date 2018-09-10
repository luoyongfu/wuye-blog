const { Schema } = require('./config')
const ObjectId = Schema.Types.ObjectId

const ArticleSchema = new Schema({
  title: String,
  content: String,
  author: {
    type: ObjectId,//类型是ObjectId
    ref: 'users'//用于 关联users集合
  },//关联users的表 取得对应的user的一些数据
  tips: String,
  commentNum: Number
},{
  versionKey: false,
  timestamps: {
    createdAt: 'created'
  }
})
//versionKey 显示版本号
//timestamps 显示创建时间 和 更新时间
ArticleSchema.post('remove', doc => {

  const Comment = require('../Models/comment.js')
  const User = require('../Models/user.js')

  const { _id:artId, author: authorId } = doc
  // 只需要用户的 articleNum -1
  User.findByIdAndUpdate(authorId, {$inc: {articleNum: - 1}}).exec()


  // 把当前删除的文章 对应的所有评论 依次调用评论remove
  Comment.find({article: artId})
    .then(data => {
      data.forEach(v => v.remove())
    }) 
})

module.exports = ArticleSchema 
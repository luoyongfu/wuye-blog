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
module.exports = ArticleSchema 
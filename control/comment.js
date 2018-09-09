const { db } = require('../Schema/config')


const ArticleSchema = require('../Schema/article')
//通过db对象 创建操作Article 数据库的模型对象
const Article = db.model('articles', ArticleSchema)
//取得 user的 Schema 为了拿到操作 users集合的对象
const UserSchema = require('../Schema/user')
const User = db.model('users', UserSchema)

//控制评论
const CommentSchema = require('../Schema/Comment.js')
const Comment = db.model('comments', CommentSchema)

exports.save = async ctx => {
  let message = {
    status: 0,
    msg: '需要登录才能发表'
  }

  // 验证 用户是否登录
  if(ctx.session.isNew)return ctx.body = message

  //用户登录了
  const data = ctx.request.body
  //前端传过来没有from 手动获取到评论的用户ID
  data.from = ctx.session.uid

  const _comment = new Comment(data)

  await _comment
    .save()
    .then(data => {
      message = {
        status: 1,
        msg: '评论成功'
      }

      // 更新当前文章的评论计数器
      Article
        .update({_id: data.article}, {$inc: {commentNum: 1}}, err => {
          if(err)console.log(err)
          console.log("评论计数器更新成功")
        })

        //更新用户评论计数器
        User.update({_id: data.from}, {$inc: {commentNum: 1}}, err => {
          if(err)return console.log(err)
        })
    })
    .catch(err => {
      message = {
        status: 0,
        msg: err
      }
    })

    ctx.body = message


}
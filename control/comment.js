const Article = require('../Models/article')
const User = require('../Models/user')
const Comment = require('../Models/comment')

//保存评论
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

// 后台 查询用户所有评论
exports.comlist = async ctx => {
  const uid = ctx.session.uid

  const data = await Comment
    .find({from: uid})
    .populate('article', 'title')

  ctx.body = {
    code: 0,
    count: data.length,
    data
  }
}


// exports.del = async ctx => {
//   // 取得评论id
//   const commentId = ctx.params.id
//   // //取得文章ID
//   // // const articleId = ctx.request.body.articleId
//   // // //取得用户ID
//   // // const uid = ctx.session.uid

//   // let isOk = true

  


//   // let articleId, uid;

//   // //删除评论
//   // await Comment.findById(commentId, (err, data) => {
//   //   if(err){
//   //     console.log(err)
//   //     isOk = false
//   //   }else{
//   //     articleId = data.article
//   //     uid = data.from

//   //   }
//   // })

//   // //让文章评论计数-1
//   // await Article
//   //   .update({_id: articleId}, {$inc: {commentNum: -1}})

//   // //用户评论-1
//   // await User
//   //   .update({_id: uid}, {$inc: {commentNum: -1}})

//   // await Comment.deleteOne({_id: commentId}) 

//   // if(isOk){
//   //   ctx.body = {
//   //     state: 1,
//   //     message: '删除成功'
//   //   }
//   // }
// }


// 删除对应ID评论
exports.del = async ctx => {
  // 评论 ID
  const commentId = ctx.params.id
  // 拿到commentId 删除 comment

  let res = {
    state: 1,
    message: '成功'
  }

  await Comment.findById(commentId)
    .then(data => data.remove())
    .catch(err => {
      res = {
        state: 0,
        message: err
      }
    })
    
  ctx.body = res
}
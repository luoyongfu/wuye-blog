const { db } = require('../Schema/config')
const ArticleSchema = require('../Schema/article')
//取得 user的 Schema 为了拿到操作 users集合的对象
const UserSchema = require('../Schema/user')
const User = db.model('users', UserSchema)

//通过db对象 创建操作Article 数据库的模型对象
const Article = db.model('articles', ArticleSchema)
//控制评论
const CommentSchema = require('../Schema/Comment.js')
const Comment = db.model('comments', CommentSchema)

//返回文章发表页
exports.addPage = async ctx => {
  await ctx.render('add-article.pug',{
    title: '文章发表页',
    session: ctx.session
  })
}

//文章的发表 保存到数据库
exports.add = async ctx => {
  if(ctx.session.isNew){
    //true 没登录 就不需要查询数据库
    return ctx.body = {
      msg: '请登录',
      status: 0
    }
  }

  //用户登录了的 
  //data 用户登录状态下 post发送过来的数据
  const data = ctx.request.body
  // title content tips post里面没有 author需要添加进去
  data.author = ctx.session.uid
  data.commentNum = 0
  // ObjectId("5b8a76cf906b07f9f40e0baf")
  // 然后将data存储到数据库
  await new Promise((resolve, reject) => {
    new Article(data).save((err, data) => {
      if(err)return reject(err)
      //更新用户文章计数
      User.update({_id: data.author}, {$inc: {articleNum: 1}}, err => {
        if(err)return console.log(err)
      })

      resolve(data)
    })
  })
  .then(data => {
    ctx.body = {
      msg: "发表成功",
      status: 1
    }
  })
  .catch(err => {
    ctx.body = {
      msg: "发表失败",
      status: 0
    }
  }) 
}

//获取 文章列表 
exports.getList = async ctx => {
  // 查询每篇文章作者的 头像
  // id ctx.params.id
  let page = ctx.params.id || 1
  page--

  //获取数据库最大文章数量
  const maxNum = await Article.estimatedDocumentCount((err, num) => err ? console.log(err ) : num)

  //.exec() 让前面的语句全部执行起来
  const artList = await Article
    .find()
    .sort('-created')//根据时间倒序显示 文章列表
    .skip(2 * page)//每页跳过之前显示过的 文章
    .limit(2)//每页只显示5条
    .populate({
      path: 'author',
      select: 'username _id avatar'
    })//mongoose用于连表查询
    .then(data => data)
    .catch(err => console.log(err))
  

  await ctx.render('index' , {
    session: ctx.session,
    title: '博客实战首页',
    artList,
    maxNum
  })

}

// 文章详情
exports.details = async ctx => {
  //去动态路由里的id
  const _id = ctx.params.id

  //查找文章本身数据
  const article = await Article
    .findById(_id)
    .populate('author', 'username')
    .then(data => data)

  //查找和当前文章关联的所有评论
  const comment = await Comment
    .find({article: _id})
    .sort('-created')
    .populate('from', 'username avatar')
    .then(data => data)
    .catch(err => {
      console.log(err)
    })

  await ctx.render('article', {
    title: article.title,
    article,
    comment,
    session: ctx.session
  })
}
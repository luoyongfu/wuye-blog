const { db } = require('../Schema/config')
const ArticleSchema = require('../Schema/article')


//通过db对象 创建操作Article 数据库的模型对象
const Article = db.model('articles', ArticleSchema)

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
  // title content tips ///// post里面没有author需要添加进去
  data.author = ctx.session.username

  // 然后将data存储到数据库
  await new Promise((resolve, reject) => {
    new Article(data).save((err, data) => {
      if(err)return reject(err)

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
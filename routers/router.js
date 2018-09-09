const Router = require('koa-router')
//拿到操作user 表的逻辑对象
const user = require('../control/user')
const article = require('../control/article')
const comment = require('../control/comment')
const admin = require('../control/admin')

const router = new Router

// 设计主页  /
router.get('/',  user.keepLog, article.getList)

//动态路由 主要用来处理返回 用户登录 注册 登出
router.get(/^\/user\/(?=reg|login)/, async(ctx) => {
    // ctx.body = ctx.params.wy
    //show 为 true 则显示注册 false 显示登录
    const show = /reg$/.test(ctx.path)

    await ctx.render('./register.pug', {show})
})

//注册用户 路由
router.post('/user/reg', user.reg)

//用户登录
router.post('/user/login', user.login)

//用户退出
router.get('/user/logout', user.logout)

//文章发表页面 
router.get('/article', user.keepLog, article.addPage)

//文章的添加
router.post('/article', user.keepLog, article.add)

//文章列表分页 路由
//  /page/1234567 page后面是页数
router.get('/page/:id', article.getList)

// 文章详情页
router.get('/article/:id', user.keepLog, article.details)

// 发表评论 
router.post('/comment', user.keepLog, comment.save)

// 后台个人中心  文章评论 头像上传
router.get('/admin/:id', user.keepLog, admin.index)


//任意路由 未能匹配成果 返回404页面
router.get('*', async ctx => {
    await ctx.render("404",{
        title: '404'
    })
})

module.exports = router
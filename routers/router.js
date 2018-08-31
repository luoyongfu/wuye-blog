const Router = require('koa-router')
const router = new Router

// 设计主页  /
router.get('/', async(ctx) => {
    //需要 title
    await ctx.render('./index.pug', {
        title: '这是个假标题'
    })
    
})

//动态路由 主要用来处理 用户登录 注册 登出
router.get(/^\/user\/(?=reg|login)/, async(ctx) => {
    // ctx.body = ctx.params.wy
    //show 为 true 则显示注册 false 显示登录
    const show = /reg$/.test(ctx.path)

    await ctx.render('./register.pug', {show})
})

module.exports = router
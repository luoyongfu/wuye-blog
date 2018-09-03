const Koa = require('koa')
const static = require('koa-static')
const views = require('koa-views')
const router = require('./routers/router')
const logger = require('koa-logger')
const { join } = require('path')
const body = require('koa-body')
const session = require('koa-session')

//生成koa实例
const app = new Koa

app.keys = ['五葉厉害']

//配饰session对象
const CONFIG = {
  key: 'Sid',
  maxAge: 36e5,//科学计数法1个小时 == 1000*60*60
  overwrite: true,
  httpOnly: true, //前端是否可见
  signed: true, //是否显示签名
  rolling: true //用户每次操作是否刷新过期时间 maxAge
}

//注册日志模块
app.use(logger())

//注册session
app.use(session(CONFIG, app))

//配置 koa-body 处理post请求数据
app.use(body())

//配置静态资源目录
app.use(static(join(__dirname, 'public')))

//配置视图模板
app.use(views(join(__dirname, 'views'), {
    extension: "pug"
}))

//注册路由信息
app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000, () => {
    console.log("项目启动成功 监听在3000端口")
  })
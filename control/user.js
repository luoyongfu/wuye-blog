const { db } = require('../Schema/config')
const UserSchema = require('../Schema/user')
const encrypt = require('../util/encrypt')


//通过db对象 创建操作user 数据库的模型对象
const User = db.model('users', UserSchema)

// 用户注册
exports.reg = async (ctx) => {
  //用户注册时候 post 发送过来的数据
  const user = ctx.request.body
  const username = user.username
  const password = user.password
  
  
  //注册时 应该 加下操作假设 符合格式
  // 1. 去数据库 user 先查询当前发送的 username 是否存在
  await new Promise((resolve, reject) => {
    //去 users 数据库查询
    User.find({username}, (err, data) => {
      if(err)return reject(err)
      //数据库查询没有出错  还有可能没有数据
      if(data.length !== 0){
        //查询到了 说明 用户存在
        return resolve('')
      }
      //用户名不存在 需要存到数据库 
      //需要加密 密码, encrypt自定义加密模块
      const _user = new User({
        username,
        password: encrypt(password)
      })

      _user.save((err, data) => {
        if(err){
          reject(err)
        }else{
          resolve(data)
        }
      })
    })
  })
  .then(async data => {
    if(data){
      //注册成功
      await ctx.render('isOk', {
        status: '注册成功'
      })
    }else{
      //用户名存在
      await ctx.render('isOk', {
        status: '用户名已存在'
      })
    }
  })
  .catch(async (err) => {
    await ctx.render('isOk', {
      status: '注册失败 请重试'
    })
  })
}

//用户登录
exports.login = async (ctx) => {
  //拿到post数据
  const user = ctx.request.body
  const username = user.username
  const password = user.password

  await new Promise((resolve, reject) => {
    User.find({username}, (err, data) => {
      if(err)return reject(err)
      if(data.length === 0)return reject('用户名不存在')

      // 用户登录成功 比对数据库密码
      if(data[0].password === encrypt(password)){
        return resolve(data)
      }
      resolve('')

    })
  })
  .then(async data => {
    //如果resolve data不存在
    if(!data){
      return ctx.render('isOk', {
        status: '密码错误 登录失败'
      })
    }

    //让用户在他的 cookie 里设置 username password 加密后的密码 权限
    ctx.cookies.set('username', username, {
      domain: 'localhost', //该cookie作用于这个主机名
      path: '/',
      maxAge: 36e5,
      httpOnly: true, //true 不让客户端访问 cookie
      overwrite: false, // 是否覆盖 
      signed: false //是否签名 如果不写默认 true 前端可见
    })

    //用户在数据库的_id值
    ctx.cookies.set('uid', data[0]._id, {
      domain: 'localhost', //该cookie作用于这个主机名
      path: '/',
      maxAge: 36e5,
      httpOnly: true, //true 不让客户端访问 cookie
      overwrite: false, // 是否覆盖 
      signed: false //是否签名
    })

    // ctx.session = null 直接过期
    ctx.session = {
      username,
      uid: data[0]._id,
      avatar: data[0].avatar
    }

    //登录成功
    await ctx.render('isOk', {
      status: '登录成功'
    })
  })
  .catch(async err => {
    await  ctx.render('isOk', {
      status: '登录失败'
    })
  })
}

//确定用户的状态 保持用户状态
exports.keepLog = async(ctx, next) => {
  if(ctx.session.isNew){
    //session 没有
    if(ctx.cookies.get('username')){
      ctx.session = {
        username: ctx.cookies.get('username'),
        uid: ctx.cookies.get('uid')
      }
    }
  }
  await next()
  // ctx.body = 'dowm'
}


//用户退出中间件
exports.logout = async ctx => {
  ctx.session = null

  ctx.cookies.set('username', null, {
    maxAge: 0
  })//直接设置过期

  ctx.cookies.set('uid', null, {
    maxAge: 0
  })//直接设置过期

  //退出后在后台进行重定向到首页
  ctx.redirect('/')//重定向方法
  //前端重定向 location.href = '/'
}
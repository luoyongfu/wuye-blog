// 连接数据库 导出 db Schema
const mongoose = require('mongoose')
const db = mongoose.createConnection('mongodb://localhost:27017/blogwuye', {useNewUrlParser: true})

//原生es6 promise 代替mongoose promise
mongoose.Promise = global.Promise

//监听数据库连接
db.on('error', () => {
  console.log('数据库连接失败')
})
db.on('open', () => {
  console.log('数据库连接成功')
})

//取得mongoose的 Schema
const Schema = mongoose.Schema

module.exports = {
  db,
  Schema
} 
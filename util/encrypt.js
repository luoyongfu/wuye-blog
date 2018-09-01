const crypto = require('crypto')


//导出加密方法  加密对象 ===> 返回加密成功的数据
module.exports = function(password, key = 'wuye niupi'){
  const hmac = crypto.createHmac('sha256', key)//加密对象
  hmac.update(password)
  const passwordHmac = hmac.digest('hex')//输出16进制
  return passwordHmac
}
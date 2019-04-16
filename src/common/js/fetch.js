// 对fetch进行封装
const qs = require('qs')
export default function(url, data) {
  url = url + objToQuery(data)
  return fetch(url)
    .then(res => res.json())
}
// 将对象转化为查询字符串
function objToQuery(obj) {
  return obj ? `?${qs.stringify(obj)}` : ''
}

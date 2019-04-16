import fetch from 'common/js/fetch'
import {baseOption} from 'api/common.config.js'
// 获取搜索热词
export function getHotKey() {
  // const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'
  const url = 'api/getHotKey'
  const data = Object.assign({}, baseOption, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  })
  return fetch(url, data)
}
// 关键词搜索结果
export function search(query, page, zhida, perpage) {
  // const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'
  const url = 'api/search'
  const data = Object.assign({}, baseOption, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  })

  return fetch(url, data)
}
import fetch from 'common/js/fetch'
import {baseOption} from 'api/common.config.js'
// 歌词的获取
export function getLyric(songId) {
  const url = 'api/getLyric'
  const data = Object.assign({}, baseOption, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    pcachetime: +new Date(),
    g_tk: 67232076,
    format: 'json',
    songmid: songId
  })
  return fetch(url, data)
}
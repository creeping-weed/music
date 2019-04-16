import fetch from 'common/js/fetch'
import {baseOption} from 'api/common.config.js'
// 获取排行列表数据
export function getTopList() {
  const url = 'api/getTopList'
  const data = Object.assign({}, baseOption, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5',
    format: 'json'
  })

  return fetch(url, data)
}
// 获取单个排行的音乐列表
export function getTopMusicList(topid) {
  const url = 'api/getTopMusicList'
  const data = Object.assign({}, baseOption, {
    topid,
    needNewCode: 1,
    uin: 0,
    tpl: 3,
    page: 'detail',
    type: 'top',
    platform: 'h5',
    format: 'json'
  })

  return fetch(url, data)
}
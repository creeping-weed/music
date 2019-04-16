// singer组件数据的获取
import fetch from 'common/js/fetch'
import {baseOption} from 'api/common.config.js'
export function getSingerList() {
  const url = '/api/getSingerList'
  const data = Object.assign({}, baseOption, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    format: 'json'
  })
  return fetch(url, data)
}
// 歌手歌曲列表数据的获取
export function getSingerDetail(singerId) {
  const url = 'api/getSingerDetail'
  const data = Object.assign({}, baseOption, {
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1,
    format: 'json',
    singermid: singerId
  })
  // `https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?
  // g_tk=5381&loginUin=0&hostUin=0&format=json&inCharset=utf8&outCharset=utf-8
  // &notice=0&platform=yqq&needNewCode=0&singermid=001fNHEf1SFEFN&order=listen&begin=0&num=30&songstatus=1`
  return fetch(url, data)
}
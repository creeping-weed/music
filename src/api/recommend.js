// recommend组件当中的数据的获取
import fetch from 'common/js/fetch'
import {baseOption} from 'api/common.config.js'
// 获取轮播图数据
export function getRecommend() {
  const url = '/api/getSwiperList'
  // const data = Object.assign({}, baseOption, {
  //   uin: 0,
  //   platform: 'h5',
  //   needNewCode: 1,
  //   _: new Date().valueOf()
  // })
  return fetch(url)
}
// 获取歌单列表数据
export function getDiscList() {
  const url = '/api/getDiscList'
  const data = Object.assign({}, baseOption, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  })
  return fetch(url, data)
}
// 获取歌单歌曲列表数据
export function getSongList(disstid) {
  const url = 'api/getSongList'
  const data = Object.assign({}, baseOption, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: 'json'
  })
  return fetch(url, data)
}
import {getLyric} from 'api/song.js'
import {ERR_OK} from 'api/common.config.js'
import { Base64 } from 'js-base64'
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.url = url
  }
  async getLyric(callback) {
    const res = await getLyric(this.mid)
    if (res.retcode === ERR_OK) {
      this.lyric = res.lyric
      callback(Base64.decode(this.lyric))
    } else {
      this.lyric = null
      callback(this.lyric)
    }
  }
}
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`,
    // url: `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=2880535306&vkey=66106C3824C0503C2AFAEA66A9B05D3EFD75332C87E34EBBEF068793D795149CD93E84F2B501898CC39059ADD13E81E4B9DF3CBA0D1A0C01&uin=0&fromtag=38`
    url: `https://api.bzqll.com/music/tencent/url?key=579621905&id=${musicData.songmid}br=320`
  })
}
// http://dl.stream.qqmusic.qq.com/C400001IqfAs2KZzeZ.m4a?guid=2880535306&vkey=FFDADB23DADA03D97E65258E4B
// 31E3B4581A6EF709F13C580031EE5A0F984AD7B95218E87A166768D0D63E6F87B05D5B69AA0A25DF61D244&uin=0&fromtag=38
// http://dl.stream.qqmusic.qq.com/C4000000Z0093Ko5Ps.m4a?guid=2880535306&vkey=F2DBBE58A61CCE2DC99D445E7662AF
// A507D3530A0FD48B8EC5EFC8E90910E7CF7FAD275D3453A3CFAAB309764EDA7DCAFD1C8F60211A3E76&uin=0&fromtag=38
// http://dl.stream.qqmusic.qq.com/C400002krvKI4Jgvq9.m4a?guid=2880535306&vkey=6653E336A42041598846259B5061383
// 5895CE12BB920A1221437CC1A05D2E348A73BAE6223B74A1142F259DF66394A2AF35919268E21660E&uin=0&fromtag=38
// http://isure.stream.qqmusic.qq.com/C400002krvKI4Jgvq9.m4a?guid=2880535306&vkey=66106C3824C0503C2AFA
// EA66A9B05D3EFD75332C87E34EBBEF068793D795149CD93E84F2B501898CC39059ADD13E81E4B9DF3CBA0D1A0C01&uin=0&fromtag=38
function filterSinger(singer) {
  if (!singer) {
    return ''
  }
  let ret = []
  singer.forEach(item => {
    ret.push(item.name)
  })
  return ret.join('/')
}
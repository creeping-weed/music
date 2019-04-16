import {playMode} from 'common/js/config'
import {searchHistoryList} from 'common/js/cache'
const state = {
  // 歌手信息
  singer: {},
  // 播放状态
  playing: false,
  // 播放器状态
  fullScreen: false,
  // 播放列表
  playList: [],
  // 顺序歌曲列表
  sequenceList: [],
  // 播放模式
  playMode: playMode.sequence,
  // 当前播放歌曲索引
  currentIndex: -1,
  // 歌单信息
  disc: {},
  // 榜单信息
  top: {},
  // 是否隐藏手机输入面板
  input: true,
  // 搜索历史
  searchHistory: searchHistoryList
}
export default state
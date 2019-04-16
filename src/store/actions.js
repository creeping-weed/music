import * as types from './mutation-types'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearchHistory, deleteSearchHistory, clearSearchHistory} from 'common/js/cache'
// 点击歌曲列表中的歌曲进行的操作
export const selectPlay = function({commit, state}, {list, index}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
  if (state.playMode === playMode.random) {
    let currentSong = list[index]
    list = shuffle(list)
    index = list.findIndex(item => item.id === currentSong.id)
  }
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_CURRENT_INDEX, index)
}
// 随机播放列表中的歌曲
export const randomPlay = function({commit}, {list}) {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAY_LIST, list)
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
// 向列表中插入一首歌曲
export const insertSong = function({commit, state}, song) {
  let {playList, sequenceList, currentIndex} = state
  let newPlayList = [...playList]
  let newSequenceList = [...sequenceList]
  let playIndex = currentIndex + 1
  let currentSong = newPlayList[currentIndex]
  let insertPlayIndex = newPlayList.findIndex(item => item.mid === song.mid)
  // console.log(insertPlayIndex)
  newPlayList.splice(currentIndex + 1, 0, song)
  // 判断列表当中是否有待插入的歌曲
  if (insertPlayIndex > -1) {
    // 如果歌曲在当前播放歌曲的前面，那么直接删除，否则删除的位置往后移一位再删（因为先插入了一首歌）
    if (insertPlayIndex <= currentIndex) {
      // console.log('delete')
      newPlayList.splice(insertPlayIndex, 1)
      playIndex--
    } else {
      newPlayList.splice(insertPlayIndex + 1, 1)
    }
  }
  let csIndex = newSequenceList.findIndex(item => item === currentSong)
  let insertSequenceIndex = newSequenceList.findIndex(item => item.mid === song.mid)
  newSequenceList.splice(csIndex + 1, 0, song)
  if (insertSequenceIndex > -1) {
    if (insertSequenceIndex <= csIndex) {
      newSequenceList.splice(insertSequenceIndex, 1)
    } else {
      newSequenceList.splice(insertSequenceIndex + 1, 1)
    }
  }
  // console.log(newPlayList)
  // console.log(newSequenceList)
  commit(types.SET_SEQUENCE_LIST, newSequenceList)
  commit(types.SET_PLAY_LIST, newPlayList)
  commit(types.SET_CURRENT_INDEX, playIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}
// 删除列表中的一首歌曲
export const removeSong = function({commit, state}, song) {
  let {playList, sequenceList, currentIndex} = state
  let newPlayList = [...playList]
  let newSequenceList = [...sequenceList]
  let removeSongIndex = newPlayList.findIndex(item => item.mid === song.mid)
  if (removeSongIndex > -1) {
    if (removeSongIndex < currentIndex || removeSongIndex === newPlayList.length - 1) {
      currentIndex--
    }
    newPlayList.splice(removeSongIndex, 1)
  }
  let sRemoveSongIndex = newSequenceList.findIndex(item => item.mid === song.mid)
  if (sRemoveSongIndex > -1) {
    newSequenceList.splice(sRemoveSongIndex, 1)
  }
  commit(types.SET_SEQUENCE_LIST, newSequenceList)
  commit(types.SET_PLAY_LIST, newPlayList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (newPlayList.length) {
    commit(types.SET_PLAYING_STATE, true)
  }
}
// 清空歌曲列表
export const clearSongList = function({commit}) {
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAY_LIST, [])
  commit(types.SET_CURRENT_INDEX, -1)
}
// 存入一条搜索历史
export const saveSearch = function({commit}, history) {
  commit(types.SET_SEARCH_HISTORY, saveSearchHistory(history))
}
// 删除一条搜索历史
export const removeSearch = function({commit}, history) {
  commit(types.SET_SEARCH_HISTORY, deleteSearchHistory(history))
}
// 清空全部搜索历史
export const clearSearch = function({commit}) {
  commit(types.SET_SEARCH_HISTORY, clearSearchHistory())
}
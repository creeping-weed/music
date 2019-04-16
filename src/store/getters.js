export const singer = state => state.singer
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playList = state => state.playList
export const sequenceList = state => state.sequenceList
export const playMode = state => state.playMode
export const currentIndex = state => state.currentIndex
export const disc = state => state.disc
export const top = state => state.top
export const input = state => state.input
export const searchHistory = state => state.searchHistory
// 当前播放歌曲
export const currentSong = state => state.playList[state.currentIndex]
import * as type from './mutation-types'
const mutation = {
  [type.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [type.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [type.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [type.SET_PLAY_LIST](state, list) {
    state.playList = list
  },
  [type.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [type.SET_PLAY_MODE](state, mode) {
    state.playMode = mode
  },
  [type.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [type.SET_DISC](state, disc) {
    state.disc = disc
  },
  [type.SET_TOP](state, top) {
    state.top = top
  },
  [type.SET_INPUT](state, flag) {
    state.input = flag
  },
  [type.SET_SEARCH_HISTORY](state, value) {
    state.searchHistory = value
  }
}
export default mutation
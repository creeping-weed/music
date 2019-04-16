import {mapGetters} from 'vuex'
export const playlistMixin = {
  computed: {
    ...mapGetters({
      playlist: 'playList'
    })
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist method')
    }
  }
}
/*
export const setPlayModeMixin = {
  computed: {
    ...mapGetters(['playMode'])
  },
  methods: {
    // 改变播放模式
    changeMode() {
      let mode = (this.playMode + 1) % 3
      this.setPlayMode(mode)
    },
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE'
    })
  },
  // 因为是watch,所以有一个组件watch就够了
  watch: {
    playMode(mode) {
      console.log(mode)
      if (mode === playMode.random) {
        let list = shuffle(this.sequenceList)
        let currentIndex = list.findIndex(item => item.id === this.currentSong.id)
        this.setPlayList(list)
        this.setCurrentIndex(currentIndex)
      } else {
        let list = this.sequenceList
        let currentIndex = list.findIndex(item => item.id === this.currentSong.id)
        // console.log(currentIndex)
        this.setPlayList(list)
        this.setCurrentIndex(currentIndex)
      }
    }
  }
}
*/
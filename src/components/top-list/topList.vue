<template>
  <transition name="slide">
    <music-list :title='title' :bgImage='bgImage' :songs='songs' :rank='true'></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/musicList'
import {mapGetters} from 'vuex'
import {getTopMusicList} from 'api/rank'
import {ERR_OK} from 'api/common.config'
import {createSong} from 'common/js/song'
export default {
  data() {
    return {
      songs: [],
      bgImage: ''
    }
  },
  computed: {
    title() {
      return this.top.topTitle
    },
    ...mapGetters(['top'])
  },
  created() {
    if (!this.top.id) {
      this.$router.back()
      return
    }
    this._getTopMusicList()
  },
  methods: {
    async _getTopMusicList() {
      const res = await getTopMusicList(this.top.id)
      const {code, songlist} = res
      if (code === ERR_OK) {
        this.songs = this._normalizeSongs(songlist)
        this.bgImage = this.top.picUrl && this.songs[0].image
      }
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        const {data} = item
        ret.push(createSong(data))
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
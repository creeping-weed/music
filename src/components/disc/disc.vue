<template>
  <transition name="slide">
    <music-list :title='disc.dissname' :bgImage='disc.imgurl' :songs='songList'></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
import MusicList from 'components/music-list/musicList'
import {mapGetters} from 'vuex'
import {getSongList} from 'api/recommend'
import {ERR_OK} from 'api/common.config'
import {createSong} from 'common/js/song'
export default {
  data() {
    return {
      songList: []
    }
  },
  created() {
    this._getSongList()
  },
  computed: {
    ...mapGetters(['disc'])
  },
  methods: {
    async _getSongList() {
      if (!this.disc.dissid) {
        this.$router.back()
        return
      }
      const res = await getSongList(this.disc.dissid)
      const {code, cdlist} = res
      if (code === ERR_OK) {
        this.songList = this._normalizeSongs(cdlist[0].songlist)
      } else {
        this.$router.back()
      }
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        ret.push(createSong(item))
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
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
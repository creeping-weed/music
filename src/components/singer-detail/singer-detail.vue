<template>
  <transition name="slide">
    <music-list :bgImage='singer.avatar' :title='singer.name' :songs='songs'></music-list>
  </transition>
</template>
<script>
import {mapState} from 'vuex'
import {getSingerDetail} from 'api/singer'
import {ERR_OK} from 'api/common.config'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/musicList'
export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    ...mapState(['singer'])
  },
  created() {
    this._getDetailList()
  },
  methods: {
    async _getDetailList() {
      if (!this.singer.id) {
        return this.$router.push('/singer')
      }
      const res = await getSingerDetail(this.singer.id)
      // console.log(res)
      const {code, data} = res
      if (code === ERR_OK) {
        this.songs = this._normalizeSongs(data.list)
        console.log(this.songs)
      }
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        let {musicData} = item
        ret.push(createSong(musicData))
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
<template>
  <div class="singer" ref='singer'>
    <list-view :data='singerList' @select='selectSinger' :loading='isShow'></list-view>
    <router-view></router-view>
  </div>
</template>
<script>
import {getSingerList} from 'api/singer'
import Singer from 'common/js/singer'
import {ERR_OK} from 'api/common.config.js'
import ListView from 'base/list-view/listView'
import {mapMutations} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
export default {
  mixins: [playlistMixin],
  data() {
    return {
      singerList: [],
      isShow: true
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    selectSinger(item) {
      this.$router.push({
        path: `/singer/${item.id}`
      })
      this.setSinger(item)
    },
    async _getSingerList() {
      const res = await getSingerList()
      // console.log(res)
      const {code, data} = res
      if (code === ERR_OK) {
        this.singerList = this._normalizeSinger(data.list)
        this.isShow = false
      }
    },
    _normalizeSinger(data) {
      const map = {
        hot: {
          title: HOT_NAME,
          item: []
        }
      }
      data.forEach((v, i) => {
        if (i <= HOT_SINGER_LEN) {
          map.hot.item.push(new Singer({
            name: v.Fsinger_name,
            id: v.Fsinger_mid
          }))
        }
        let key = v.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            item: []
          }
        }
        map[key].item.push(new Singer({
          name: v.Fsinger_name,
          id: v.Fsinger_mid
        }))
      })
      // return map
      let hot = []
      let ret = []
      for (let key in map) {
        let val = map[key]
        if (val.title === HOT_NAME) {
          hot.push(val)
        } else if (/^[a-z,A-Z]$/.test(val.title)) {
          ret.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '0'
      this.$refs.singer.style.bottom = bottom
      // this.$refs.scrollView.refresh()
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    })
  },
  components: {
    ListView
  }
}
</script>
<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>
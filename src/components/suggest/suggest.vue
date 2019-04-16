<template>
  <scroll
    class="suggest"
    ref='suggest'
    :data='result'
    :pullup='true'
    @scrollToEnd='searchMore'
    :beforeScroll='true'
    @beforeScroll='listScroll'
  >
    <ul class="suggest-list">
      <li class="suggest-item" v-for='(item, index) in result' :key='index' @click='selectItem(item)'>
        <div class="icon">
          <i :class='item | getIconCls'></i>
        </div>
        <div class="name">
          <p class="text">{{item | getDisplayName}}</p>
        </div>
      </li>
      <loading v-show="hasMore" title="加载中···"></loading>
    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果。换个词试试"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/no-result/noResult'
import {search} from 'api/search'
import {ERR_OK} from 'api/common.config'
import {createSong} from 'common/js/song'
import Singer from 'common/js/singer'
import {mapMutations, mapActions} from 'vuex'
// 搜索的条数
const perpage = 20
// 检索到的类型
const TYPE_SINGER = 'singer'
export default {
  data() {
    return {
      result: [],
      // 搜索的第几页（页码）
      page: 1,
      hasMore: true
    }
  },
  props: {
    // 搜索的关键字
    query: {
      type: String,
      default: ''
    },
    // 是否搜索歌手(直达)
    showSinger: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    refresh() {
      this.$refs.suggest.refresh()
    },
    listScroll() {
      this.setInput(false)
    },
    selectItem(item) {
      // 处理搜索结果中的歌手
      if (item.type && item.type === TYPE_SINGER) {
        const {singermid, singername} = item
        let singer = new Singer({id: singermid, name: singername})
        this.setSinger(singer)
        this.$router.push(`/search/${singer.id}`)
      } else {
        this.insertSong(item)
      }
      this.$emit('search', this.query)
    },
    async search() {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      const res = await search(this.query, this.page, this.showSinger, perpage)
      const {code, data} = res
      if (code === ERR_OK) {
        // console.log(data)
        this.result = this._getResult(data)
        this._checkMore(data)
      }
    },
    async searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      const res = await search(this.query, this.page, this.showSinger, perpage)
      console.log(res)
      const {code, data} = res
      if (code === ERR_OK) {
        this.result = [...this.result, ...this._getResult(data)]
        this._checkMore(data)
      }
    },
    _getResult(data) {
      let ret = []
      const {zhida, song} = data
      if (zhida && zhida.singerid) {
        ret.push({...zhida, type: TYPE_SINGER})
      }
      if (song) {
        ret = [...ret, ...this._normalizeSongs(song)]
      }
      return ret
    },
    _normalizeSongs({list}) {
      let ret = []
      list.forEach((musicData) => {
        if (musicData.songid && musicData.albummid) {
          ret.push(createSong(musicData))
        }
      })
      return ret
    },
    _checkMore({song}) {
      if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
        this.hasMore = false
      }
    },
    ...mapMutations({
      setSinger: 'SET_SINGER',
      setInput: 'SET_INPUT'
    }),
    ...mapActions(['insertSong'])
  },
  watch: {
    query(newValue) {
      // console.log(newValue)
      if (newValue === '') {
        this.result = []
        return
      }
      this.search()
    }
  },
  filters: {
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      } else {
        return `${item.name}-${item.singer}`
      }
    },
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      } else {
        return 'icon-music'
      }
    }
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
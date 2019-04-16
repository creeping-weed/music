<template>
  <div class="music-list">
    <div class="back" @click='$router.back()'>
      <i class="icon-back"></i>
    </div>
    <h1 class="title" v-html='title'></h1>
    <div class="bg-image" :style='{backgroundImage: `url(${bgImage})`}' ref='bgImage'>
      <div class="play-wrapper">
        <div ref="playBtn" v-show="songs.length>0" class="play" @click='randomPlayAll'>
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
    </div>
    <div class="bg-layer" ref="layer"></div>
    <scroll :data='songs' class="list" ref='list' :listen-scroll='true' :probe-type='3' @scroll='listScroll'>
      <div class="song-list-wrapper">
        <song-list :songs='songs' @select='addPlayList' :rank='rank'></song-list>
      </div>
      <div v-show="!songs.length" class="loading-container">
        <loading></loading>
      </div>
    </scroll>
  </div>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import SongList from 'base/song-list/songList'
import Loading from 'base/loading/loading'
import {prefixStyle} from 'common/js/dom'
import {mapActions} from 'vuex'
import {playlistMixin} from 'common/js/mixin'
const transform = prefixStyle('transform')
// console.log(transform)
const RESERVED_HEIGHT = 40
export default {
  mixins: [playlistMixin],
  data() {
    return {
      scrollY: 0
    }
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    bgImage: {
      type: String,
      default: ''
    },
    songs: {
      type: Array,
      default: null
    },
    rank: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    addPlayList({index}) {
      this.selectPlay({
        index,
        list: this.songs
      })
    },
    randomPlayAll() {
      this.randomPlay({list: this.songs})
    },
    listScroll(page) {
      this.scrollY = page.y
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '0'
      this.$refs.list.$el.style.bottom = bottom
      this.$refs.list.refresh()
    },
    ...mapActions(['selectPlay', 'randomPlay'])
  },
  watch: {
    scrollY(newValue) {
      let listOffsetY = newValue
      let layer = this.$refs.layer
      let bgImage = this.$refs.bgImage
      let maxOffsetY = -(this.bgImageHeight - RESERVED_HEIGHT)
      let translateY = Math.max(maxOffsetY, listOffsetY)
      let zIndex = 0
      const percent = Math.abs(newValue / this.bgImageHeight)
      if (listOffsetY > 0) {
        bgImage.style[transform] = `scale(${1 + percent})`
        zIndex = 10
      }
      layer.style[transform] = `translate3d(0,${translateY}px,0)`
      if (listOffsetY < translateY) {
        zIndex = 10
        bgImage.style.paddingTop = 0
        bgImage.style.height = RESERVED_HEIGHT + 'px'
        this.$refs.playBtn.style.display = 'none'
      } else {
        bgImage.style.paddingTop = '70%'
        bgImage.style.height = 0
        this.$refs.playBtn.style.display = ''
      }
      bgImage.style.zIndex = zIndex
    }
  },
  mounted() {
    let bgImageHeight = this.$refs.bgImage.clientHeight
    this.bgImageHeight = bgImageHeight
    this.$refs.list.$el.style.top = bgImageHeight + 'px'
  },
  components: {
    Scroll,
    SongList,
    Loading
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
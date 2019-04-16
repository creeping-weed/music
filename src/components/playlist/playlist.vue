<template>
  <transition name='list-fade'>
    <div class="playlist" @click.stop='close' v-show="isShow">
      <div class="list-wrapper">
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class='iconMode' @click.stop='changeMode'></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click.stop='clear'><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll class="list-content" ref='listContent' :data='sequenceList'>
          <transition-group tag="ul" name="list">
            <li class="item" ref='listItem' v-for='(item, index) in sequenceList' :key='index' @click.stop='changeSong(item, index)'>
              <i class="current" :class='getCurrentIcon(item)'></i>
              <span class="text">{{item.name}}</span>
              <span class="like">
                <i class="icon-not-favorite"></i>
              </span>
              <span class="delete" @click.stop='deleteSong(item)'>
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click.stop='addSong'>
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close">
          <span @click.stop='close'>关闭</span>
        </div>
      </div>
      <confirm text='是否清空播放列表？' confirmBtnText='清空' ref='confirm' @confirm='clearList'></confirm>
      <add-song ref='addSong'></add-song>
    </div>
  </transition>
</template>
<script>
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {playMode} from 'common/js/config'
import Scroll from 'base/scroll/scroll'
import AddSong from 'components/add-song/addSong'
import Confirm from 'base/confirm/confirm'
export default {
  data() {
    return {
      isShow: false
    }
  },
  computed: {
    iconMode() {
      return this.playMode === playMode.sequence ? 'icon-sequence'
        : this.playMode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    modeText() {
      return this.playMode === playMode.sequence ? '顺序播放'
        : this.playMode === playMode.loop ? '单曲循环' : '随机播放'
    },
    ...mapGetters(['sequenceList', 'currentSong', 'playList', 'playMode', 'currentIndex'])
  },
  methods: {
    // 改变播放模式
    changeMode() {
      let mode = (this.playMode + 1) % 3
      this.setPlayMode(mode)
      // 因为player组件监听了playMode,具体vux提交在player组件
    },
    // 关闭列表
    close() {
      this.isShow = false
    },
    // 打开列表
    open() {
      this.isShow = true
      this.$nextTick(() => {
        this.$refs.listContent.refresh()
        // 移动到当前播放歌曲
        this.moveToElement()
      })
    },
    getCurrentIcon(item) {
      return item.mid === this.currentSong.mid ? 'icon-play' : ''
    },
    // 切换歌曲
    changeSong(item, index) {
      if (this.playMode === playMode.random) {
        index = this.playList.findIndex(song => song.mid === item.mid)
      }
      this.setCurrentIndex(index)
      this.setPlayingState(true)
    },
    // 删除歌曲
    deleteSong(item) {
      this.removeSong(item)
    },
    clear() {
      this.$refs.confirm && this.$refs.confirm.show()
    },
    // 清空列表
    clearList() {
      this.clearSongList()
    },
    moveToElement() {
      let index = this.currentIndex
      if (this.playMode === playMode.random) {
        index = this.sequenceList.findIndex(song => song.mid === this.currentSong.mid)
      }
      this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 200)
    },
    // 添加歌曲到列表
    addSong() {
      this.$refs.addSong.show()
    },
    ...mapMutations({
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE',
      setPlayMode: 'SET_PLAY_MODE'
    }),
    ...mapActions(['removeSong', 'clearSongList'])
  },
  watch: {
    currentIndex(newValue) {
      this.moveToElement()
      if (newValue === -1) {
        this.close()
      }
    }
  },
  components: {
    Scroll,
    Confirm,
    AddSong
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>

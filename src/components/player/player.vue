<template>
  <div class="player" v-if='playList.length > 0'>
    <transition
      @enter='enter'
      @after-enter='afterEnter'
      @leave='leave'
      @after-leave='afterLeave'
      name="normal">
      <div class="normal-player" v-show='fullScreen'>
        <div class="background">
          <img width="100%" height="100%" :src='currentSong.image'>
        </div>
        <div class="top">
          <div class="back" @click='back'>
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html='currentSong.name'></h1>
          <h2 class="subtitle" v-html='currentSong.singer'></h2>
        </div>
        <div class="middle"
          @touchstart.prevent="middleTouchStart"
          @touchmove.prevent="middleTouchMove"
          @touchend="middleTouchEnd"
        >
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref='cdWrapper'>
              <div class="cd"  :class='imageRotate'>
                <img class="image" :src='currentSong.image'>
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p ref="lyricLine"
                    class="text"
                    :class="{'current': currentLineNum ===index}"
                    v-for="(line,index) in currentLyric.lines" :key='index'>{{line.txt}}</p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="dot" :class="{'active':currentShow==='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{currentTime | secondToMinute | zeroCompensation}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent='percent' @move='updatePlayTime'></progress-bar>
            </div>
            <span class="time time-r">{{currentSong.duration | secondToMinute | zeroCompensation}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click='changeMode'>
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" @click='prev' :class='{disable: !isCanplay}'>
              <i class="icon-prev"></i>
            </div>
            <div class="icon i-center" @click='togglePlayState' :class='{disable: !isCanplay}'>
              <i :class='playIcon'></i>
            </div>
            <div class="icon i-right" @click='next' :class='{disable: !isCanplay}'>
              <i class="icon-next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <transition name="mini">
      <div class="mini-player" v-show='!fullScreen' @click='open'>
        <div class="icon">
          <img width="40" height="40" :src='currentSong.image' :class='imageRotate'>
        </div>
        <div class="text">
          <h2 class="name" v-html='currentSong.name'></h2>
          <p class="desc" v-html='currentSong.singer'></p>
        </div>
        <div class="control" @click.prevent.stop='togglePlayState'>
          <progress-cicle :radius='32' :percent='percent'>
            <i class='icon-mini' :class='miniPlayIcon'></i>
          </progress-cicle>
        </div>
        <div class="control" @click.stop='openPlaylist'>
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <playlist ref='playlist'></playlist>
    <audio
      :src='currentSong.url'
      ref='audio'
      @canplay='canplay'
      @error='error'
      @ended='ended'
      @timeupdate='timeUpdate'>
    </audio>
  </div>
</template>
<script>
import {mapGetters, mapMutations} from 'vuex'
import animations from 'create-keyframe-animation'
import {prefixStyle} from 'common/js/dom'
import ProgressBar from 'base/progress-bar/progressBar'
import ProgressCicle from 'base/progress-circle/progressCircle'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import Lyric from 'lyric-parser'
import Scroll from 'base/scroll/scroll'
import Playlist from 'components/playlist/playlist'
const transform = prefixStyle('transform')
const transitionDuration = prefixStyle('transitionDuration')
export default {
  data() {
    return {
      isCanplay: false,
      currentTime: 0,
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      playingLyric: ''
    }
  },
  created() {
    this.touch = {}
  },
  computed: {
    // 播放时间占总时间的比例
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    iconMode() {
      return this.playMode === playMode.sequence ? 'icon-sequence'
        : this.playMode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    playIcon() {
      return this.playing ? 'icon-play' : 'icon-pause'
    },
    miniPlayIcon() {
      return this.playing ? 'icon-play-mini' : 'icon-pause-mini'
    },
    imageRotate() {
      return this.playing ? 'play' : 'play pause'
    },
    ...mapGetters(['fullScreen', 'playList', 'currentSong', 'playing', 'currentIndex', 'playMode', 'sequenceList'])
  },
  methods: {
    // 打开当前播放列表
    openPlaylist() {
      this.$refs.playlist.open()
    },
    // 设置播放进度
    updatePlayTime(precentWidth) {
      let time = precentWidth * this.currentSong.duration
      this.$refs.audio.currentTime = time
      if (!this.playing) {
        this.togglePlayState()
      }
      if (this.currentLyric) {
        this.currentLyric.seek(time * 1000)
      }
    },
    // 改变播放模式
    changeMode() {
      // console.log(this.playMode)
      let mode = (this.playMode + 1) % 3
      // console.log(mode)
      this.setPlayMode(mode)
    },
    // 歌曲切换上一首
    prev() {
      if (!this.isCanplay) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      }
      let index = this.currentIndex
      index -= 1
      if (index < 0) {
        index = this.playList.length - 1
      }
      if (!this.playing) {
        this.setPlayingState(!this.playing)
      }
      this.setCurrentIndex(index)
      this.isCanplay = false
    },
    // 更改播放状态(暂停/播放)
    togglePlayState() {
      if (!this.isCanplay) {
        return
      }
      this.setPlayingState(!this.playing)
      if (this.currentLyric) {
        this.currentLyric.togglePlay()
      }
    },
    // 歌曲切换下一首
    next() {
      if (!this.isCanplay) {
        return
      }
      if (this.playList.length === 1) {
        this.loop()
        return
      }
      let index = this.currentIndex
      index += 1
      if (index >= this.playList.length) {
        index = 0
      }
      if (!this.playing) {
        // this.setPlayingState(!this.playing)
        this.togglePlayState()
      }
      this.setCurrentIndex(index)
      this.isCanplay = false
    },
    loop() {
      this.$refs.audio.currentTime = 0
      this.$refs.audio.play()
      if (this.currentLyric) {
        this.currentLyric.seek(0)
      }
    },
    // audio的事件相关
    // 当前歌曲播放完时
    ended() {
      // 当为单曲循环时
      if (this.playMode === playMode.loop) {
        this.loop()
      } else {
        this.next()
      }
    },
    // 当前歌曲可以播放时
    canplay() {
      this.isCanplay = true
    },
    error() {
      console.log('error')
      this.isCanplay = true
    },
    timeUpdate() {
      this.currentTime = this.$refs.audio && this.$refs.audio.currentTime
    },
    // 关闭播放页面
    back() {
      this.setFullScreen(false)
    },
    // 打开播放页面
    open() {
      this.setFullScreen(true)
      this.currentTime -= 0.00000000001
    },
    enter(el, done) {
      const {x, y, scale} = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0,0,0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0,0,0) scale(1)`
        }
      }
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 400,
          easing: 'linear'
        }
      })

      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      animations.unregisterAnimation('move')
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      this.$refs.cdWrapper.style.transition = 'all 0.4s'
      const {x, y, scale} = this._getPosAndScale()
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    getLyric() {
      this.currentSong.getLyric(lyric => {
        if (lyric === null) {
          // 当没获取到歌词时
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        } else {
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          // console.log(this.currentLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }
      })
    },
    handleLyric({lineNum, txt}) {
      this.currentLineNum = lineNum
      if (lineNum > 5) {
        let lineEl = this.$refs.lyricLine[lineNum - 5]
        this.$refs.lyricList && this.$refs.lyricList.scrollToElement(lineEl, 1000)
      } else {
        this.$refs.lyricList && this.$refs.lyricList.scrollTo(0, 0, 1000)
      }
      this.playingLyric = txt
    },
    middleTouchStart(e) {
      this.touch.initiated = true
      // 用来判断是否是一次移动
      this.touch.moved = false
      const touch = e.touches[0]
      this.touch.startX = touch.pageX
      this.touch.startY = touch.pageY
    },
    middleTouchMove(e) {
      if (!this.touch.initiated) {
        return
      }
      const touch = e.touches[0]
      const deltaX = touch.pageX - this.touch.startX
      const deltaY = touch.pageY - this.touch.startY
      if (Math.abs(deltaY) > Math.abs(deltaX)) {
        return
      }
      if (!this.touch.moved) {
        this.touch.moved = true
      }
      const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
      const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
      this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = 0
      this.$refs.middleL.style.opacity = 1 - this.touch.percent
      this.$refs.middleL.style[transitionDuration] = 0
    },
    middleTouchEnd() {
      if (!this.touch.moved) {
        return
      }
      let offsetWidth
      let opacity
      if (this.currentShow === 'cd') {
        if (this.touch.percent > 0.1) {
          offsetWidth = -window.innerWidth
          opacity = 0
          this.currentShow = 'lyric'
        } else {
          offsetWidth = 0
          opacity = 1
        }
      } else {
        if (this.touch.percent < 0.9) {
          offsetWidth = 0
          this.currentShow = 'cd'
          opacity = 1
        } else {
          offsetWidth = -window.innerWidth
          opacity = 0
        }
      }
      const time = 300
      this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
      this.$refs.middleL.style.opacity = opacity
      this.$refs.middleL.style[transitionDuration] = `${time}ms`
      this.touch.initiated = false
    },
    _getPosAndScale() {
      const targetWidth = 40
      const paddingLeft = 40
      const paddingBottom = 30
      const paddingTop = 80
      const width = window.innerWidth * 0.8
      const scale = targetWidth / width
      const x = -(window.innerWidth / 2 - paddingLeft)
      const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
      return {
        x,
        y,
        scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayMode: 'SET_PLAY_MODE',
      setPlayList: 'SET_PLAY_LIST'
    })
  },
  watch: {
    // 当前播放歌曲
    currentSong(newValue, oldValue) {
      if (!newValue) {
        return false
      }
      if (oldValue && newValue.id === oldValue.id) {
        return false
      }
      if (this.currentLyric) {
        this.currentLyric.stop()
      }
      this.$nextTick(() => {
        this.$refs.audio.play()
        this.getLyric()
      })
    },
    // 播放状态
    playing(newValue) {
      this.$nextTick(() => {
        const audio = this.$refs.audio
        newValue ? audio.play() : audio.pause()
      })
    },
    // 播放模式
    playMode(newMode) {
      console.log(newMode)
      if (newMode === playMode.random) {
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
  },
  filters: {
    // 秒转分
    secondToMinute(second) {
      second = second | 0
      let minute = (second / 60) | 0
      let s = second % 60
      // return `${minute}:${s}`
      return {minute, s}
    },
    // 补零
    zeroCompensation(option, digit = 2) {
      for (let k in option) {
        let str = option[k].toString()
        while (str.length < digit) {
          str = `0${str}`
        }
        option[k] = str
      }
      let {minute, s} = option
      return `${minute}:${s}`
    }
  },
  components: {
    ProgressBar,
    ProgressCicle,
    Scroll,
    Playlist
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              // color: $color-text-l
              color: white
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: yellow
                // color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
            padding: 0 5px
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>

<template>
  <div class="progress-bar" ref="progressBar" @click='changePlayTime'>
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper"
        @touchstart.stop.prevent='touchStart'
        @touchmove.stop.prevent='touchMove'
        @touchend='touchEnd'
        ref="progressBtn">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {prefixStyle} from 'common/js/dom'
const transform = prefixStyle('transform')
const PROGRESS_BTN_WIDTH = 13
export default {
  props: {
    percent: {
      type: Number,
      default: 0
    }
  },
  created() {
    this.touch = {}
  },
  methods: {
    changePlayTime(e) {
      let offsetX = e.offsetX
      let percentWidth = offsetX / this.$refs.progressBar.clientWidth
      this._changeTime(percentWidth)
    },
    // touch事件相关
    touchStart(e) {
      // console.log(e)
      this.touch.initiated = true
      this.touch.x = e.touches[0].pageX
      this.touch.progressWidth = this.$refs.progress.clientWidth
    },
    touchMove(e) {
      // console.log(e)
      if (!this.touch.initiated) {
        return false
      }
      let moveWidth = e.touches[0].pageX - this.touch.x
      let offsetWith = Math.min(Math.max(0, this.touch.progressWidth + moveWidth), this.$refs.progressBar.clientWidth)
      this._setOffsetWidth(offsetWith)
    },
    touchEnd() {
      let percentWidth = this.$refs.progress.clientWidth / this.$refs.progressBar.clientWidth
      this._changeTime(percentWidth)
      this.touch.initiated = false
    },
    // 设置播放进度
    _setOffsetWidth(offsetWith) {
      let progress = this.$refs.progress
      let progressBtn = this.$refs.progressBtn
      progress.style.width = `${offsetWith}px`
      progressBtn.style[transform] = `translate3d(${Math.max(offsetWith - PROGRESS_BTN_WIDTH, 0)}px, 0, 0)`
    },
    // 获取播放位置
    _getOffsetWidth(percent) {
      percent = Math.max(0, percent)
      let progressBarWidth = this.$refs.progressBar.clientWidth
      let offsetWith = percent * progressBarWidth
      return offsetWith
    },
    _changeTime(precentWidth) {
      this.$emit('move', precentWidth)
    }
  },
  watch: {
    percent(newValue) {
      if (!this.touch.initiated) {
        this._setOffsetWidth(this._getOffsetWidth(newValue))
      }
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" :class="{active: currentPageIndex === index }" v-for="(item, index) in dots" :key='index'></span>
    </div>
  </div>
</template>
<script>
import {addClass} from 'common/js/dom'
import BScroll from 'better-scroll'
export default {
  data() {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  methods: {
    _setSliderWidth() {
      let sliderWidth = this.$refs.slider.clientWidth
      this.children = this.$refs.sliderGroup.children
      let width = 0
      for (let i = 0; i < this.children.length; i++) {
        let item = this.children[i]
        addClass(item, 'slider-item')
        item.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.loop) {
        width += sliderWidth * 2
      }
      this.$refs.sliderGroup.style.width = width + 'px'
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSlider() {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false,
        // snap: true,
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
      this.slider.on('scrollEnd', () => {
        this.currentPageIndex = this.slider.getCurrentPage().pageX
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _play() {
      let pageIndex = this.currentPageIndex + 1
      // pageIndex += this.currentPageIndex
      // console.log(pageIndex)
      if (pageIndex >= 5) {
        pageIndex = 0
      }
      this.timer = setTimeout(() => {
        // console.log(pageIndex)
        this.slider.goToPage(pageIndex, 0, 400)
      }, this.interval)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      if (this.autoPlay) {
        this._play()
      }
    })
    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSliderWidth()
      this.slider.refresh()
    })
  },
  destroyed() {
    clearTimeout(this.timer)
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
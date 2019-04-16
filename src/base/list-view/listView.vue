<template>
  <scroll class="listview" :data='data' ref="scrollView" :listenScroll='true' @scroll='scroll' :probeType='3'>
    <ul>
      <li class="list-group" v-for='group in data' :key="group.title" ref='group'>
        <h2 class="list-group-title" ref="groupTitle">{{group.title}}</h2>
        <ul>
          <li class="list-group-item" v-for='value in group.item' :key='value.id' @click='selectItem(value)'>
            <img v-lazy="value.avatar" class="avatar">
            <span class="name">{{value.name}}</span>
          </li>
        </ul>
      </li>
    </ul>
    <div class="list-shortcut" @touchmove.stop.prevent='shortcutTouchMove'>
      <ul>
        <li class="item" v-for='(item, index) in shortcutList' :key='index'
          :class='index === scrollInfo.scrollIndex ? "current" : ""'
          @touchstart='shortcutTouchStart($event, index)'>
          {{item}}
        </li>
      </ul>
    </div>
    <div class="list-fixed" v-show='fixedTitle' ref='fixed'>
      <h1 class="fixed-title">{{fixedTitle}}</h1>
    </div>
    <div class="loading-container" v-show='loading'>
      <loading></loading>
    </div>
  </scroll>
</template>
<script>
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
const SHOETCUT_HEIGHT = 18
const FIXED_HEIGHT = 30
export default {
  data() {
    return {
      scrollInfo: {
        listenScroll: true,
        scrollIndex: 0,
        scrollY: 0
      },
      heights: [],
      offsetHeight: null
    }
  },
  created() {
    this.touchInfo = {}
    // 节流阀（用于固定定位偏移操作dom）
    this.fixedLang = true
  },
  props: {
    data: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('select', item)
    },
    shortcutTouchStart(e, index) {
      // console.log(index)
      this.touchInfo.pageY = e.changedTouches[0].pageY
      this.touchInfo.index = index
      this._scrollToElement(index)
    },
    shortcutTouchMove(e) {
      let index = parseInt((e.changedTouches[0].pageY - this.touchInfo.pageY) / SHOETCUT_HEIGHT)
      // console.log(index)
      // console.log(`index:${this.touchInfo.index}`)
      index = index + this.touchInfo.index
      if (index < 0) {
        index = 0
      } else if (index >= this.shortcutList.length) {
        index = this.shortcutList - 1
      }
      this._scrollToElement(index)
    },
    scroll(pos) {
      // 左右联动
      this.scrollInfo.scrollY = pos.y
      let scrollY = Math.abs(pos.y)
      for (let i = 0; i < this.heights.length; i++) {
        let height1 = this.heights[i]
        let height2 = this.heights[i + 1]
        if (scrollY >= height1 && scrollY <= height2) {
          this.scrollInfo.scrollIndex = i
          this.offsetHeight = height2 - scrollY
          return
        }
      }
    },
    _scrollToElement(index) {
      this.scrollInfo.scrollIndex = index
      let element = this.$refs.groupTitle[index]
      this.$refs.scrollView.scrollToElement(element, 0)
    }
  },
  watch: {
    data() {
      this.$nextTick(() => {
        let groups = this.$refs.group
        let heights = []
        let height = 0
        heights.push(height)
        for (let i = 0; i < groups.length; i++) {
          height += groups[i].clientHeight
          heights.push(height)
        }
        // console.log(`height:${height}`)
        // console.log(heights)
        this.heights = heights
      })
    },
    offsetHeight(newValue) {
      newValue = parseInt(newValue)
      if (newValue <= FIXED_HEIGHT) {
        // console.log(newValue)
        let y = FIXED_HEIGHT - newValue
        this.$refs.fixed.style.transform = `translate3d(0,-${y}px,0)`
        this.fixedLang = false
      } else {
        if (this.fixedLang) {
          return false
        }
        // console.log('哈哈')
        this.$refs.fixed.style.transform = 'none'
        this.fixedLang = true
      }
    }
  },
  computed: {
    shortcutList() {
      return this.data.map(item => {
        return item.title.slice(0, 1)
      })
    },
    // 固定标题
    fixedTitle() {
      // console.log(this.scrollInfo.scrollY)
      if (this.scrollInfo.scrollY >= 0) {
        return false
      }
      let index = this.scrollInfo.scrollIndex
      return this.data[index].title
    }
  },
  components: {
    Scroll,
    Loading
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

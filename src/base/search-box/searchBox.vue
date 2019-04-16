<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input class="box" v-model='query' :placeholder='placeholder' ref='input' @focus='focus'/>
    <i class="icon-dismiss" v-show='query' @click='clear'></i>
  </div>
</template>
<script>
import {debounce} from 'common/js/util'
export default {
  data() {
    return {
      query: ''
    }
  },
  props: {
    placeholder: {
      type: String,
      default: '搜歌曲，歌手'
    }
  },
  created() {
    // 这里要进行节流，避免速度快时多次发送请求
    this.$watch('query', debounce(newValue => {
      this.$emit('search', newValue)
    }, 400))
  },
  methods: {
    setQuery(query) {
      this.query = query
    },
    clear() {
      this.query = ''
    },
    // 输入框失去焦点
    inputBlur() {
      this.$refs.input.blur()
    },
    focus() {
      this.$emit('focus')
    }
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>

<template>
  <div class="search-list" v-show='searchHistory'>
    <transition-group name="list" tag="ul">
      <li class="search-item" v-for="item in searchHistory" :key="item" @click='selectItem(item)'>
        <span class="text">{{item}}</span>
        <span class="icon" @click.prevent.stop='deleteHistory(item)'>
          <i class="icon-delete"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    searchHistory: {
      type: Array,
      default: null
    }
  },
  methods: {
    selectItem(item) {
      this.$emit('search', item)
    },
    deleteHistory(item) {
      this.$emit('remove', item)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
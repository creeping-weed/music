<template>
  <div class="recommend">
    <div class="recommend-content">
      <scroll ref="scroll" class="recommend-content" :data="discList">
        <div>
          <div class="slider-wrapper" v-if="recommendList.length">
            <slider>
              <div v-for='item in recommendList' :key='item.id'>
                <a :href='item.linkUrl'>
                  <img :src='item.picUrl' alt="">
                </a>
              </div>
            </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li v-for="item in discList" class="item" :key='item.dissid' @click='selectDisc(item)'>
                <div class="icon">
                  <img width="60" height="60" v-lazy='item.imgurl'>
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-container" v-show='!discList.length'>
          <loading></loading>
        </div>
      </scroll>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/common.config.js'
import Slider from 'base/slider/slider'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {playlistMixin} from 'common/js/mixin'
import {mapMutations} from 'vuex'
export default {
  mixins: [playlistMixin],
  name: 'recommend',
  data() {
    return {
      recommendList: [],
      discList: []
    }
  },
  created() {
    this._getRecommend()
    this._getDiscList()
  },
  methods: {
    selectDisc(item) {
      const {dissid, dissname, imgurl} = item
      if (dissname && imgurl && dissid) {
        this.setDisc({dissid, dissname, imgurl})
        this.$router.push(`/recommend/${dissid}`)
      }
    },
    handlePlaylist(playlist) {
      const bottom = playlist.length > 0 ? '60px' : '0'
      this.$refs.scroll.$el.children[0].style.paddingBottom = bottom
      this.$refs.scroll.refresh()
    },
    async _getRecommend() {
      const res = await getRecommend()
      const {code, data} = res
      // console.log(data)
      if (code === ERR_OK) {
        this.recommendList = data.slider
      }
    },
    async _getDiscList() {
      const res = await getDiscList()
      const {code, data} = res
      if (code === ERR_OK) {
        this.discList = data.list
      }
    },
    ...mapMutations({
      setDisc: 'SET_DISC'
    })
  },
  components: {
    Slider,
    Scroll,
    Loading
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
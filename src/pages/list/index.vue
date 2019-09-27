<template>
  <div class="wrapper" id="nice-links">
    <div class="content" @click="onContentClick(item)"
      v-for="(item, index) in niceLinksArray" :key="index">
      <h3 class="title" @click.stop="onTitleClick(item)">
        {{ item.title }}
      </h3>
      <rich-text class="review" :nodes="item.review"></rich-text>
    </div>
  </div>
</template>

<script>
import $config from 'config'
import { $apis, $util } from 'helper'

export default {
  name: 'NiceLinks',

  data () {
    return {
      pageCount: 0,
      pageSize: 12,
      isLoading: false,
      niceLinksArray: [],
      util: $util
    }
  },

  components: {
  },

  watch: {
  },

  created () {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  mounted () {
    this.updatePageTitle()
    this.setFetchData()
  },

  onReachBottom() {
    this.setFetchData()
  },

  methods: {
    updatePageTitle () {
      wx.setNavigationBarTitle({
        title: '探索美好'
      })
    },

    setFetchData () {
      this.pageCount += 1
      const params = {
        pageCount: this.pageCount,
        pageSize: this.pageSize,
        sortType: -1,
        sortTarget: 'likes',
        active: true,
      }
      $apis.getNiceLinks(params).then(result => {
        result.forEach(item => {
          item.review = $util.parseMarkdown(item.review) || item.desc
        })
        this.niceLinksArray = this.niceLinksArray.concat(result)
      }).catch((error) => {
        console.log(error)
      }).finally(() => {
        this.isLoading = false
      })
    },

    parseMarkdown (mdStr) {
      return $util.parseMarkdown(mdStr)
    },

    copy2clipboard (path) {
      wx.setClipboardData({
        data: path,
        success: () => {
          wx.showToast({
            title: '已将连接拷贝至剪切板，可在浏览器端访问',
            icon: 'none',
            duration: 2000
          })
        },
        fail: () => {}
      })
    },

    onTitleClick (item) {
      const path = `${item.urlPath}?utm_source=nicelinks.site`
      this.copy2clipboard(path)
    },

    onContentClick (item) {
      wx.navigateTo({
        url: `/pages/post/main?id=${item._id}`
      })
    }
  }
}
</script>

<style type="text/css" lang="scss" scoped>
@import "../../assets/scss/variables.scss";
.wrapper{
  padding: 0 20rpx;
}
.content{
  background-color: #fff;
  box-shadow: 0 0 12px 2px rgba(0,0,0,.1);
  margin: 30rpx 0;
  padding: 20rpx;
  .title{
    margin: 15px 0;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: $font-medium;
    font-weight: 600;
    line-height: 1.2;
    text-decoration: none;
    color: $link-title;
    transition: color 0.3s ease-in;
    &:hover{
      transition: color 0.3s ease-out;
      color: $link-title-hover;
    }
  }
  .review {
    display: -webkit-box;
    width: 100%;
    margin-bottom: $font-small;
    font-size: $font-small;
    color: $silver-grey;
    line-height: 1.5;
    letter-spacing: 2rpx;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: pre-wrap;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}
</style>

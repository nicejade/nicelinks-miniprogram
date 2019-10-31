<template>
  <div class="wrapper">
    <div class="content">
      <h3 class="title" @click="onTitleClick">{{ niceLinksItem.title }}</h3>
      <div class="keywords" v-if="niceLinksItem.keywords">{{ niceLinksItem.keywords }}</div>
      <div class="desc">{{ niceLinksItem.desc }}</div>
      <rich-text class="review" :nodes="reviewNodeStr"></rich-text>
      <button class="button" @click="onKnowMoreTap">复制链接</button>
      <h4 class="title">箴言锦语</h4>
      <AwesomeSentence></AwesomeSentence>
    </div>
  </div>
</template>

<script>
import $config from 'config'
import { $apis, $util } from 'helper'
import AwesomeSentence from 'components/AwesomeSentence'

export default {
  name: 'NiceLinks',

  data() {
    return {
      linkId: '',
      niceLinksItem: {},
      reviewNodeStr: '',
      currentSentenceStr: ''
    }
  },

  components: {
    AwesomeSentence
  },

  computed: {},

  watch: {},

  created() {},

  onLoad(options) {
    console.log(options)
    this.linkId = options.id

    wx.showShareMenu({
      withShareTicket: true
    })
  },

  mounted() {
    this.setFetchData()
  },

  onShareAppMessage(res) {
    return {
      title: `倾城 | ${this.niceLinksItem.title}`
    }
  },

  methods: {
    updatePageTitle() {
      wx.setNavigationBarTitle({
        title: `倾城 | ${this.niceLinksItem.title}`
      })
    },

    setFetchData() {
      const params = {
        _id: this.linkId
      }
      $apis
        .getNiceLinks(params)
        .then(result => {
          this.reviewNodeStr = $util.parseMarkdown(result[0].review)
          this.niceLinksItem = result[0]
          this.updatePageTitle()
        })
        .catch(error => {
          console.log(error)
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    copy2clipboard(path) {
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

    onTitleClick() {
      const path = `${this.niceLinksItem.urlPath}?utm_source=nicelinks.site`
      this.copy2clipboard(path)
    },

    onKnowMoreTap(item) {
      const path = `https://nicelinks.site/post/${this.linkId}`
      this.copy2clipboard(path)
    }
  }
}
</script>

<style type="text/css" lang="scss" scoped>
@import '../../assets/scss/variables.scss';
.wrapper {
  background-color: $white;
}
.content {
  backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.618);
  margin: 3 * $size-factor 0;
  padding: 3 * $size-factor;
  .title {
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
    &:hover {
      transition: color 0.3s ease-out;
      color: $link-title-hover;
    }
  }
  .desc {
    margin-top: $font-small;
    border-left: 2px solid #343434;
    padding: 20rpx;
    font-size: $font-small;
    color: $silver-grey;
    line-height: 1.5;
    letter-spacing: 2rpx;
  }
  .keywords,
  .review {
    display: -webkit-box;
    width: 100%;
    margin-top: $font-small;
    font-size: $font-small;
    color: $black-grey;
    line-height: 1.5;
    letter-spacing: 2rpx;
  }
}
</style>

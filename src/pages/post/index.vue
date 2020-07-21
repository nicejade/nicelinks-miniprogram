<template>
  <div class="wrapper">
    <PlaceholderLoading v-if="isRequestDataFlag"></PlaceholderLoading>
    <div class="content" v-else>
      <h3 class="title" @click="onTitleClick">{{ niceLinksItem.title }}</h3>
      <div class="keywords" v-if="niceLinksItem.keywords">{{ niceLinksItem.keywords }}</div>
      <div class="mp-space desc">{{ niceLinksItem.desc }}</div>
      <rich-text class="mp-space review" :nodes="reviewNodeStr"></rich-text>
      <button class="mp-space button" @click="onKnowMoreTap">复制链接</button>
    </div>
    <h4 class="title">箴言锦语</h4>
    <AwesomeSentence></AwesomeSentence>
    <!-- <h4 class="title">倾情款赠</h4>
    <img src="https://nicelinks.site/static/img/reward_wexin.jpg" show-menu-by-longpress="true" mode="center" lazy-load /> -->
    <block v-if="isShowOaFlag">
      <h4 class="title">关联公众号</h4>
      <official-account></official-account>
    </block>
    <div class="ad-view">
      <ad unit-id="adunit-b2c629edc8a1fa6f" ad-type="video" ad-theme="white"></ad>
    </div>
  </div>
</template>

<script>
import $config from 'config'
import { $apis, $util } from 'helper'
import AwesomeSentence from 'components/AwesomeSentence'
import PlaceholderLoading from 'components/PlaceholderLoading'

export default {
  name: 'NiceLinks',

  data() {
    return {
      linkId: '',
      isRequestDataFlag: false,
      niceLinksItem: {},
      reviewNodeStr: '',
      currentSentenceStr: '',
      isShowOaFlag: false
    }
  },

  components: {
    AwesomeSentence,
    PlaceholderLoading
  },

  computed: {},

  watch: {},

  created() {},

  onLoad(options) {
    this.linkId = options.id

    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })

    // 只在特定场景下才展示：https://developers.weixin.qq.com/miniprogram/dev/component/official-account.html
    const launchOptions = wx.getLaunchOptionsSync()
    const showOaSceneArr = [1047, 1124]
    if (showOaSceneArr.includes(launchOptions.scene)) {
      this.isShowOaFlag = true
    }
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
      this.isRequestDataFlag = true
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
          this.isRequestDataFlag = false
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

<style type="text/css" lang="less" scoped>
@import '../../assets/less/variables.less';
.wrapper {
  backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.618);
  padding: 0 3 * @size-factor 3 * @size-factor 3 * @size-factor;
}
.mp-space {
  margin-top: 2 * @size-factor;
}
.title {
  margin-top: 3 * @size-factor;
  margin-bottom: 2 * @size-factor;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: @font-medium;
  font-weight: 600;
  line-height: 1.2;
  text-decoration: none;
  color: @link-title;
}
.content {
  .title {
    margin-top: 0;
  }
  .desc {
    border-left: 2px solid #343434;
    padding: 20rpx;
    font-size: @font-small;
    color: @silver-grey;
    line-height: 1.5;
    letter-spacing: 2rpx;
  }
  .keywords,
  .review {
    display: -webkit-box;
    width: 100%;
    font-size: @font-small;
    color: @black-grey;
    line-height: 1.5;
    letter-spacing: 2rpx;
  }
}
.ad-view {
  margin-top: 3 * @size-factor;
}
</style>

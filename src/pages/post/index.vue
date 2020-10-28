<template>
  <div class="wrapper">
    <PlaceholderLoading v-if="isRequestDataFlag"></PlaceholderLoading>
    <div class="content" v-else>
      <h3 class="title" @click="onTitleClick">{{ niceLinksItem.title }}</h3>
      <div class="mp-space keywords" v-if="niceLinksItem.keywords">{{ niceLinksItem.keywords }}</div>
      <text class="mp-space desc" user-select="true">{{ niceLinksItem.desc }}</text>
      <div class="mp-space link-screenshot">
        <image @click="onImageClick" class="link-image" webp="true" lazy-load="true" mode="widthFix"
          binderror="onHandleError" :src="linkScreenshot"></image>
      </div>
      <!-- <rich-text class="mp-space review" :nodes="reviewNodeStr"></rich-text> -->
      <wxParse :content="reviewNodeStr"></wxParse>
      <button class="mp-space copy-btn button" @click="onKnowMoreTap">复制链接</button>
    </div>
    <h4 class="title">箴言锦语</h4>
    <AwesomeSentence></AwesomeSentence>
    <!-- <h4 class="title">倾情款赠</h4>
    <image src="https://image.nicelinks.site/%E8%B5%9E%E8%B5%8F%E7%A0%81.jpeg?imageView2/1/w/300/h/300/interlace/1/ignore-error/1" show-menu-by-longpress="true" mode="center" lazy-load></image> -->
    <div class="ad-view">
      <ad unit-id="adunit-b2c629edc8a1fa6f" ad-type="video" ad-theme="white"></ad>
    </div>
    <block v-if="isShowOaFlag">
      <h4 class="title">关联公众号</h4>
      <official-account></official-account>
    </block>
  </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'

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
      isShowOaFlag: false,
      linkScreenshot: 'https://oss.nicelinks.site/nicelinks.site.png',
    }
  },

  components: {
    wxParse,
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
    updatelinkScreenshot() {
      const urlPath = this.niceLinksItem.urlPath
      console.log(urlPath)
      const matches = urlPath.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)
      const hostname = matches && matches[1]
      this.linkScreenshot = `https://oss.nicelinks.site/${hostname}.png?x-oss-process=style/png2webp`
    },

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
          this.updatelinkScreenshot()
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
      const path = `https://nicelinks.site/redirect?url=${item.urlPath}`
      this.copy2clipboard(path)
    },

    onImageClick() {
      wx.previewImage({
        current: this.linkScreenshot,
        urls: [this.linkScreenshot]
      })
    },

    onHandleError() {
      this.linkScreenshot = `https://oss.nicelinks.site/nicelinks.site.png`
    }
  }
}
</script>

<style type="text/css" lang="less" scoped>
@import '../../assets/less/variables.less';
@import url("~mpvue-wxparse/src/wxParse.css");

.wrapper {
  backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.618);
  padding: 0 3 * @size-factor 3 * @size-factor 3 * @size-factor;
}
.mp-space {
  margin-top: 3 * @size-factor;
}
.copy-btn {
  height: 2.5 * @font-small;
  line-height: 2.5 * @font-small;
  border-radius: 1.25 * @font-small;
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
    display: block;
    border-left: 3px solid #343434;
    padding: 10rpx 20rpx;
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
  .link-screenshot {
    width: 100%;
    .link-image {
      width: 100%;
      filter: drop-shadow(0 0 20px #969696);
    }
  }
}
.ad-view {
  margin-top: 3 * @size-factor;
}
</style>

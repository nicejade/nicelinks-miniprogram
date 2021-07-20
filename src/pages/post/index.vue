<template>
  <div class="wrapper">
    <PlaceholderLoading v-if="isRequestDataFlag"></PlaceholderLoading>
    <div class="content" v-else>
      <div class="info-block">
        <img class="avatar" :src="userAvatar" :alt="niceLinksItem.title" />
        <div class="meta-block">
          <div class="meta-box">
            <span class="user">{{ mUserInfo && mUserInfo.profile && mUserInfo.profile.nickname || niceLinksItem.createdBy || '' }}</span>
          </div>
          <div class="meta-box">
            <span class="pageview">阅读数 {{ niceLinksItem.countup + 1 }}</span>
            <span class="time">分享于 {{ niceLinksItem.created }}</span>
          </div>
        </div>
      </div>
      <h3 class="title" @click="onTitleClick">
        <img class="copy-link" src="./../../assets/tabbar/copy-link.png" alt="复制优质链接">
        {{ niceLinksItem.title }}
      </h3>
      <div class="tag-block">
        <span class="tag" 
        :key="index"
        v-for="(iitem, index) in niceLinksItem.tags">#{{ iitem }}</span>
      </div>
      <div class="mp-space keywords" v-if="niceLinksItem.keywords">{{ niceLinksItem.keywords }}</div>
      <text class="mp-space desc" user-select="true">{{ niceLinksItem.desc }}</text>
      <div class="mp-space link-screenshot">
        <image @click="onImageClick" class="link-image" webp="true" lazy-load="true" mode="widthFix"
          binderror="onHandleError" :src="linkScreenshot"></image>
      </div>
      <!-- <rich-text class="mp-space review" :nodes="reviewNodeStr"></rich-text> -->
      <wxParse :content="reviewNodeStr"></wxParse>
      <div class="operate-area">
        <button class="mp-space copy-btn button" @click="onCopyClick">复制链接</button>
        <button class="mp-space share-btn button" type="primary" plain="true" open-type='share'>一键分享</button>
      </div>
    </div>
    <h4 class="title">箴言锦语</h4>
    <AwesomeSentence :index="index"></AwesomeSentence>
    <!-- <h4 class="title">倾情款赠</h4>
    <image src="https://image.nicelinks.site/%E8%B5%9E%E8%B5%8F%E7%A0%81.jpeg?imageView2/1/w/300/h/300/interlace/1/ignore-error/1" show-menu-by-longpress="true" mode="center" lazy-load></image> -->
    <div class="ad-view">
      <ad unit-id="adunit-b2c629edc8a1fa6f" ad-type="video" ad-theme="white"></ad>
    </div>
    <block v-if="isShowOaFlag">
      <!-- <h4 class="title">关联公众号</h4> -->
      <official-account></official-account>
    </block>
  </div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
import { $apis, $util } from 'helper'
import $config from "config";
import AwesomeSentence from 'components/AwesomeSentence'
import PlaceholderLoading from 'components/PlaceholderLoading'

export default {
  name: 'NiceLinks',

  data() {
    return {
      linkId: '',
      options: {},
      mUserInfo: {
        profile: {}
      },
      isRequestDataFlag: false,
      niceLinksItem: {
        countup: 0
      },
      index: 0,
      reviewNodeStr: '',
      currentSentenceStr: '',
      isShowOaFlag: false,
      linkScreenshot: $config.constant.IMAGE_URL,
      shareImageUrl: `${$config.constant.IMAGE_URL}?x-oss-process=style/ratio-5-4`,
    }
  },

  components: {
    wxParse,
    AwesomeSentence,
    PlaceholderLoading
  },

  computed: {
    userAvatar() {
      if (this.mUserInfo) {
        let defaultAvatar = 'https://nicelinks.site/api/avatar/2021-01-05-19-41-12-5a5cca4ce05887175ee08522'
        let userAvatar = this.mUserInfo.profile && this.mUserInfo.profile.avatar
        return userAvatar ? `https://nicelinks.site/api/avatar/${userAvatar}` : defaultAvatar
      }
    }
  },

  watch: {},

  created() {},

  onLoad(options) {
    this.options = options
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
    this.getUserInfoByUsername()
  },

  onShareAppMessage(res) {
    return {
      title: `倾城之链 | ${this.niceLinksItem.title}`,
      imageUrl: this.shareImageUrl,
      path: `/pages/post/main?id=${this.niceLinksItem._id}&createdBy=${this.niceLinksItem.createdBy}`
    }
  },

  methods: {
    getUserInfoByUsername() {
      let params = { username: this.options.createdBy }
      $apis
        .getUserInfo(params)
        .then((result) => {
          this.mUserInfo = result
        })
        .catch((error) => {
          this.$message.error(`${error}`)
        })
        .finally(() => {})
    },

    convertDateTime(datetime = '') {
      if (!arguments.length) return ''
      let now = new Date().getTime()
      let offsetValue = now - new Date(datetime).getTime()
      let minute = 1000 * 60
      let hour = minute * 60
      let day = hour * 24
      let week = day * 7
      let month = day * 30
      let year = month * 12

      let unitArr = ['年前', '月前', '周前', '天前', '小时前', '分钟前', '刚刚']
      let offsetArr = [year, month, week, day, hour, minute].map((item, index) => {
        return {
          value: offsetValue / item,
          unit: unitArr[index],
        }
      })

      for (let key in offsetArr) {
        if (offsetArr[key].value >= 1) {
          return parseInt(offsetArr[key].value) + ' ' + offsetArr[key].unit
        }
      }
      return unitArr[6]
    },

    updatelinkScreenshot() {
      const urlPath = this.niceLinksItem.urlPath
      const matches = urlPath.match(/^https?\:\/\/([^\/?#]+)(?:[\/?#]|$)/i)
      const hostname = matches && matches[1]
      this.linkScreenshot = `https://oss.nicelinks.site/${hostname}.png?x-oss-process=style/png2webp`
      this.shareImageUrl = `https://oss.nicelinks.site/${hostname}.png?x-oss-process=style/ratio-5-4`
    },

    updatePageTitle() {
      wx.setNavigationBarTitle({
        title: `${this.niceLinksItem.title} | 倾城之链`
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
          const defaultText = '<p>此网站，暂未写推荐语；<strong>倾城之链</strong>：倾心缔造，痴心为你。</p>'
          this.reviewNodeStr = $util.parseMarkdown(result[0].review) || defaultText
          this.updatePageSentence(result[0].created)
          result[0].created = this.convertDateTime(result[0].created)
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

    updatePageSentence(createdTime) {
      const createTime = new Date(createdTime)
      const startTime = new Date("2017-09-14")
      const offsetTime = createTime.getTime() - startTime.getTime()
      this.index = Math.ceil(offsetTime / 1296000000) // (15 * 24 * 60 * 60 * 1000)
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

    onCopyClick() {
      const path = `https://nicelinks.site/redirect?url=${this.niceLinksItem.urlPath}`
      this.copy2clipboard(path)
    },

    onImageClick() {
      wx.previewImage({
        current: this.linkScreenshot,
        urls: [this.linkScreenshot]
      })
    },

    onHandleError() {
      this.linkScreenshot = $config.constant.IMAGE_URL
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
.copy-btn, .share-btn {
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
.info-block {
  height: 160rpx;
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  .avatar {
    width: 10 * @size-factor;
    height: 10 * @size-factor;
    border-radius: 50%;
    box-shadow: 0 0 0 2px #fff;
  }
  .meta-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-left: 20rpx;
    font-size: @font-small;
    .meta-box {
      width: 100%;
      display: flex;
      flex-direction: row;
      justify-content: left;
      align-items: center;
      .user {
        font-weight: bold;
      }
      .pageview {
        color: @silver-grey;
      }
      .time {
        color: @black-grey;
        margin-left: 20rpx;
      }
    }
  }
}
.tag-block {
  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
  font-size: @font-small;
  color: @silver-grey;
  .tag {
    display: flex;
    flex-direction: row;
    justify-content: left;
    align-items: center;
    margin-right: 20rpx;
    color: @brand;
    background-color: #f6f6f6;
    padding: 0 5px;
    border-radius: 2px;
  }
}
.content {
  .title {
    margin-top: 0;
    .copy-link {
      width: 12px;
      height: 12px;
    }
  }
  .desc {
    display: block;
    border-left: 3px solid #343434;
    padding: 0rpx 20rpx;
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
  .operate-area {
    width: 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }
}
.ad-view {
  margin-top: 3 * @size-factor;
}
</style>

<script>
export default {
  created() {
    // 广告预加载 https://developers.weixin.qq.com/miniprogram/dev/framework/open-ability/ad/preload-ad.html#
    wx.preloadAd([
      {
        unitId: 'adunit-b8597298ad9815ee', // banner广告广告单元
        type: 'banner' // banner广告
      },
      {
        unitId: 'adunit-9ddfb625edc2f4c9', // banner广告广告单元
        type: 'banner' // banner广告
      },
      {
        unitId: 'adunit-bf7192a16fd82d8a', // banner广告广告单元
        type: 'banner' // banner广告
      },
      {
        unitId: 'adunit-70ae2fde86f2c5a1', // banner广告广告单元
        type: 'banner' // banner广告
      },
      {
        unitId: 'adunit-b2c629edc8a1fa6f', // 视频广告广告单元
        type: 'video' // 视频广告
      }
    ])
    // 调用API从本地缓存中获取数据
    /*
     * 平台 api 差异的处理方式:  api 方法统一挂载到 mpvue 名称空间, 平台判断通过 mpvuePlatform 特征字符串
     * 微信：mpvue === wx, mpvuePlatform === 'wx'
     * 头条：mpvue === tt, mpvuePlatform === 'tt'
     * 百度：mpvue === swan, mpvuePlatform === 'swan'
     * 支付宝(蚂蚁)：mpvue === my, mpvuePlatform === 'my'
     */
    /*
    let logs
    if (mpvuePlatform === 'my') {
      logs = mpvue.getStorageSync({ key: 'logs' }).data || []
      logs.unshift(Date.now())
      mpvue.setStorageSync({
        key: 'logs',
        data: logs
      })
    } else {
      logs = mpvue.getStorageSync('logs') || []
      logs.unshift(Date.now())
      mpvue.setStorageSync('logs', logs)
    }*/
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 200rpx 0;
  box-sizing: border-box;
}
/* this rule will be remove */
* {
  transition: width 2s;
  -moz-transition: width 2s;
  -webkit-transition: width 2s;
  -o-transition: width 2s;
}
</style>

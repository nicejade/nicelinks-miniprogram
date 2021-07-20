<template>
  <div id="awesome-sentence" class="awesome-sentence">
    <div class="lined-paper" v-show="currentSentenceStr">
      <rich-text class="review" :nodes="currentSentenceStr"></rich-text>
    </div>
    <div class="btn-group">
      <div class="common-btn" @click="onPreviousClick">
        <div class="opt-icon previous"></div>
      </div>
      <div class="common-btn button-ripple" :class="btnClassName" @click="onRandomClick">
        <div class="opt-icon random"></div>
      </div>
      <div class="common-btn" @click="onCopy2ClipboardClick">
        <div class="opt-icon copy"></div>
      </div>
    </div> 
  </div>
</template>

<script>
import { $apis, $util } from 'helper'

export default {
  name: 'AwesomeSentence',

  data() {
    return {
      isLoading: false,
      sentence: '',
      isCanLookBack: false,
      currentSentenceStr: '',
      lastSentenceStr: '',
      currentSentence: {},
      interstitialAdCounter: 0
    }
  },

  props: {
    index: {
      type: [Number],
      default: 1,
    }
  },

  computed: {
    btnClassName() {
      const sentenceType = this.currentSentence.type
      return `${sentenceType}-colors`
    },
    currentSentenceStr() {
      return $util.parseMarkdown(this.currentSentence.content || this.sentence.content)
    }
  },

  components: {},

  created() {
    $apis
      .getSysConf()
      .then(result => {
        // this.advertsList = result.advertsList.sort((a, b) => {
        //   return a.sort - b.sort
        // })

        this.sentence = result.sentence
      })
      .catch(error => {
        this.$message.error(`${error}`)
      })
  },

  mounted() {},

  watch: {
    'sentence.content': function(val = '') {
      const content = $util.parseMarkdown(val)
      this.currentSentenceStr = content
      this.lastSentenceStr = content
    },
    'index': function (val = 1) {
      this.updateSentence(val)
    }
  },

  methods: {
    updateSentence(index) {
       const params = {
        pageCount: index,
        pageSize: 1,
        sortType: 1,
        active: true,
        sortTarget: 'createTime',
      }
      $apis
        .getSentences(params)
        .then((result) => {
          if (!result || result.length === 0) return

          this.lastSentenceStr = this.currentSentenceStr
          this.isCanLookBack = true
          this.currentSentence = result[0] || {}
          this.currentSentenceStr = $util.parseMarkdown(result[0].content)
        })
        .catch((error) => {
          console.log(error)
          this.$message.error(`${error}`)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    showInterstitialAd() {
      // 在页面中定义插屏广告
      let interstitialAd = null

      // 在页面onLoad回调事件中创建插屏广告实例
      if (wx.createInterstitialAd) {
        interstitialAd = wx.createInterstitialAd({
          adUnitId: 'adunit-fb7b56095aa91e2a'
        })
        interstitialAd.onLoad(() => {})
        interstitialAd.onError((err) => {})
        interstitialAd.onClose(() => {})
      }

      // 在适合的场景显示插屏广告
      if (interstitialAd) {
        interstitialAd.show().catch((err) => {
          console.error(err)
        })
      }
    },
    /* ---------------------Self Defined Function--------------------- */
    setInterstitialAd() {
      this.interstitialAdCounter += 1
      if (this.interstitialAdCounter === 3) {
        this.interstitialAdCounter = 0
        this.showInterstitialAd()
      }
    },
    /* ---------------------Click Event--------------------- */
    onPreviousClick() {
      if (!this.isCanLookBack) {
        return wx.showToast({
          title: '错过，许是永恒，只可回首前一条',
          icon: 'none',
          duration: 2000
        })
      }
      this.currentSentenceStr = this.lastSentenceStr
      this.isCanLookBack = false
    },
    onRandomClick() {
      this.isLoading = true
      $apis
        .getRandomSentence()
        .then(result => {
          this.lastSentenceStr = this.currentSentenceStr
          this.isCanLookBack = true
          this.currentSentence = result || {}
          this.currentSentenceStr = $util.parseMarkdown(result.content)
          this.setInterstitialAd()
        })
        .catch(error => {
          this.$message.error(`${error}`)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    onCopy2ClipboardClick() {
      const content =
        $util.parseMarkdown(this.currentSentenceStr) + `── #小程序:倾城之链 · 箴言锦语`
      const contentWithoutHtmlLabel = content.replace(/<[^>]*>/g, '')
      wx.setClipboardData({
        data: contentWithoutHtmlLabel,
        success: () => {
          wx.showToast({
            title: '已将此条「锦语」复制到您的剪切板',
            icon: 'none',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style lang="less">
@import './../assets/less/variables.less';
@import './../assets/less/mixins.less';

.awesome-sentence {
  .lined-paper {
    margin: 0 auto;
    padding: 6px 10px;
    position: relative;
    color: #444;
    text-align: left;
    line-height: 26px;

    background: #fff;
    background: -webkit-linear-gradient(top, @border-grey 0%, @white 6%) 0 6px;
    -webkit-background-size: 100% 26px;
    -moz-background-size: 100% 26px;
    -ms-background-size: 100% 26px;
    -o-background-size: 100% 26px;
    background-size: 100% 26px;
    div,
    p {
      line-height: 26px;
    }
    div:last-child,
    p:last-child {
      margin: 0;
    }
  }
  .btn-group {
    margin-top: 10px;
    display: flex;
    justify-content: center;
    .common-btn {
      display: inline-block;
      position: relative;
      width: 9 * @size-factor;
      height: 9 * @size-factor;
      vertical-align: middle;
      text-align: center;
      border: 1px solid #efefef;
      border-radius: 50%;
      margin: 0 15px;
      .icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 2rem;
        height: 2rem;
      }
    }
  }
}

.review {
  display: -webkit-box;
  width: 100%;
  font-size: @font-small;
  color: @black-grey;
  letter-spacing: 2rpx;
}
.opt-icon {
  width: 5 * @size-factor;
  height: 5 * @size-factor;
  background-size: 100%;
  margin: 20rpx;
}
.previous {
  background-image: url('./../assets/icons/previous.svg');
}
.random {
  background-image: url('./../assets/icons/random.svg');
}
.copy {
  background-image: url('./../assets/icons/copy.svg');
}

.button-ripple {
  display: inline-block;
  .flex-box-center(column);
  margin: auto;
  overflow: hidden;
  position: relative;
  background-color: #efefef;
  text-align: center;
  border-radius: 50%;
  border: 1px solid #efefef;
  transition: background-color 0.3s linear, border 0.3s linear;
  box-shadow: 0 0 0 rgba(52, 223, 165, 0.4);
  animation: pulse 2s infinite;
  &:after {
    content: '';
    display: block;
    position: absolute;
    width: 3.1rem;
    height: 3.1rem;
    top: 0;
    left: 0;
    pointer-events: none;
    background-image: radial-gradient(circle, #000 10%, rgba(0, 0, 0, 0.2) 10.01%);
    background-repeat: no-repeat;
    background-position: 50%;
    transform: scale(10);
    opacity: 0;
    transition: transform 0.5s, opacity 1s;
  }
  &:active:after {
    border-radius: 50%;
    transform: scale(0);
    opacity: 0.2;
    transition: 0s;
  }
  &:hover {
    border-radius: 50%;
    color: @jade;
    fill: @jade;
    border: 1px solid @jade;
    animation: pulse 2s infinite;
  }
  &:focus {
    border-radius: 50%;
    border-color: rgba(52, 223, 165, 0.5);
  }
}
@keyframes pulse {
  0% {
    -moz-box-shadow: 0 0 0 0px rgba(52, 223, 165, 0.8);
    box-shadow: 0 0 0 0px rgba(52, 223, 165, 0.8);
    border-color: rgba(52, 223, 165, 0.6);
  }
  80% {
    -moz-box-shadow: 0 0 0 10px rgba(52, 223, 165, 0);
    box-shadow: 0 0 0 10px rgba(52, 223, 165, 0);
  }
  100% {
    -moz-box-shadow: 0 0 0 0 rgba(52, 223, 165, 0);
    box-shadow: 0 0 0 0 rgba(52, 223, 165, 0);
  }
}
</style>

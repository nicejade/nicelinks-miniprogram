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
      currentSentence: {}
    }
  },

  // props: {
  //   sentence: {
  //     type: [Object],
  //     default: ''
  //   }
  // },

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
    }
  },

  methods: {
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
        })
        .catch(error => {
          this.$message.error(`${error}`)
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    onCopy2ClipboardClick() {
      const constent = $util.parseMarkdown(this.currentSentenceStr) + `── 倾城之链 · 箴言锦语`
      wx.setClipboardData({
        data: constent,
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

<style lang="scss">
@import './../assets/scss/variables.scss';

.awesome-sentence {
  .lined-paper {
    margin: 0 auto;
    padding: 6px 10px;
    position: relative;
    color: #444;
    text-align: left;
    line-height: 26px;

    background: #fff;
    background: -webkit-linear-gradient(top, $border-grey 0%, $white 6%) 0 6px;
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
      width: 9 * $size-factor;
      height: 9 * $size-factor;
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
  font-size: $font-small;
  color: $black-grey;
  letter-spacing: 2rpx;
}
.opt-icon {
  width: 5 * $size-factor;
  height: 5 * $size-factor;
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
</style>

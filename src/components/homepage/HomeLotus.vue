<template>
  <section class="lotus fade-in animated" id="lotus">
    <article class="twelve columns cssanimations">
      <div class="flower-container">
        <div class="flower">
          <div class="part"></div>
          <div class="part"></div>
          <div class="part"></div>
          <div class="part"></div>
          <div class="part"></div>
          <div class="part"></div>
          <div class="part"></div>
          <div class="part"></div>
          <div class="part"></div>
          <div class="part"></div>
          <div class="part"></div>
          <div class="part"></div>
        </div>
        <div class="unit-wrapper">
          <h1 class="headline large-font">倾城之链</h1>
          <section class="hero-description">
            <div>倾城之链，作为一个开放平台，旨在云集全球优秀网站，探索互联网中更广阔的世界；<br>在这里，你可以轻松发现、学习、分享更多有用或有趣的事物。</div>
            <button class="button-ripple button" @click="onExploreTap">探索美好</button>
          </section>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
export default {
  name: 'HomeLotus',

  data() {
    return {}
  },

  components: {},

  created() {},

  methods: {
    onExploreTap() {
      // wx.navigateTo({
      //   url: '/pages/list/main'
      // })
      wx.switchTab({
        url: '/pages/latest/main'
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import './../../assets/less/variables.less';
@import './../../assets/less/mixins.less';

@media (min-width: 550px) {
  .twelve.columns {
    width: 100%;
    margin-left: 0;
  }
}

.button-ripple {
  display: inline-block;
  .flex-box-center(column);
  overflow: hidden;
  position: relative;
  transition: background-color 0.3s linear, border 0.3s linear;
  box-shadow: 0 0 0 rgba(52, 223, 165, 0.4);
  animation: pulse 2s infinite;
  &:after {
    content: '';
    display: block;
    position: absolute;
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
    transform: scale(0);
    opacity: 0.2;
    transition: 0s;
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

.flower-container {
  position: relative;
  .unit-wrapper {
    position: absolute;
    width: 100%;
    top: 0;
    bottom: 25%;
    left: 0;
    right: 0;
    margin: auto;
    opacity: 0;
    animation-delay: 2.75s;
    animation: show-text 1s 2.5s forwards cubic-bezier(0.1, 0.95, 0.59, 1.22);
    .headline {
      position: absolute;
      top: calc(50% - 2em);
      font-size: @font-large;
      left: -10em;
      right: -10em;
      text-align: center;
      font-weight: 400;
      text-shadow: 0 0 2em @white;
    }
    .hero-description {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      font-size: @font-small;
      line-height: 40rpx;
      padding: 40rpx;
      text-align: center;
      text-shadow: 0 0 2em @white;
    }
  }
}

.flower-container {
  font-size: 18px;
  padding-bottom: 8em;
  margin: 0em 0 -6em;
  overflow: hidden;
}

.flower-container .flower {
  position: relative;
  display: block;
  height: 14em;
  width: 14em;
  margin: 5em auto 4.25em;
  font-size: 30rpx;
  transition: all 0.2s ease-out;
}

.flower-container .part {
  position: absolute;
  top: 50%;
  left: 50%;
}

.flower-container .part:nth-child(1) {
  height: 10em;
  width: 10em;
  margin: -10em 0 0;
  border-radius: 100% 0;
  background: rgba(199, 212, 227, 0.5);
  opacity: 0.6;
  transform-origin: 0 100% 0;
  background-color: rgba(199, 212, 227, 0.5) !important;
  opacity: 1;
  transform: rotate(0deg);
  box-shadow: 0 2.75em 4.5em rgba(0, 0, 0, 0.2);
}

.flower-container .part:nth-child(2) {
  height: 10em;
  width: 10em;
  margin: -10em 0 0;
  border-radius: 100% 0;
  background: rgba(199, 212, 227, 0.5);
  opacity: 0.6;
  transform-origin: 0 100% 0;
  background-color: rgba(199, 212, 227, 0.5) !important;
  opacity: 1;
  transform: rotate(90deg);
  box-shadow: 2.75em 0 4.5em rgba(0, 0, 0, 0.2);
}

.flower-container .part:nth-child(3) {
  height: 10em;
  width: 10em;
  margin: -10em 0 0;
  border-radius: 100% 0;
  background: rgba(199, 212, 227, 0.5);
  opacity: 0.6;
  transform-origin: 0 100% 0;
  background-color: rgba(199, 212, 227, 0.5) !important;
  opacity: 1;
  transform: rotate(180deg);
  box-shadow: 0 -2.75em 4.5em rgba(0, 0, 0, 0.2);
}

.flower-container .part:nth-child(4) {
  height: 10em;
  width: 10em;
  margin: -10em 0 0;
  border-radius: 100% 0;
  background: rgba(199, 212, 227, 0.5);
  opacity: 0.6;
  transform-origin: 0 100% 0;
  background-color: rgba(199, 212, 227, 0.5) !important;
  opacity: 1;
  transform: rotate(270deg);
  box-shadow: -2.75em 0 4.5em rgba(0, 0, 0, 0.2);
}

.flower-container .part:nth-child(5) {
  background: rgba(121, 103, 158, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  height: 6em;
  width: 6em;
  opacity: 0.7;
  border-radius: 100% 0;
  margin-top: -6em;
  margin-left: 0em;
  transform-origin: 0 100% 0;
  background-color: rgba(121, 103, 158, 0.5) !important;
  transform: rotate(0deg);
}

.flower-container .part:nth-child(6) {
  background: rgba(121, 103, 158, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  height: 6em;
  width: 6em;
  opacity: 0.7;
  border-radius: 100% 0;
  margin-top: -6em;
  margin-left: 0em;
  transform-origin: 0 100% 0;
  background-color: rgba(121, 103, 158, 0.5) !important;
  transform: rotate(45deg);
}

.flower-container .part:nth-child(7) {
  background: rgba(121, 103, 158, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  height: 6em;
  width: 6em;
  opacity: 0.7;
  border-radius: 100% 0;
  margin-top: -6em;
  margin-left: 0em;
  transform-origin: 0 100% 0;
  background-color: rgba(121, 103, 158, 0.5) !important;
  transform: rotate(90deg);
}

.flower-container .part:nth-child(8) {
  background: rgba(121, 103, 158, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  height: 6em;
  width: 6em;
  opacity: 0.7;
  border-radius: 100% 0;
  margin-top: -6em;
  margin-left: 0em;
  transform-origin: 0 100% 0;
  background-color: rgba(121, 103, 158, 0.5) !important;
  transform: rotate(135deg);
}

.flower-container .part:nth-child(9) {
  background: rgba(121, 103, 158, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  height: 6em;
  width: 6em;
  opacity: 0.7;
  border-radius: 100% 0;
  margin-top: -6em;
  margin-left: 0em;
  transform-origin: 0 100% 0;
  background-color: rgba(121, 103, 158, 0.5) !important;
  transform: rotate(180deg);
}

.flower-container .part:nth-child(10) {
  background: rgba(121, 103, 158, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  height: 6em;
  width: 6em;
  opacity: 0.7;
  border-radius: 100% 0;
  margin-top: -6em;
  margin-left: 0em;
  transform-origin: 0 100% 0;
  background-color: rgba(121, 103, 158, 0.5) !important;
  transform: rotate(225deg);
}

.flower-container .part:nth-child(11) {
  background: rgba(121, 103, 158, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  height: 6em;
  width: 6em;
  opacity: 0.7;
  border-radius: 100% 0;
  margin-top: -6em;
  margin-left: 0em;
  transform-origin: 0 100% 0;
  background-color: rgba(121, 103, 158, 0.5) !important;
  transform: rotate(270deg);
}

.flower-container .part:nth-child(12) {
  background: rgba(121, 103, 158, 0.5);
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  height: 6em;
  width: 6em;
  opacity: 0.7;
  border-radius: 100% 0;
  margin-top: -6em;
  margin-left: 0em;
  transform-origin: 0 100% 0;
  background-color: rgba(121, 103, 158, 0.5) !important;
  transform: rotate(315deg);
}

.cssanimations .flower-container .part {
  opacity: 0;
  animation: linear forwards 2s;
}

.cssanimations .part:nth-child(1) {
  animation-name: show-large-leaf;
  animation-delay: 0.5s;
}

.cssanimations .part:nth-child(2) {
  animation-name: show-large-leaf;
  animation-delay: 1s;
}

.cssanimations .part:nth-child(3) {
  animation-name: show-large-leaf;
  animation-delay: 1.5s;
}

.cssanimations .part:nth-child(4) {
  animation-name: show-large-leaf;
  animation-delay: 2s;
}

.cssanimations .part:nth-child(5) {
  animation-name: show-small-leaf;
  animation-delay: 0.25s;
}

.cssanimations .part:nth-child(6) {
  animation-name: show-small-leaf;
  animation-delay: 0.5s;
}

.cssanimations .part:nth-child(7) {
  animation-name: show-small-leaf;
  animation-delay: 0.75s;
}

.cssanimations .part:nth-child(8) {
  animation-name: show-small-leaf;
  animation-delay: 1s;
}

.cssanimations .part:nth-child(9) {
  animation-name: show-small-leaf;
  animation-delay: 1.25s;
}

.cssanimations .part:nth-child(10) {
  animation-name: show-small-leaf;
  animation-delay: 1.5s;
}

.cssanimations .part:nth-child(11) {
  animation-name: show-small-leaf;
  animation-delay: 1.75s;
}

.cssanimations .part:nth-child(12) {
  animation-name: show-small-leaf;
  animation-delay: 2s;
}

@keyframes show-large-leaf {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes show-small-leaf {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.7;
  }
}

@keyframes show-text {
  0% {
    opacity: 0;
    transform: translateY(1em);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.fade-in {
  animation-name: fade-in;
}
.animated {
  animation-duration: 1s;
  animation-fill-mode: both;
  visibility: visible;
  animation-name: fade-in;
}

.animated.infinite {
  animation-iteration-count: infinite;
}
.animated.hinge {
  animation-duration: 6s;
}
</style>

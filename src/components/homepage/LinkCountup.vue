<template>
  <div class="countup-area">
    <h2 class="medium-font">已经收录优质网站个数</h2>
    <div class="countup">{{ totalLinksCount }}</div>
  </div>
</template>

<script>
import { $apis } from 'helper'

export default {
  name: 'LinkCountup',

  data () {
    return {
      totalLinksCount: 0
    }
  },

  components: {
  },

  created () {
    let params = { active: true }
    $apis.getAllLinksCount(params).then(result => {
      this.totalLinksCount = result
    }).catch((error) => {
      this.totalLinksCount = 99
      console.log(error)
    })
  },

  methods: {
  }
}
</script>

<style lang="less">
@import "./../../assets/less/variables.less";
@import './../../assets/less/mixins.less';


.countup-area{
  position: relative;
  width: 100%;
  height: 500rpx;
  .flex-box-center(column);
  color: @black;
  background: @white-grey;
  background: -webkit-linear-gradient(to top, @white-grey, #eef2f3);
  background: linear-gradient(to top, @white-grey, #eef2f3);
  .countup{
    font-size: 100rpx;
    font-weight: 400;
    background: #212121;
    -webkit-background-clip:text;
    -moz-background-clip: text;
    background-clip:text;
    color: transparent;
    text-shadow: 0 3px 3px rgba(255,255,255,0.5);
  }
}
</style>

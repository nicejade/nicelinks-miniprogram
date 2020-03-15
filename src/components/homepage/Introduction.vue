<template>
  <section>
    <article class="introduction">
      <h2 class="medium-font">探索更广阔的世界，为您</h2>
      <p class="desc">在这个信息化的世界，海量的讯息可能让您不知所措；担心错过她而努力汲取的同时，却可能错过更多；<br>「倾城之链」，的存在，即是为您解决这种困扰；在这里，您可以浏览全球各类智慧的结晶；<br>丰富视野的同时，可以标注抑或分享您喜欢的站点，从而为更多挖掘讯息的人提供建设性参考。</p>
    </article>
    <article class="introduction share-more">
      <h2 class="medium-font">分享，为您所欢喜的网站</h2>
      <p class="desc">在当今这信息化时代，即便是再小的个体，也当有自己的品牌。然而，独立的才是自己的。<br>「倾城之链」，作为一个开放平台，鼓励您创造属于您的个人品牌，烙印着自己的风格，替自己代言、发声。<br>如果您已经这样做了，您可以尽情分享在这里，让更多人知道，且从中受益。<br>当然，您也可以分享出您欢喜的其他有意思站点，让您的见识惠及更多人。</p>
    </article>
  </section>
</template>

<script>
export default {
  name: 'Introduction',

  data () {
    return {
    }
  },

  components: {
  },

  created () {
  },

  methods: {
  }
}
</script>

<style lang="less">
@import "./../../assets/less/variables.less";
@import './../../assets/less/mixins.less';

.introduction{
  width: 100%;
  height: @section-height;
  .flex-box-center(column);
  color: @white;
  background-color: @black;
  .desc{
    margin-top: 40rpx;
    padding: 40rpx;
    font-size: @font-small;
    text-align: left;
    line-height: 50rpx;
    br{
      content: "";
      display: block;
      margin: 15rpx 0;
    }
  }
}

.share-more{
  color: @black;
  background-color: @white;
  mark{
    background-color: @white;
  }
}
</style>

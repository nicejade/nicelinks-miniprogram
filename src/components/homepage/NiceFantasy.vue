<template>
  <section class="nice-fantasy">
    <img :src="niceImageSrc">
  </section>
</template>

<script>
import $util from 'helper/util'

export default {
  name: 'NiceFantasy',

  data () {
    return {
      isMobile: true
    }
  },

  computed: {
    niceImageSrc () {
      const primaryPath = `//image.nicelinks.site/jpg/nice-links-@#.jpg`
      const randomNum = $util.getRandomInt(0, 49)
      const thePathKey = $util.specifiedPadding(randomNum, 3, '0')
      const smallScreenParam = '?imageView2/1/w/640/h/360/interlace/1/ignore-error/1'
      const resultPath = primaryPath.replace('@#', thePathKey)
      return this.isMobile ? resultPath + smallScreenParam : resultPath
    }
  },

  components: {
  },

  created () {
  },

  methods: {
  },

  locales: {
  }
}
</script>

<style lang="less">
@import "./../../assets/less/variables.less";
@import './../../assets/less/mixins.less';

.nice-fantasy{
  position: relative;
  background-color: @black;
  &:before{
    content: '';
    position: absolute;
    display: block;
    width: 100%;
    height: 50%;
    top: 0;
    left: 0;
    background-color: @white;
    margin-top: -1px;
  }
  img{
    position: relative;
    display: block;
    width: 90%;
    max-width: 100%;
    margin: 0 auto;
    border-radius: 3px;
  }
}
</style>

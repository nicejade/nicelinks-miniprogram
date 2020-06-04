<template>
  <div class="wrapper">
    <!-- <search class="mobile-search" v-if="$isMobileScreen()" /> -->
    <HomeLotus></HomeLotus>
    <NiceFantasy></NiceFantasy>
    <Introduction></Introduction>
    <LinkCountup></LinkCountup>
    <ad unit-id="adunit-b6ffe4fde404d329" ad-type="video" ad-theme="white"></ad>
  </div>
</template>

<script>
import HomeLotus from 'components/homepage/HomeLotus'
import NiceFantasy from 'components/homepage/NiceFantasy'
import Introduction from 'components/homepage/Introduction'
import LinkCountup from 'components/homepage/LinkCountup'

export default {
  name: 'Index',

  data() {
    return {
      title: ''
    }
  },

  components: {
    HomeLotus,
    NiceFantasy,
    Introduction,
    LinkCountup
  },

  beforeCreate() {},

  created() {
    wx.showShareMenu({
      withShareTicket: true
    })
  },

  mounted() {},

  methods: {}
}
</script>

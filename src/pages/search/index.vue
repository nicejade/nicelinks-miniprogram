<template>
  <div class="wrapper">
    <searchbar
      :isFocus="true"
      v-model="inputValue"
      placeholder="搜您想要"
      confirmType="搜索"
      @input="onInputEvent"
      @blur="onBlurEvent"
      @focus="onFocusEvent"
      @confirm="onConfirmEvent"
    ></searchbar>
    <div class="result-list" v-if="isShowResult">
      <block v-for="(item, index) in niceLinksArr" :key="index">
        <div class="item" @click.stop="onItemClick(item)">{{ item.title }}</div>
      </block>
    </div>
    <div class="deault-list" v-else>
      <text class="title">众人在搜</text>
      <div class="recommand-list">
        <block v-for="(item, index) in recommendedSearchArr" :key="index">
          <div class="item" @click.stop="onRecommendClick(item)">{{ item }}</div>
        </block>
      </div>
      <div v-if="historySearchArr.length > 0">
        <text class="title">搜索历史</text>
        <div class="history-list">
          <block v-for="(item, index) in historySearchArr" :key="index">
            <div class="item">
              <icon color="#c2c2c2" class="search-icon" type="waiting" size="14"></icon>
              <text class="content" @click="onRecommendClick(item)">{{ item }}</text>
              <icon color="#c2c2c2" class="search-icon" @click="onDeleteClick(index)" type="clear" size="14"></icon>
            </div>
          </block>
        </div>
        <div class="clear-history">
          <text class="clear" @click="onClearClick">清除搜索历史</text>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $config from "config";
import { $apis, $util } from "helper";
import searchbar from "mpvue-weui/src/searchbar";
const historyStorageKey = "SEARCH_HISTORY";

export default {
  name: "Search",

  data() {
    return {
      isLoading: false,
      isShowResult: false,
      themeList: $config.theme,
      niceLinksArr: [],
      recommendedSearchArr: [
        "程序员",
        "开发",
        "个人博客",
        "工具",
        "图片",
        "科技",
        "资源",
        "平台",
        "思维导图",
        "新闻",
        "在线",
        "视频",
        "分享",
        "倾城之链"
      ],
      historySearchArr: [],
      util: $util,
      inputValue: ""
    };
  },

  components: {
    searchbar
  },

  watch: {
    isLoading: function(val) {
      val
        ? wx.showLoading({
            title: "请求获取数据中"
          })
        : wx.hideLoading();
    }
  },

  onShareAppMessage(res) {
    return {
      title: "倾城之链 | 探索美好"
    };
  },

  created() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  onLoad() {
    wx.getSystemInfo({
      success: res => {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        this.winHeight = clientHeight * rpxR - 80;
      }
    });
    this.historySearchArr = wx.getStorageSync(historyStorageKey) || [];
  },

  onShow() {
    this.isShowResult = false;
    this.inputValue = "";
    this.niceLinksArr = [];
  },

  methods: {
    searchLinkList() {
      if (!this.inputValue || this.inputValue.trim() === "") {
        return;
      }
      const params = {
        keyword: this.inputValue
      };
      this.isLoading = true;
      $apis
        .searchNiceLinks(params)
        .then(result => {
          if (result && result.length) {
            this.isShowResult = true;
            return (this.niceLinksArr = result);
          }
          // this.niceLinksArr = this.randomLinkList;
        })
        .catch(error => {
          this.$message.error(`SomeThing Error: ${error.message}`);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    updateHistory() {
      if (this.inputValue && !this.historySearchArr.includes(this.inputValue)) {
        this.historySearchArr.unshift(this.inputValue);
        wx.setStorageSync(historyStorageKey, this.historySearchArr);
      }
    },
    // ------------------OnEventCallBack------------------
    onItemClick(item) {
      wx.navigateTo({
        url: `/pages/post/main?id=${item._id}`
      });
    },
    onRecommendClick(item) {
      this.inputValue = item;
      this.searchLinkList();
      this.updateHistory()
    },
    onDeleteClick(index) {
      this.historySearchArr.splice(index, 1)
      wx.setStorageSync(historyStorageKey, this.historySearchArr)
    },
    onClearClick() {
      this.historySearchArr = []
      wx.setStorageSync(historyStorageKey, this.historySearchArr)
    },
    onInputEvent() {
      this.searchLinkList();
    },
    onBlurEvent() {},
    onFocusEvent() {},
    onConfirmEvent() {
      this.updateHistory()
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import "../../assets/less/variables.less";
@import "../../assets/less/mixins.less";
.result-list {
  padding: 2 * @size-factor;
  .item {
    font-size: 3 * @size-factor;
    color: @silver-grey;
    border-bottom: 1px solid @border-grey;
    padding: @size-factor 0;
    .text-overflow();
  }
}
.deault-list {
  padding: 0 2 * @size-factor;
  .title {
    display: block;
    color: @black-grey;
    margin-top: 2 * @size-factor;
    font-size: 3 * @size-factor;
  }
  .recommand-list {
    .item {
      display: inline-block;
      font-size: 3 * @size-factor;
      color: @silver-grey;
      border-bottom: 1px solid @border-grey;
      border-radius: @size-factor;
      padding: 0.3 * @size-factor 1.2 * @size-factor;
      background-color: #fafafa;
    }
    .item + .item {
      margin-left: @size-factor;
    }
  }
  .history-list {
    .item {
      .flex-box-center(row, space-around, center);
      font-size: 3 * @size-factor;
      color: @silver-grey;
      border-bottom: 1px solid @border-grey;
      padding: 1 * @size-factor 1.2 * @size-factor;
      .content {
        text-indent: 4 * @size-factor;
        width: calc(100% - 6 * @size-factor);
      }
    }
  }
  .clear-history{
    .flex-box-center(row, center, center);
    .clear{
      font-size: 3 * @size-factor;
      margin-top: @size-factor;
      color: @silver-grey;
    }
  }
}
</style>

<template>
  <div class="wrapper" id="nice-links">
    <div class="top-searchbar">
      <icon class="search-icon" type="search" size="14"></icon>
      <input type="text"
        class="search-btn"
        placeholder="搜您想要"
        @click="onInputClick">
      </input>
    </div>
    <div class="top-tab-area">
      <div
        @click="onTopTabItemClick(index)"
        class="tab-item"
        v-for="(item, index) in exploreTypeObj"
        :class="currentTopTabIdx === index ? 'active' : ''"
        :key="index"
      >
        <div class="text">{{ item }}</div>
        <div v-if="currentTopTabIdx === index" class="underline"></div>
      </div>
    </div>
    <swiper
      @change="onSwiperChange"
      class="tab-content"
      :current="currentTopTabIdx"
      duration="300"
      :style="{height: winHeight + 'rpx'}"
    >
      <block v-for="(eitem, key) in exploreTypeObj" :key="key">
        <swiper-item>
          <scroll-view @scrolltolower="onScrollToLower" :scroll-y="true" class="scroll-h">
            <block v-for="(item, index) in niceLinksArray[key]" :key="index">
              <div style="margin-bottom: 30rpx;"
                v-if="index !== 0 && index % 5 === 0">
                <ad unit-id="adunit-70ae2fde86f2c5a1"></ad>
              </div>
              <div class="content" @click="onContentClick(item)">
                <h3 class="title" @click.stop="onTitleClick(item)">{{ item.title }}</h3>
                <div class="theme-tags">
                  <div class="theme">{{ item.fixtheme }}</div>
                  <div class="dot">·</div>
                  <div class="tag" v-for="(tag, idx) in item.tags" :key="idx">{{ tag }}</div>
                </div>
                <text class="review" selectable="true">{{ item.review }}</text>
                <div class="vertical-line"></div>
                <div class="operate-area">
                  <text class="separator">{{ item.likes }} 赞同</text>
                  <div class="dot">·</div>
                  <div class="created-info">于 {{ item.created }}</div>
                </div>
              </div>
            </block>
          </scroll-view>
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script>
import $config from "config";
import { $apis, $util } from "helper";
import { mapMutations } from "vuex";

export default {
  name: "NiceLinks",

  data() {
    return {
      pageCount: 0,
      pageSize: 12,
      isLoading: false,
      themeList: $config.theme,
      niceLinksArray: [],
      util: $util,
      currentTabIndex: 0,
      currentTopTabIdx: 0,
      winHeight: 100,
      exploreTypeObj: ["全部", "技术", "资源", "人生", "信息"],
      inputValue: ""
    };
  },

  components: {},

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

  onLoad: function() {
    wx.getSystemInfo({
      success: res => {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        this.winHeight = clientHeight * rpxR - 80;
      }
    });
  },

  mounted() {
    const targetRequestObj = this.getCurrentRoute(this.currentTabIndex);
    this.niceLinksArray.forEach((_, index) => {
      this.niceLinksArray[index] = [];
    });
    this.requestAndUpdateListData(targetRequestObj, false);

    this.updatePageTitle();
  },

  /*
  onTabItemTap(item) {
    if (this.currentTabIndex === item.index) return;
    this.currentTabIndex = item.index;
    const targetRequestObj = this.getCurrentRoute(item.index);
    this.niceLinksArray.forEach((_, index) => {
      this.niceLinksArray[index] = [];
    });
    this.requestAndUpdateListData(targetRequestObj, false);
  },*/

  methods: {
    ...mapMutations(["$setRequestParamList"]),

    onInputClick() {
      wx.navigateTo({
        url: `/pages/search/main`
      });
    },

    updatePageTitle() {
      wx.setNavigationBarTitle({
        title: "探索美好"
      });
    },

    fillThemeName(classify, theme) {
      let result = "-";
      this.themeList[classify].map(item => {
        if (item.value === theme) {
          result = item.key;
        }
      });
      return result;
    },

    getCurrentRoute(index) {
      const routeMapping = ["hottest", "latest", "earliest", "random"];
      const targetRoute = routeMapping[index];
      const sortTargetMapping = {
        hottest: {
          sortTarget: "likes",
          sortType: -1,
          ptype: "hottest"
        },
        latest: {
          sortTarget: "created",
          sortType: -1,
          ptype: "latest"
        },
        earliest: {
          sortTarget: "created",
          sortType: 1,
          ptype: "earliest"
        },
        random: {
          ptype: "random"
        }
      };
      return sortTargetMapping[targetRoute];
    },

    setFetchParamObj(target) {
      const params = {
        ...this.$store.state.requestParamList,
        pageCount: this.pageCount,
        pageSize: this.pageSize
      };
      this.$setRequestParamList(Object.assign({}, params, target));
    },

    requestAndUpdateListData(target = {}, isLoadMore = false) {
      if (this.isLoading) return;
      this.isLoading = true;
      this.pageCount = isLoadMore ? this.pageCount + 1 : 1;

      this.setFetchParamObj(target);
      const isRandom = target.ptype === "random";
      const request = isRandom ? $apis.getRandomLinks : $apis.getNiceLinks;
      request(this.$store.state.requestParamList)
        .then(result => {
          if (Array.isArray(result)) {
            result.forEach(item => {
              const reviewHtml = $util.parseMarkdown(item.review) || item.desc;
              // 去掉 String 的所有的 html 标记
              item.review = reviewHtml.replace(/<[^>]*>/g, "");
              item.created = $util.dateOffset(item.created);
              item.fixtheme = this.fillThemeName(item.classify, item.theme);
            });
            this.niceLinksArray[this.currentTopTabIdx] = isLoadMore
              ? this.niceLinksArray[this.currentTopTabIdx].concat(result)
              : result;
          }
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },

    parseMarkdown(mdStr) {
      return $util.parseMarkdown(mdStr);
    },

    copy2clipboard(path) {
      wx.setClipboardData({
        data: path,
        success: () => {
          wx.showToast({
            title: "已将连接拷贝至剪切板，可在浏览器端访问",
            icon: "none",
            duration: 2000
          });
        },
        fail: () => {}
      });
    },

    dealWithSwiperChange(index) {
      this.currentTopTabIdx = index;
      const currentTabContent = this.niceLinksArray[index];
      if (currentTabContent && currentTabContent.length > 0) {
        // 如果已经有部分数据，则只将页面滚动到顶部处理，以优化之；
        wx.pageScrollTo({
          scrollTop: 0,
          duration: 200
        });
      } else {
        const targetRequestObj = this.getCurrentRoute(this.currentTabIndex);
        targetRequestObj.classify = index > 0 ? `${index - 1}` : ""
        this.requestAndUpdateListData(
          targetRequestObj,
          false
        );
      }
    },

    // ------------------OnEventCallBack------------------

    onTitleClick(item) {
      const path = `${item.urlPath}?utm_source=nicelinks.site`;
      this.copy2clipboard(path);
    },

    onContentClick(item) {
      wx.navigateTo({
        url: `/pages/post/main?id=${item._id}&createdBy=${item.createdBy}`
      });
    },

    onTopTabItemClick(index) {
      if (this.currentTopTabIdx === index) return;
      this.dealWithSwiperChange(index);
    },

    onSwiperChange(event) {
      this.dealWithSwiperChange(event.target.current);
    },

    onScrollToLower() {
      this.requestAndUpdateListData({}, true);
    }
  }
};
</script>

<style type="text/css" lang="less" scoped>
@import "../../assets/less/list.less";
</style>

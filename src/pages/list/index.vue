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
                <div class="operate-area">
                  <div plain class="action-icon" @click="onLikeClick">
                    <div class="like-icon"></div>
                    <text class="separator">{{ item.likes }}</text>
                  </div>
                  <div class="created-info">
                    由
                    <span class="creater">{{ item.createdBy || '' }}</span>
                    分享于 {{ item.created }}
                  </div>
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
        url: `/pages/post/main?id=${item._id}`
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
@import "../../assets/less/variables.less";
@import "../../assets/less/mixins.less";

.wrapper {
  .tab-content {
    width: 100%;
    position: absolute;
    top: 16 * @size-factor;
    .scroll-h {
      height: 100%;
    }
  }
}

.content {
  background-color: #fff;
  box-shadow: 0 0 12px 2px rgba(0, 0, 0, 0.1);
  margin-bottom: 30rpx;
  padding: 20rpx 30rpx;
  .title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: @font-medium;
    font-weight: 600;
    line-height: 1.2;
    text-decoration: none;
    color: @link-title;
    transition: color 0.3s ease-in;
    &:hover {
      transition: color 0.3s ease-out;
      color: @link-title-hover;
    }
  }
  .theme-tags {
    margin-top: @size-factor;
    font-size: @font-small;
    .theme {
      display: inline-block;
      color: @brand;
    }
    .dot {
      display: inline-block;
      margin: @size-factor;
      color: @brand;
    }
    .tag {
      display: inline-block;
      color: @silver-grey;
    }
    .tag + .tag {
      &::before {
        content: "/";
        color: @silver-grey;
        margin: 0 0.5 * @size-factor;
      }
    }
  }
  .review {
    display: -webkit-box;
    width: 100%;
    margin: @size-factor 0;
    font-size: @font-small;
    color: @silver-grey;
    line-height: 1.5;
    letter-spacing: 2rpx;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: pre-wrap;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }
}

.operate-area {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  .action-icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 6 * @size-factor;
    border-radius: @size-factor;
    border: 1px solid @border-grey;
    margin: 0 1 * @size-factor;
    padding: 0 2 * @size-factor;
    background-size: 100%;
    background-repeat: none;
    background-position: center;
  }
  .like-icon {
    display: inline-block;
    vertical-align: middle;
    width: 5 * @size-factor;
    height: 5 * @size-factor;
    margin: 0 1 * @size-factor;
    background-size: 100%;
    background-repeat: none;
    background-position: center;
    background-image: url("data:image/png;base64,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");
  }
  .separator {
    vertical-align: middle;
  }
  .created-info {
    display: inline-block;
    font-size: @font-small;
    color: @black-grey;
  }
}

.top-searchbar{
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100%;
  height: 8 * @size-factor;
  .flex-box-center(columns, center);
  .search-icon{
    position: absolute;
    left: 5 * @size-factor;
    top: 2.66 * @size-factor;
  }
  .search-btn {
    display: block;
    width: 100%;
    height: 5.6 * @size-factor;
    line-height: 6 * @size-factor;
    margin: 0 3 * @size-factor;
    font-size: 3.3 * @size-factor;
    text-indent: 6 * @size-factor;
    border-radius: 4 * @size-factor;
    // border: 1px solid @border-grey;
    border: 1px solid #e6e6ea;
  }
}

.top-tab-area {
  .flex-box-center(row, space-around);
  width: 100%;
  height: 8 * @size-factor;
  line-height: 8 * @size-factor;
  backdrop-filter: blur(20px);
  background-color: rgba(255, 255, 255, 0.1);
  white-space: nowrap;
  box-sizing: border-box;
  position: fixed;
  top: 8 * @size-factor;
  left: 0;
  z-index: 99;
  .tab-item {
    position: relative;
    .flex-box-center(row, center);
    width: 14 * @size-factor;
    text-align: center;
    .text {
      display: inline-block;
      width: 100%;
    }
    .underline {
      position: absolute;
      top: 0;
      height: calc(100% - 5rpx);
      width: 10 * @size-factor;
      border-bottom: 5rpx solid @brand;
    }
  }
  .active {
    color: @brand;
  }
}
</style>

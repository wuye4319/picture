<template>
  <view>
    <view style="background: white; z-index: 999">
      <scroll-view
        scroll-x
        class="bg-white nav"
        scroll-with-animation
        :scroll-left="scrollLefts"
      >
        <view
          class="cu-item"
          v-for="(item, indexs) in category"
          :class="indexs == TabCurs ? 'text-green cur' : ''"
          :key="'nav' + indexs"
          :data-id="indexs"
          @tap="typeSelect"
        >
          <text :class="indexs == TabCurs ? 'nav-text-active' : 'nav-text'">
            {{ item.name }}
          </text>
        </view>
      </scroll-view>
    </view>
    <view class="hot-index">
      <block v-for="(item, index) in lists" :key="index">
        <view class="card card-list2" @click="goDetail(lists, index)">
          <image
            class="card-img card-list2-img"
            mode="aspectFill"
            :src="domain(item.url)"
          ></image>
          <!-- <view class="card-bottm row">
          <view class="car-title-view row">
            <text class="card-title card-list2-title">{{
              item.topicName
            }}</text>
          </view>
        </view> -->
        </view>
      </block>
      <text class="loadMore">{{ loadTips || loadTips2 }}</text>
    </view>
  </view>
</template>

<script>
import { domain } from '../../common/config'

export default {
  data() {
    return {
      refreshing: false,
      scrollLefts: 0,
      TabCurs: 0,
      category: [],
      lists: [],
      loadTips: '加载中...',
      loadTips2: '没有更多了...',
      fetchPageNum: 1,
      id: '11001',
      pageSize: 10
    }
  },
  onLoad() {
    this.getData()
    this.getTypesInfor()
    uni.getProvider({
      service: 'share',
      success: (e) => {
        let data = []
        for (let i = 0; i < e.provider.length; i++) {
          switch (e.provider[i]) {
            case 'weixin':
              data.push({
                name: '分享到微信好友',
                id: 'weixin'
              })
              data.push({
                name: '分享到微信朋友圈',
                id: 'weixin',
                type: 'WXSenceTimeline'
              })
              break
            case 'qq':
              data.push({
                name: '分享到QQ',
                id: 'qq'
              })
              break
            default:
              break
          }
        }
        this.providerList = data
      },
      fail: (e) => {
        console.log('获取登录通道失败', e)
      }
    })
  },
  onPullDownRefresh() {
    console.log('下拉刷新')
    this.refreshing = true
    this.getData()
  },
  onReachBottom() {
    if (this.loadTips) {
      this.getData()
    } else {
      console.log(this.loadTips2)
    }
  },
  methods: {
    typeSelect(e) {
      this.TabCurs = e.currentTarget.dataset.id
      this.id = this.category[e.currentTarget.dataset.id].typeID
      this.scrollLefts = (e.currentTarget.dataset.id - 1) * 60
      this.fetchPageNum = 1
      uni.showLoading({
        title: '加载中...'
      })
      //#ifdef H5
      uni.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
      //#endif
      this.lists = []
      this.getData()
    },
    getTypesInfor() {
      this.$Request.get(`/picture/types-infor/`).then((res) => {
        if (res.status === 200) {
          this.category = res.data
          console.log(res.data)
        } else {
          console.log('请求失败:', res)
        }
      })
    },
    getData() {
      this.$Request
        .get(
          `/picture/list-type/${this.refreshing ? 1 : this.fetchPageNum}/${
            this.pageSize
          }/${this.id}`
        )
        .then((res) => {
          if (res.status === 200) {
            if (this.refreshing) {
              this.refreshing = false
              uni.stopPullDownRefresh()
              this.lists = res.data
              this.fetchPageNum = 2
            } else {
              this.lists = this.lists.concat(res.data)
              this.fetchPageNum += 1
            }
            this.lists.forEach((item) => {
              if (item.urlList) {
                item.urlList = JSON.parse(item.urlList)
              }
            })
            if ((this.fetchPageNum - 1) * this.pageSize > res.total) {
              this.loadTips = false
            } else {
              this.loadTips = '加载中...'
            }
          } else {
            console.log('请求失败:', res)
          }
          uni.hideLoading()
        })
    },
    domain(url) {
      if (url.indexOf('http') === -1) {
        return domain + url
      } else {
        return url
      }
    },
    goDetail(e, index) {
      this.$queue.setData('picture-detail', e)
      uni.navigateTo({
        url: '../detail/detail?index=' + index
      })
    }
  }
}
</script>

<style lang='scss'>
.nav {
  position: fixed;
  z-index: 100;
  width: 100%;
  text-align: center;
  border-bottom: 1px solid ghostwhite;
}
.nav-text-active {
  background: #fc3f78;
  color: white;
  padding: 2px 10px 2px 10px;
  border-radius: 16px;
  margin-right: -10px;
}
.nav-text {
  background: #ffffff;
  color: #333333;
  margin-right: -10px;
}
.hot-index {
  flex: 1;
  display: inline-block;
  width: 750upx;
  margin-top: 100upx;
  min-height: 100vh;
  justify-content: space-between;
  align-items: center;
  padding: 1%;
  .card {
    display: inline-block;
  }
  .card-list2 {
    width: 31.3333%;
    margin: 20upx 1%;
    height: 500upx;
    .card-list2-img {
      height: 500upx;
    }
  }
  .loadMore {
    width: 100%;
    text-align: center;
    display: inline-block;
  }
}
</style>

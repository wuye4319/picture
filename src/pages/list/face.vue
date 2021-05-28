<template>
  <view class="hot-index">
    <block v-for="(item, index) in lists" :key="index">
      <view class="card card-list2" @click="goDetail(item)">
        <image
          class="card-img card-list2-img"
          mode="aspectFill"
          :src="domain(item.url)"
        ></image>
        <!-- <text class="card-num-view card-list2-num-view">
          {{ lists.length }}P
        </text> -->
      </view>
    </block>
    <text class="loadMore">{{ loadTips || loadTips2 }}</text>
  </view>
</template>

<script>
import { domain } from "../../common/config";

export default {
  data() {
    return {
      refreshing: false,
      lists: [],
      loadTips: '加载中...',
      loadTips2: '没有更多了...',
      fetchPageNum: 1,
      pageSize: 10
    }
  },
  onLoad() {
    this.getData()
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
    getData() {
      this.$Request
        .get(
          `/picture/list-type/${this.refreshing ? 1 : this.fetchPageNum}/${
            this.pageSize
          }/9000/`
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
    goDetail(e) {
      this.$queue.setData('picture-detail', e)
      uni.navigateTo({
        url: '../detail/detail?data=' + encodeURIComponent(JSON.stringify(e))
      })
    }
  }
}
</script>

<style lang='scss'>
.hot-index {
  flex: 1;
  display: inline-block;
  width: 750upx;
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
    height: 300upx;
    .card-list2-img {
      height: 300upx;
    }
  }
  .loadMore {
    width: 100%;
    text-align: center;
    display: inline-block;
  }
}
</style>

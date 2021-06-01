<template>
  <view class="index">
    <block v-for="(item, index) in list" :key="index">
      <view class="card" @click="goDetail(list, index)">
        <image class="card-img" :src="domain(item.url)" mode="widthFix"></image>
        <!-- <text class="card-num-view"
          >{{ list.length }}P</text
        > -->
        <view class="card-bottm row">
          <view @click.stop="share(item)" class="card-share-view"></view>
        </view>
      </view>
    </block>
    <text class="loadMore">{{ loadTips || loadTips2 }}</text>
  </view>
</template>

<script>
import { domain } from '../../common/config'

export default {
  data() {
    return {
      refreshing: false,
      providerList: [],
      list: [],
      loadTips: '加载中...',
      loadTips2: '没有更多了...',
      pageSize: 10,
      fetchPageNum: 1
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
  onReachBottom() {
    if (this.loadTips) {
      this.getData()
    } else {
      console.log(this.loadTips2)
    }
  },
  onPullDownRefresh() {
    console.log('下拉刷新')
    this.refreshing = true
    this.getData()
  },
  methods: {
    getData() {
      this.$Request
        .get(
          `/picture/list-type/${this.refreshing ? 1 : this.fetchPageNum}/${
            this.pageSize
          }/10000/`
        )
        .then((res) => {
          if (res.status === 200) {
            if (this.refreshing) {
              this.refreshing = false
              uni.stopPullDownRefresh()
              this.list = res.data
              this.fetchPageNum = 2
            } else {
              this.list = this.list.concat(res.data)
              this.fetchPageNum += 1
            }
            this.list.forEach((item) => {
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
    },
    share(e) {
      if (this.providerList.length === 0) {
        uni.showModal({
          title: '当前环境无分享渠道!',
          showCancel: false
        })
        return
      }
      let itemList = this.providerList.map(function (value) {
        return value.name
      })
      uni.showActionSheet({
        itemList: itemList,
        success: (res) => {
          uni.share({
            provider: this.providerList[res.tapIndex].id,
            scene:
              this.providerList[res.tapIndex].type &&
              this.providerList[res.tapIndex].type === 'WXSenceTimeline'
                ? 'WXSenceTimeline'
                : 'WXSceneSession',
            type: 0,
            title: 'uni-app模版',
            summary: e.title,
            imageUrl: e.img_src,
            href: 'https://uniapp.dcloud.io',
            success: (res) => {
              console.log('success:' + JSON.stringify(res))
            },
            fail: (e) => {
              uni.showModal({
                content: e.errMsg,
                showCancel: false
              })
            }
          })
        }
      })
    }
  }
}
</script>

<style>
</style>

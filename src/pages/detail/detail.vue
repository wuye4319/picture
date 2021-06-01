<template>
  <view class="index">
    <!-- 自定义标题栏 -->
    <view
      class="title-w"
      :style="{ top: titleHeight.statusBarHeight + 5 + 'px' }"
    >
      <view class="title-img" @tap="tarBlack()">
        <image
          class="fengrui-img"
          src="../../static/tarblack.png"
          mode=""
        ></image>
      </view>
      <view class="title-h">{{ imgIndex }}</view>
    </view>
    <swiper
      @change="swpierChange"
      :current="pageIndex"
      :style="{ height: screenHeight + 'px' }"
    >
      <swiper-item
        v-for="(value, index) in data"
        :key="index"
        @click="preImg(index)"
      >
        <image :src="domain(value.url)" mode="widthFix"></image>
      </swiper-item>
    </swiper>
    <!-- #ifndef H5 -->
    <view class="detail-btn-view">
      <view class="download" @click="download"></view>
      <!-- #ifdef APP-PLUS -->
      <view v-if="showBtn" class="setting" @click="setting">设为壁纸</view>
      <!-- #endif -->
      <!-- <view class="collect" @click="collect"></view> -->
    </view>
    <!-- #endif -->
  </view>
</template>

<script>
import { domain } from '../../common/config'

export default {
  data() {
    return {
      imgShow: false,
      pageIndex: 0,
      showBtn: false,
      screenHeight: 0,
      imgLength: 0,
      providerList: [],
      titleHeight: [],
      imgIndex: '',
      data: []
    }
  },
  onLoad(e) {
    this.stytemInfo()
    this.pageIndex = e.index
    // #ifdef APP-PLUS
    if (plus.os.name === 'Android') {
      this.showBtn = true
    }
    // #endif
    this.data = this.$queue.getData('picture-detail')
    console.log(this.data)
    this.screenHeight = uni.getSystemInfoSync().windowHeight
    this.imgLength = this.data.length
    // uni.setNavigationBarTitle({
    //   title: parseInt(this.pageIndex) + 1 + '/' + this.imgLength
    // })
    this.imgIndex = parseInt(this.pageIndex) + 1 + '/' + this.imgLength
    // 获取分享通道
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
  onShareAppMessage() {
    return {
      title: '欢迎使用uni-app看图模板',
      path: '/pages/detail/detail?data=' + this.data,
      imageUrl: this.data[this.pageIndex]
    }
  },
  onNavigationBarButtonTap(e) {
    if (e.index === 1) {
      this.collect()
      return
    }
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
          summary: '欢迎使用uni-app模版',
          imageUrl: this.data[this.pageIndex],
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
  },
  methods: {
    // 获取系统信息
    stytemInfo: function () {
      var that = this
      uni.getSystemInfo({
        success: function (res) {
          that.titleHeight = res
          console.log(that.titleHeight)
        }
      })
    },
    // 左上角返回按钮
    tarBlack: function () {
      uni.navigateBack({
        delta: 1
      })
    },
    download() {
      uni.downloadFile({
        url: this.domain(this.data[this.pageIndex].url),
        success: (e) => {
          uni.saveImageToPhotosAlbum({
            filePath: e.tempFilePath,
            success: () => {
              uni.showToast({
                icon: 'none',
                title: '已保存到手机相册'
              })
            },
            fail: () => {
              uni.showToast({
                icon: 'none',
                title: '保存到手机相册失败'
              })
            }
          })
        },
        fail: (e) => {
          uni.showModal({
            content: '下载失败，' + e.errMsg,
            showCancel: false
          })
        }
      })
    },
    collect() {
      uni.showToast({
        icon: 'none',
        title: '点击收藏按钮'
      })
    },
    //#ifdef APP-PLUS
    setting() {
      uni.showToast({
        icon: 'none',
        title: '正在设为壁纸'
      })
      setTimeout(() => {
        var WallpaperManager = plus.android.importClass(
          'android.app.WallpaperManager'
        )
        var Main = plus.android.runtimeMainActivity()
        var wallpaperManager = WallpaperManager.getInstance(Main)
        plus.android.importClass(wallpaperManager)
        var BitmapFactory = plus.android.importClass(
          'android.graphics.BitmapFactory'
        )
        uni.downloadFile({
          url: this.data[this.pageIndex],
          success: (e) => {
            var filePath = e.tempFilePath.replace('file://', '')
            var bitmap = BitmapFactory.decodeFile(filePath)
            try {
              wallpaperManager.setBitmap(bitmap)
              uni.showToast({
                icon: 'none',
                title: '壁纸设置成功'
              })
            } catch (e) {
              uni.showToast({
                icon: 'none',
                title: '壁纸设置失败'
              })
            }
          },
          fail: () => {
            uni.showToast({
              icon: 'none',
              title: '壁纸设置失败'
            })
          }
        })
      }, 100)
    },
    //#endif
    swpierChange(e) {
      this.pageIndex = e.detail.current
      this.imgIndex = e.detail.current + 1 + '/' + this.imgLength
      // uni.setNavigationBarTitle({
      //   title: e.detail.current + 1 + '/' + this.imgLength
      // })
    },
    domain(url) {
      if (url.indexOf('http') === -1) {
        return domain + url
      } else {
        return url
      }
    },
    preImg(index) {
      if (this.imgShow) {
        //防止点击过快导致重复调用
        return
      }
      this.imgShow = true
      setTimeout(() => {
        this.imgShow = false
      }, 1000)
      setTimeout(() => {
        uni.previewImage({
          current: this.data[index].url,
          urls: this.data
        })
      }, 150)
    }
  }
}
</script>

<style>
page {
  background-color: #000;
}
.title-h {
  text-align: center;
  color: #fff;
  font-size: 12px;
  margin-left: 3px;
}
.state-h {
  background-color: red;
}
.title-w {
  display: flex;
  padding: 0upx 12upx;
  background-color: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 30upx;
  left: 0;
  position: absolute;
  width: 22%;
  height: 60upx;
  margin-left: 20upx;
  align-items: center;
  z-index: 99;
}
.title-img {
  height: 48upx;
  width: 48upx;
  overflow: hidden;
}
.fengrui-img {
  height: 100%;
  width: 100%;
}
swiper {
  flex: 1;
  width: 750upx;
  background-color: #000;
  display: flex;
  flex-direction: column;
}

swiper-item {
  display: flex;
  align-items: center;
}

image {
  width: 750upx;
  height: 1125upx;
}
</style>

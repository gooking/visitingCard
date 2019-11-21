<template>
  <div class="container">
    <canvas class="canvas" :style="canvasstyle" canvas-id="firstCanvas"></canvas>
    <button class="button" type="primary" @click="saveToMobile">保存到手机相册</button>
  </div>
</template>

<script>
import request from '@/utils/request'
import support from '@/components/support'
import imageUtil from '@/utils/image'

let ctx
export default {
  data () {
    return {
      userInfo: wx.getStorageSync('userInfo'),
      canvasstyle: '',
      cardUid: undefined,
      cardUserInfo: undefined
    }
  },
  components: {
    support
  },
  methods: {
    downLoadTouxiang () {
      let _this = this
      wx.getImageInfo({
        src: wx.getStorageSync('_haibaoimg'),
        success: (res) => {
          const imageSize = imageUtil(res.width, res.height)
          const additionHeight = 50
          const qrcodeWidth = imageSize.windowWidth / 3
          _this.canvasstyle = 'height:' + (imageSize.imageHeight + additionHeight + qrcodeWidth) + 'px'
          ctx = wx.createCanvasContext('firstCanvas')
          ctx.setFillStyle('#fff')
          ctx.fillRect(0, 0, imageSize.windowWidth, imageSize.imageHeight + additionHeight + qrcodeWidth)
          ctx.drawImage(res.path, imageSize.x, imageSize.y, imageSize.imageWidth, imageSize.imageHeight)
          // 画二维码
          const left = (imageSize.imageWidth - qrcodeWidth) / 2
          const top = imageSize.imageHeight + additionHeight / 2
          wx.getImageInfo({
            src: wx.getStorageSync('_haibaoimg_qrcode'),
            success: (res) => {
              ctx.drawImage(res.path, left, top, qrcodeWidth, qrcodeWidth)
              setTimeout(function () {
                wx.hideLoading()
                ctx.draw()
              }, 1000)
            }
          })
        }
      })
    },
    saveToMobile () {
      wx.canvasToTempFilePath({
        canvasId: 'firstCanvas',
        success: function (res) {
          let tempFilePath = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: tempFilePath,
            success: (res) => {
              wx.showModal({
                content: '名片海报已保存到手机相册',
                showCancel: false,
                confirmText: '知道了',
                confirmColor: '#333'
              })
            },
            fail: (res) => {
              wx.showToast({
                title: res.errMsg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      })
    },
    fetchFriendInfo (uid) {
      let _this = this
      request({
        url: '/user/friend/detail',
        method: 'get',
        data: {
          token: _this.userInfo.token,
          uid: uid
        }
      }).then(res => {
        if (res.code === 0) {
          _this.cardUserInfo = res.data
          _this.downLoadTouxiang()
        }
      })
    }
  },
  onLoad (e) {
    if (e && e.cardUid) {
      this.cardUid = e.cardUid
    }
  },
  onShow () {
    // 调用应用实例的方法获取全局数据
    wx.showLoading({
      title: ''
    })
    this.downLoadTouxiang()
  }
}
</script>

<style scoped>
.canvas {
  width:750rpx;
}
.button {
  width: 700rpx;
  margin-top: 30rpx;
  margin-bottom: 30rpx;
}
</style>

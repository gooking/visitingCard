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
        src: this.cardUserInfo.base.avatarUrl,
        success: (res) => {
          let imageSize = imageUtil(res.width, res.height)
          const additionHeight = 300
          _this.canvasstyle = 'height:' + (imageSize.imageHeight + additionHeight) + 'px'
          ctx = wx.createCanvasContext('firstCanvas')
          ctx.setFillStyle('#fff')
          ctx.fillRect(0, 0, imageSize.windowWidth, imageSize.imageHeight + additionHeight)
          ctx.drawImage(res.path, imageSize.x, imageSize.y, imageSize.imageWidth, imageSize.imageHeight)

          ctx.setFontSize(24)
          ctx.setFillStyle('#555555')
          ctx.setTextAlign('left')
          let name = _this.cardUserInfo.base.nick
          ctx.fillText(name, 10, imageSize.imageHeight + 50)

          ctx.setFontSize(14)
          ctx.fillText(_this.cardUserInfo.ext['职位'], name.length * 30, imageSize.imageHeight + 50)

          ctx.setFontSize(14)
          ctx.fillText(process.env.APP_NAME, 10, imageSize.imageHeight + 80)

          ctx.moveTo(10, imageSize.imageHeight + 90)
          ctx.setLineWidth(1)
          ctx.lineTo(imageSize.windowWidth - 10, imageSize.imageHeight + 90)
          ctx.setStrokeStyle('#eee')
          ctx.stroke()

          _this.downLoadQrcode(imageSize)
        }
      })
    },
    downLoadQrcode (_imageSize) {
      let _this = this
      request({
        url: '/qrcode/wxa/unlimit',
        method: 'post',
        data: {
          scene: _this.cardUid,
          page: 'pages/card/main',
          expireHours: 24 * 30
        }
      }).then(res => {
        if (res.code !== 0) {
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          const imageUrl = res.data
          wx.getImageInfo({
            src: imageUrl,
            success: (res) => {
              let left = _imageSize.windowWidth / 3
              ctx.drawImage(res.path, left, _imageSize.imageHeight + 120, _imageSize.windowWidth / 3, _imageSize.windowWidth / 3)
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
    this.fetchFriendInfo(this.cardUid)
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

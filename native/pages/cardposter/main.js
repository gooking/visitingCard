const APP = getApp()
import imageUtil from '../../utils/image.js'
let ctx
Page({
  data: {
    canvasstyle: '',
    cardUid: undefined,
    cardUserInfo: undefined
  },
  onLoad: function (e) {
    if (e && e.cardUid) {
      this.setData({
        cardUid: e.cardUid
      })
    }
    wx.showLoading({
      title: ''
    })
    this.downLoadTouxiang()
  },
  downLoadTouxiang() {
    let _this = this
    wx.getImageInfo({
      src: wx.getStorageSync('_haibaoimg'),
      success: (res) => {
        const imageSize = imageUtil(res.width, res.height)
        const additionHeight = 50
        const qrcodeWidth = imageSize.windowWidth / 3
        _this.setData({
          canvasstyle: 'height:' + (imageSize.imageHeight + additionHeight + qrcodeWidth) + 'px'
        })
        ctx = wx.createCanvasContext('firstCanvas')
        ctx.setFillStyle('#fff')
        ctx.fillRect(0, 0, imageSize.windowWidth, imageSize.imageHeight + additionHeight + qrcodeWidth)
        ctx.drawImage(res.path, imageSize.x, imageSize.y, imageSize.imageWidth, imageSize.imageHeight)
        // 画二维码
        const left = (imageSize.imageWidth - qrcodeWidth) / 2
        const top = imageSize.imageHeight + additionHeight / 2
        wx.getImageInfo({
          src: APP.globalData._haibaoimg_qrcode,
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
  saveToMobile() {
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
})
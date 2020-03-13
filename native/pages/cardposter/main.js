const WXAPI = require('apifm-wxapi')
const APP = getApp()
import imageUtil from '../../utils/image.js'


let ctx


Page({

  /**
   * 页面的初始数据
   */
  data: {
    canvasstyle: '',
    cardUid: undefined,
    cardUserInfo: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

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
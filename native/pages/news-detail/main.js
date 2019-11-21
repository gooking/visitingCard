const WxParse = require('../../wxParse/wxParse.js');
const WXAPI = require('apifm-wxapi')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsId: undefined,
    newsObject: {
      title: undefined,
      content: undefined
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.setData({
      newsId: e.newsId
    })
    this.fetchNewsContent()
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
  fetchNewsContent() {
    WXAPI.cmsArticleDetail(this.data.newsId).then(res => {
      if (res.code === 0) {
        this.setData({
          newsObject: res.data
        })
        wx.setNavigationBarTitle({
          title: res.data.title + ' - ' + wx.getStorageSync('mallName')
        })
        WxParse.wxParse('article', 'html', res.data.content, this, 5);
      }
    })
  }
})
const WXAPI = require('apifm-wxapi')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList: undefined,
    content: '...'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
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
    this.fetchNews()
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
  fetchNews() {
    WXAPI.cmsArticles({
      categoryId: wx.getStorageSync('news_category_dt').id
    }).then(res => {
      if (res.code === 0) {
        this.setData({
          newsList: res.data
        })
      } else {
        this.setData({
          newsList: []
        })
      }
    })
  },
  goDetail(e) {
    wx.navigateTo({
      url: '/pages/news-detail/main?newsId=' + e.currentTarget.dataset.id
    })
  }
})
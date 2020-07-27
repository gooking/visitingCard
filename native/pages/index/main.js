const AUTH = require('../../utils/auth')
const WXAPI = require('apifm-wxapi')
const APP = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxlogin: true,

    cardList: [],
    cardUid: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '名片夹 - ' + wx.getStorageSync('mallName')
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
    AUTH.checkHasLogined().then(isLogined => {
      this.setData({
        wxlogin: isLogined
      })
      if (isLogined) {
        this.fetchFriends();
      }
    })
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
  goCard(e) {
    const uid = e.currentTarget.dataset.id
    APP.globalData.cardUid = uid
    wx.switchTab({
      url: '/pages/card/main'
    })
  },
  async fetchFriends() {
    // 判断自己是不是名片
    const token = wx.getStorageSync('token')
    const cardList = []
    let res = await WXAPI.userDetail(token)
    if (res.code == 0 && res.data.userLevel && res.data.userLevel.name === 'aicard') {
      cardList.push(res.data)
    }
    res = await WXAPI.friendList({
      token: token
    })
    if (res.code == 0) {
      for (let i = 0; i < res.data.result.length; i++){
        const element = res.data.result[i]
        const _res = await WXAPI.friendUserDetail(token, element.uids)
        if (_res.code === 0) {
          cardList.push(_res.data)
        }
      }
    }
    this.setData({
      cardList
    })
  },
  cancelLogin() {
    wx.switchTab({
      url: '/pages/card/main'
    })
  },
  processLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '已取消',
        icon: 'none',
      })
      return;
    }
    AUTH.register(this);
  },
})
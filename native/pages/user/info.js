const WXAPI = require('apifm-wxapi')
const AUTH = require('../../utils/auth')
Page({
  data: {

  },
  onLoad: function (options) {
    this.getUserApiInfo()
  },
  onShow: function () {
  },
  getPhoneNumber(e) {
    console.log(e);
    if (!e.detail.errMsg || e.detail.errMsg != "getPhoneNumber:ok") {
      wx.showModal({
        title: '提示',
        content: e.detail.errMsg,
        showCancel: false
      })
      return;
    }
    // https://www.yuque.com/apifm/nu0f75/cql7e1
    WXAPI.bindMobileWxappV2(wx.getStorageSync('token'), e.detail.code).then(res => {
      if (res.code === 10002) {
        AUTH.openLoginDialog()
        return
      }
      if (res.code == 0) {
        wx.showToast({
          title: '绑定成功',
          icon: 'success',
          duration: 2000
        })
        this.getUserApiInfo();
      } else {
        wx.showModal({
          title: '提示',
          content: res.msg,
          showCancel: false
        })
      }
    })
  },
  async getUserApiInfo() {
    // https://www.yuque.com/apifm/nu0f75/zgf8pu
    const res = await WXAPI.userDetail(wx.getStorageSync('token'))
    if (res.code == 0) {
      let _data = {}
      _data.apiUserInfoMap = res.data
      _data.nick = res.data.base.nick
      this.setData(_data)
    }
  },
  async formSubmit(e) {
    console.log(e);
    const postData = {
      token: wx.getStorageSync('token'),
      nick: this.data.nick
    }
    if (this.data.picsList && this.data.picsList.length > 0) {
      // https://www.yuque.com/apifm/nu0f75/ygvqh6
      const res = await WXAPI.uploadFileV2(wx.getStorageSync('token'), this.data.picsList[0].url)
      if (res.code == 0) {
        postData.avatarUrl = res.data.url
      }
    }
    postData.extJsonStr = JSON.stringify(e.detail.value)
    // https://www.yuque.com/apifm/nu0f75/ykr2zr
    const res = await WXAPI.modifyUserInfoV2(postData)
    if (res.code != 0) {
      wx.showToast({
        title: res.msg,
        icon: 'none'
      })
    }
    wx.showToast({
      title: '编辑成功',
    })
    setTimeout(() => {
      wx.navigateBack({
        delta: 0,
      })
    }, 1000);
  },
  afterPicRead(e) {
    let picsList = this.data.picsList
    if (!picsList) {
      picsList = []
    }
    picsList.push(e.detail.file)
    this.setData({
      picsList
    })
  },
  afterPicDel(e) {
    this.setData({
      picsList: []
    })
  },
})
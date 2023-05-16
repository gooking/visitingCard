const WXAPI = require('apifm-wxapi')
const CONFIG = require('config.js')
const AUTH = require('utils/auth')
App({
  onLaunch: function() {
    WXAPI.init(CONFIG.subDomain) // 从根目录的 config.js 文件中读取
    const that = this;
    // 检测新版本
    const updateManager = wx.getUpdateManager()
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success(res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    /**
     * 初次加载判断网络情况
     * 无网络状态下根据实际情况进行调整
     */
    wx.getNetworkType({
      success(res) {
        const networkType = res.networkType
        if (networkType === 'none') {
          that.globalData.isConnected = false
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    });
    /**
     * 监听网络状态变化
     * 可根据业务需求进行调整
     */
    wx.onNetworkStatusChange(function(res) {
      if (!res.isConnected) {
        that.globalData.isConnected = false
        wx.showToast({
          title: '网络已断开',
          icon: 'loading'
        })
      } else {
        that.globalData.isConnected = true
        wx.hideToast()
      }
    });
    // 获取所有的文章分类
    WXAPI.cmsCategories().then(res => {
      if (res.code === 0) {
        res.data.forEach(category => {
          wx.setStorageSync('news_category_' + category.key, category)
        })
      }
    })
  },
  onShow (e) {
    if (e && e.query && e.query.cardUid) {
      this.globalData.cardUid = e.query.cardUid
      wx.setStorageSync('referrer', e.query.cardUid)
    }
    // 自动登录
    AUTH.checkHasLogined().then(isLogined => {
      if (!isLogined) {
        AUTH.authorize()
      }
    })
  },
  globalData: {                
    isConnected: true,
    cardUid: null
  }
})
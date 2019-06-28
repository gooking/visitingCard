<template>
  <div class="container" style="background-color:#fff;">
    <img class="logo" src="/static/images/wx.png" mode="widthFix" />
    <h1 class="title">微信授权页面</h1>
    <p class="profile">授权并同意使用微信账号登录当前小程序</p>
    <button class="button" type="primary" open-type="getUserInfo" @getuserinfo="bindgetuserinfo">授权登录</button>
    <support />
  </div>
</template>

<script>
import request from '@/utils/request'
import support from '@/components/support'

export default {
  data () {
    return {
      userInfo: {}
    }
  },
  computed: {
    isConnected () {
      return this.$store.state.isConnected
    }
  },
  components: {
    support
  },
  methods: {
    bindgetuserinfo (e) {
      if (!e.mp.detail.userInfo) {
        return
      }
      if (this.isConnected) {
        // 登录
        this.login()
      } else {
        wx.showToast({
          title: '当前无网络',
          icon: 'none'
        })
      }
    },
    login: function () {
      let _this = this
      wx.login({
        success: function (res) {
          wx.showLoading({
            title: ''
          })
          request({
            url: '/user/wxapp/login',
            method: 'get',
            data: {
              code: res.code
            }
          }).then(res => {
            if (res.code === 10000) {
              // 去注册
              _this.registerUser()
              return
            }
            if (res.code !== 0) {
              // 登录错误
              wx.hideLoading()
              wx.showModal({
                title: '提示',
                content: '无法登录，请重试',
                showCancel: false
              })
              return
            }
            let userInfo = {}
            userInfo.token = res.data.token
            userInfo.uid = res.data.uid
            wx.setStorageSync('userInfo', userInfo)
            wx.navigateBack()
          })
        }
      })
    },
    registerUser: function () {
      let _this = this
      wx.login({
        success: function (res) {
          let code = res.code
          wx.getUserInfo({
            success: function (res) {
              let iv = res.iv
              let encryptedData = res.encryptedData
              let _data = {
                code: code,
                encryptedData: encryptedData,
                iv: iv
              }
              const referrer = wx.getStorageSync('referrer')
              if (referrer) {
                _data.referrer = referrer
              }
              request({
                url: '/user/wxapp/register/complex',
                method: 'post',
                data: _data
              }).then(res => {
                console.log(111133)
                _this.login()
              })
            }
          })
        }
      })
    }
  },

  created () {
    // 调用应用实例的方法获取全局数据
  }
}
</script>

<style scoped>
.logo {
  width:200rpx;
  margin-top:180rpx;
}
.title {
  margin-top:70rpx;
}
.profile {
  margin-top:30rpx;
  font-size: 14px;
  color:#888;
}
.button {
  width: 700rpx;
  margin-top: 50rpx;
  margin-bottom: 50rpx;
}
</style>

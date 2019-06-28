<template>
  <div v-if="cardUserInfo" class="container">
    <div class="max-width">
      <img class="userinfo-avatar" :src="cardUserInfo.base.avatarUrl" mode="widthFix" />
    </div>
    <div class="profile-box">      
      <div class="profile">
        <div class="name">{{ cardUserInfo.base.nick }}</div>
        <div class="position">{{ cardUserInfo.ext ? cardUserInfo.ext['职位'] : '-' }}</div>
      </div>
      <div class="profile2">
        <div class="name">手机</div>
        <div class="position">{{cardUserInfo.base.mobile}}</div>
        <div class="action"><button class="action" @click="callPhone(cardUserInfo.base.mobile)">拨打</button></div>        
      </div>
      <div v-for="(v, k) in cardUserInfo.ext" :key="k" class="profile2">
        <div class="name">{{k}}</div>
        <div class="position">{{v}}</div>
        <div class="action"><button class="action" @click="copyData(v)">复制</button></div>
        <!-- <div v-if="kActionType[k]" class="action"><button class="action" @click="copyData(v)">复制</button></div>        
        <div v-else class="action"><button class="action" @click="callPhone(v)">拨打</button></div>         -->
      </div>
    </div>
    <div class="action-buttons">
      <div class="button" @click="createHaibao">
        <img class="img" src="/static/images/posters.png">
        <div class="txt">生成海报</div>
      </div>
      <div class="button" @click="addPhoneContact">
        <img class="img" src="/static/images/txl.png">
        <div class="txt">存入通讯录</div>
      </div>
      <div class="button">
        <button open-type="share" plain="true" style="border:none;">
          <img class="img" style="margin-left:0;" src="/static/images/share.png">
        </button>
        <div class="txt">分享好友</div>
      </div>
    </div>
    <div>
      <img v-if="qrcode" class="qrcode" :src="qrcode">
    </div>
    <!-- 分享 -->
    <!-- <div class="share" @click="openShare=true">
      <img class="shareimg" src="/static/images/share.png">
    </div> -->
    <!-- 保存到通讯录 -->
    <!-- <div class="share" style="top: 720rpx;" @click="addPhoneContact">
      <img class="shareimg" src="/static/images/txl.png">
    </div> -->
    <!-- 客服图标 -->
    <!-- <button open-type="contact" plain="true" style="border:none;">
      <div class="share" style="top: 440rpx;">       
        <div style="margin-top:-15rpx;"><img class="shareimg" src="/static/images/kf.png"></div>
        <div style="margin-top:-30rpx;">咨询</div>        
      </div>
    </button> -->
    <!-- 返回名片夹 -->
    <div v-if="showMpjbutton" class="sharempj" @click="goIndex">
      <img class="shareimg" src="/static/images/mpj.png">
    </div>
    <!-- <div style="position:fixed;width:60rpx;height:60rpx;top: 100rpx;left:0;" @click="goIndex">       
      <img style="width:60rpx;height:60rpx;" src="/static/images/mpj.png">
    </div> -->
    <!-- 分享漂浮 -->
    <div v-if="openShare" class="shareFloatDiv1"></div>
    <div v-if="openShare" class="shareFloatDiv2">
      <div class="p1">
        <div class="wx">
          <button open-type="share" plain="true" style="border:none;">
              <img class="shareimg" src="/static/images/wx.png">
          </button>
          <div style="margin-top:-23rpx;">微信好友</div>
        </div>
        <div class="wx">
          <div @click="cardposter"><img class="shareimg" src="/static/images/pyq.png"></div>
          <div>生成海报</div>
        </div>
      </div>
      <div class="p2"></div>
      <div class="p3" @click="openShare=false"> 取消 </div>
      <div class="p2"></div>
    </div>    
    <support />
  </div>
</template>

<script>
import request from '@/utils/request'
import support from '@/components/support'
import wxParse from 'mpvue-wxparse'

export default {
  data () {
    return {
      showMpjbutton: false,

      openShare: false,
      userInfo: wx.getStorageSync('userInfo'),
      cardUserInfo: undefined,
      kActionType: {},
      content: '...',
      qrcode: undefined
    }
  },
  components: {
    support,
    wxParse
  },
  methods: {
    preview (src, e) {
      // do something
    },
    navigate (href, e) {
      // do something
    },
    goIndex () {
      wx.reLaunch({
        url: '/pages/index/main'
      })
    },
    async createHaibao () { // 生成海报
      wx.chooseImage({
        count: 1,
        success: (res) => {
          console.log(res)
          wx.setStorageSync('_haibaoimg', res.tempFilePaths[0])
          this.cardposter()
        }
      })
    },
    cardposter () {
      const url = '../cardposter/main?cardUid=' + this.cardUserInfo.base.id
      wx.navigateTo({ url })
    },
    callPhone (phone) {
      wx.makePhoneCall({
        phoneNumber: phone
      })
    },
    copyData (d) {
      wx.setClipboardData({
        data: d,
        success: (res) => {
          wx.showToast({
            title: '复制成功',
            icon: 'success',
            duration: 2000
          })
        }
      })
    },
    addPhoneContact () {
      // 调用登录接口
      wx.addPhoneContact({
        photoFilePath: this.cardUserInfo.base.avatarUrl,
        organization: process.env.APP_NAME,
        title: this.cardUserInfo.ext['职位'],
        firstName: this.cardUserInfo.base.nick,
        mobilePhoneNumber: this.cardUserInfo.base.mobile,
        success: () => {
          console.log('success')
        }
      })
    },
    async fetchFriendInfo (uid) {
      let _this = this
      await request({
        url: '/user/friend/add',
        method: 'get',
        data: {
          token: _this.userInfo.token,
          uid: uid
        }
      })
      request({
        url: '/user/friend/detail',
        method: 'get',
        data: {
          token: _this.userInfo.token,
          uid: uid
        }
      }).then(res => {
        if (res.code === 0) {
          if (res.data.userLevel && (!res.data.userLevel.maxUser || res.data.userLevel.maxUser > 1)) {
            _this.showMpjbutton = true
          }
          _this.fetchUserQrcode(uid).then(qrcode => {
            if (qrcode) {
              _this.qrcode = qrcode
              wx.setStorageSync('_haibaoimg_qrcode', qrcode)
            }
          })
          _this.cardUserInfo = res.data
          if (_this.cardUserInfo.ext) {
            Object.keys(_this.cardUserInfo.ext).forEach(k => {
              // kActionType
              const v = _this.cardUserInfo.ext[k]
              _this.kActionType[k] = isNaN(v)
            })
          }
        }
      })
    },
    fetchPageContent (uid) {
      let _this = this
      request({
        url: '/cms/page/info',
        method: 'get',
        data: {
          key: uid
        }
      }).then(res => {
        if (res.code === 0) {
          _this.content = res.data.content
        }
      })
    },
    async fetchUserQrcode (cardUid) {
      let _j = await request({
        url: '/json/list',
        method: 'post',
        data: {
          type: 'aicard_qrcode',
          refId: cardUid
        }
      })
      if (_j.code === 0) {
        return _j.data[0].jsonData.qrcode
      }
      // 获取二维码
      _j = await request({
        url: '/qrcode/wxa/unlimit',
        method: 'post',
        data: {
          scene: cardUid,
          page: 'pages/card/main',
          is_hyaline: 'true'
        }
      })
      if (_j.code === 0) {
        // 保存到json
        await request({
          url: '/json/set',
          method: 'post',
          data: {
            type: 'aicard_qrcode',
            refId: cardUid,
            content: '{qrcode: "' + _j.data + '"}'
          }
        })
        return _j.data
      }
      return ''
    },
    async fetchDefaultMPUID () {
      const _this = this
      const myUserInfo = await request({
        url: '/user/detail',
        method: 'get',
        data: {
          token: _this.userInfo.token
        }
      })
      if (myUserInfo.code === 2000) {
        wx.navigateTo({
          url: '/pages/authorization/main'
        })
        return
      }
      if (myUserInfo.code === 0 && myUserInfo.data.userLevel && myUserInfo.data.userLevel.name === 'aicard') {
        return myUserInfo.data.base.id
      }
      let defaultMP = await request({
        url: '/config/get-value',
        method: 'get',
        data: {
          key: 'DEFAULT_FRIEND_UID'
        }
      })
      if (defaultMP.code === 0) {
        return defaultMP.data.value
      }
    }
  },
  created () {
    // 调用应用实例的方法获取全局数据
  },
  onShow () {
    this.userInfo = wx.getStorageSync('userInfo')
    const cardUid = wx.getStorageSync('cardUid')
    if (!cardUid) {
      console.log('无cardUid参数，获取默认名片')
      this.fetchDefaultMPUID().then(res => {
        this.fetchFriendInfo(res)
      })
    } else {
      this.fetchFriendInfo(cardUid)
    }
  },
  onLoad (e) {
    if (e && e.cardUid) { // 转发
      wx.setStorageSync('referrer', e.cardUid)
      wx.setStorageSync('cardUid', e.cardUid)
    }
    if (e.scene) { // 扫码
      const scene = decodeURIComponent(e.scene)
      wx.setStorageSync('referrer', scene)
      wx.setStorageSync('cardUid', scene)
    }
    this.userInfo = wx.getStorageSync('userInfo')
    if (!this.userInfo) {
      wx.navigateTo({
        url: '/pages/authorization/main'
      })
    }
  },
  onShareAppMessage: function () {
    return {
      title: '您好，我是 ' + process.env.APP_NAME + ' 的' + this.cardUserInfo.base.nick + '，请惠存我的名片。',
      path: '/pages/card/main?cardUid=' + this.cardUserInfo.base.id,
      imageUrl: this.cardUserInfo.base.avatarUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
}
</script>

<style scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.container {
  width: 750rpx;
  background-color: #faf9f9;
}
.max-width {
  width: 750rpx;
  background-color: #ffffff;
}
.userinfo-avatar {
  width: 750rpx;
}
.profile-box {
  position: relative;
  width:650rpx;
  background-color: #ffffff;
  bottom:100rpx;
}
.action-buttons {
  width: 750rpx;
  display: flex;
  text-align: center;
}
.action-buttons .button {
  width: 250rpx;
  text-align: center;
}
.action-buttons .button .img {
  width: 180rpx;
  height: 180rpx;
  margin-left: 35rpx;
  display: block;
}
.action-buttons .button .txt {
  font-size: 12px;
  display: block;
}
.profile {
  text-align: left;
  padding: 20rpx;
  color:#555555;
  display: flex;
  flex-direction: row;
  align-items:flex-end;
}
.profile .name {
  font-size: 20px;
}
.profile .position {
  font-size: 12px;
  margin-left: 30rpx;
}
.phone {
  text-align: left;
  padding: 20rpx;
  font-size: 14px;
}
.profile2 {
  text-align: left;
  padding: 20rpx;
  color:#555555;
  display: flex;
  flex-direction: row;
  justify-content:space-between;
  align-items:flex-end;
}
.profile2 .name {
  font-size: 16px;
  width:120rpx;
}
.profile2 .position {
  font-size: 14px;
  width:400rpx;
}
.profile2 .action {
  font-size: 12px;
  width:120rpx;
}
.share {
  position:fixed;
  right:0rpx;
  top: 600rpx;
}
.sharempj {
  position:fixed;
  left:0rpx;
  top: 60rpx;
}
.share .shareimg {
  width:110rpx;
  height:110rpx;
}
.sharempj .shareimg {
  width:90rpx;
  height:60rpx;
}
.shareFloatDiv1 {
  position:fixed;
  width:100%;
  height:100%;
  background-color:#555;filter:Alpha(Opacity=60);opacity:0.6;
}
.shareFloatDiv2 {
  position:fixed;
  width:100%;
  height:400rpx;
  background-color: #ffffff;
  bottom: 0rpx;
}
.shareFloatDiv2 .p1 {
  height:260rpx;
  display: flex;
  flex-direction: row;
}
.shareFloatDiv2 .p1 .wx {
  font-size: 14px;
  width:375rpx;
  text-align: center;
  padding-top: 50rpx;
}
.shareFloatDiv2 .p1 .wx .shareimg {
  width:150rpx;
  height:150rpx;
}
.shareFloatDiv2 .p2 {
  height:20rpx;
  background-color: #EEEEEE;
}
.shareFloatDiv2 .p3 {
  height:100rpx;
  line-height: 100rpx;
  text-align: center;
  color:#555555;
  font-size: 14px;
}
.qrcode {
  width:300rpx;
  height:300rpx;
  margin-top: 50rpx;
}
</style>

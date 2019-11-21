<template>
  <div class="container">
    <div v-if="card.ext" v-for="card in cardList" :key="card" class="card" @click="goCard(card.base.id)">
      <div class="profile">
        <div class="name">{{ card.base.nick }}</div>
        <div class="position">{{ card.ext['职位'] }}</div>
        <div class="phone">{{ card.base.mobile }}</div>
        <div class="mail">{{ card.ext['邮箱'] }}</div>
      </div>
      <div class="photo">
        <img class="userinfo-avatar" :src="card.base.avatarUrl" mode="widthFix" />
      </div>
    </div>
    <support />
  </div>
</template>

<script>
import request from '@/utils/request'
import support from '@/components/support'

export default {
  data () {
    return {
      userInfo: wx.getStorageSync('userInfo'),
      myUserInfo: undefined, // base ext userLevel
      cardList: [],
      cardUid: undefined
    }
  },
  components: {
    support
  },
  methods: {
    goCard (uid) {
      wx.setStorageSync('cardUid', uid)
      wx.switchTab({
        url: '/pages/card/main'
      })
    },
    fetchFriends () {
      let _this = this
      request({
        url: '/user/friend/list',
        method: 'get',
        data: {
          token: _this.userInfo.token
        }
      }).then(res => {
        if (res.code === 700 && !_this.myUserInfo) {
          _this.loadDefaultFriend()
          return
        }
        if (res.code === 0) {
          res.data.result.forEach(element => {
            _this.fetchFriendInfo(element.uids)
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
          _this.cardList.push(res.data)
        }
      })
    },
    loadDefaultFriend () {
      let _this = this
      request({
        url: '/config/get-value',
        method: 'get',
        data: {
          key: 'DEFAULT_FRIEND_UID'
        }
      }).then(res => {
        if (res.code === 0) {
          let uid = res.data.value
          _this.addFriend(uid)
        }
      })
    },
    addFriend (uid) {
      let _this = this
      request({
        url: '/user/friend/add',
        method: 'get',
        data: {
          token: _this.userInfo.token,
          uid: uid
        }
      }).then(res => {
        if (res.code === 0) {
          _this.fetchFriends()
        }
      })
    }
  },
  onLoad (e) {
    if (e && e.cardUid) {
      this.cardUid = e.cardUid
    } else {
      this.cardUid = undefined
    }
    if (e.scene) {
      const scene = decodeURIComponent(e.scene)
      this.cardUid = scene
    }
    if (this.cardUid) {
      wx.setStorageSync('referrer', this.cardUid)
    }
    if (!this.userInfo) {
      wx.navigateTo({
        url: '/pages/authorization/main'
      })
    }
  },
  onShow () {
    // 读取用户信息
    let _this = this
    _this.cardList = []
    _this.userInfo = wx.getStorageSync('userInfo')
    if (!_this.userInfo) {
      return
    }
    if (_this.cardUid) {
      _this.addFriend(_this.cardUid)
    }
    request({
      url: '/user/detail',
      method: 'get',
      data: {
        token: _this.userInfo.token
      }
    }).then(res => {
      if (res.code === 2000) {
        wx.navigateTo({
          url: '/pages/authorization/main'
        })
        return
      }
      if (res.code === 0 && res.data.userLevel && res.data.userLevel.name === 'aicard') {
        _this.myUserInfo = res.data
        _this.cardList.push(_this.myUserInfo)
      }
      if (!_this.cardUid) {
        _this.fetchFriends()
      }
    })
  },
  created () {
    // 调用应用实例的方法获取全局数据
  }
}
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: row;
  width: 680rpx;
  height: 300rpx;
  background-color: #ffffff;
  border-radius:10px;
  margin-top: 30rpx;
}
.card .profile {
  width: 400rpx;
  color:#555555;
  padding-left: 20rpx;
}
.card .profile .name {
  font-size: 30px;
}
.card .profile .position {
  font-size: 20px;
}
.card .profile .phone {
  margin-top: 60rpx;
  font-size: 15px;
}
.card .profile .mail {
  font-size: 15px;
}
.card .photo {
  width: 280rpx;
  height: 300rpx;
  overflow: hidden;
}
.card .photo .userinfo-avatar {
  width: 280rpx;
  border-radius: 10px;
}
</style>

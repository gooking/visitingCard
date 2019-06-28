<template>
  <div class="container" style="background-color: #fff;">
    <div v-if="!newsList" class="noData">
      <img class="logo" src="/static/images/nodata-message.png" mode="widthFix" />
      <div>暂无数据 ~ </div>
    </div>
    <div v-for="news in newsList" :key="news.id" class="newsList" @click="goDetail(news.id)">
      <div v-if="news.pic" class="cover">
        <img class="cover-img" :src="news.pic" mode="widthFix" />
      </div>
      <div class="title">{{news.title}}</div>
      <div class="descript">{{news.descript}}</div>
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'

export default {
  data () {
    return {
      newsList: undefined,
      content: '...'
    }
  },
  methods: {
    preview (src, e) {
      // do something
    },
    navigate (href, e) {
      // do something
    },
    fetchNews () {
      let _this = this
      request({
        url: '/cms/news/list',
        method: 'get',
        data: {
          categoryId: wx.getStorageSync('news_category_zs').id
        }
      }).then(res => {
        if (res.code === 0) {
          _this.newsList = res.data
        } else {
          _this.newsList = undefined
        }
      })
    },
    goDetail (newsId) {
      wx.navigateTo({
        url: '/pages/news-detail/main?newsId=' + newsId
      })
    }
  },
  created () {
    // 调用应用实例的方法获取全局数据
  },
  onShow () {
    this.fetchNews()
  }
}
</script>

<style scoped>
.noData {  
  text-align: center;
  font-size: 12px;
  color:#666;
  width: 750rpx;
  height:200rpx;
  padding-top: 100rpx;
}
.noData .logo {
  width:300rpx;
  margin-top:180rpx;
}
.newsList {
  width: 720rpx;
  padding-top:30rpx;
  padding-bottom:30rpx;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
}
.cover {
  width: 100%;
}
.cover-img {
  width: 100%;
  border-radius: 10px;
}
.title {
  margin-top: 10px;
}
.descript {
  margin-top: 10px;
  line-height: 25px;
  font-size: 13px;
  color:#666;
}
</style>

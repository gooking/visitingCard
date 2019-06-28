<template>
  <div class="container" style="background-color: #fff">
    <div class="title">{{newsObject.title}}</div>
    <div class="datetime">{{newsObject.dateAdd}}</div>
    <div class="wxparse-content">
      <wxParse :content="newsObject.content" noData="内容为空" @preview="preview" @navigate="navigate" />
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import wxParse from 'mpvue-wxparse'

export default {
  data () {
    return {
      newsId: undefined,
      newsObject: {
        title: undefined,
        content: undefined
      }
    }
  },
  components: {
    wxParse
  },
  methods: {
    preview (src, e) {
      // do something
    },
    navigate (href, e) {
      // do something
    },
    fetchNewsContent () {
      let _this = this
      request({
        url: '/cms/news/detail',
        method: 'get',
        data: {
          id: _this.newsId
        }
      }).then(res => {
        if (res.code === 0) {
          _this.newsObject = res.data
        }
      })
    }
  },
  created () {
    // 调用应用实例的方法获取全局数据
  },
  onLoad (e) {
    if (e) {
      this.newsId = e.newsId
    }
  },
  onShow () {
    this.fetchNewsContent()
  }
}
</script>

<style scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.title {
  text-align: left;
  width:700rpx;
}
.datetime {
  width:700rpx;
  font-size: 12px;
  margin-top: 10px;
  color:#aaa;
}
.wxparse-content {
  width: 700rpx;
  text-align: left;
  font-size: 14px;
}
</style>

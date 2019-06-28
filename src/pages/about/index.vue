<template>
  <div class="container" style="background-color: #fff">
    <div v-if="!content" class="noData">
      <img class="logo" src="/static/images/nodata-message.png" mode="widthFix" />
      <div>暂无数据 ~ </div>
    </div>
    <div v-else class="wxparse-content">
      <wxParse :content="content" noData="内容为空" @preview="preview" @navigate="navigate" />
    </div>
  </div>
</template>

<script>
import request from '@/utils/request'
import wxParse from 'mpvue-wxparse'

export default {
  data () {
    return {
      content: undefined
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
    fetchPageContent () {
      let _this = this
      request({
        url: '/cms/page/info',
        method: 'get',
        data: {
          key: '0'
        }
      }).then(res => {
        if (res.code === 0) {
          _this.content = res.data.content
        }
      })
    }
  },
  created () {
    // 调用应用实例的方法获取全局数据
  },
  onShow () {
    this.fetchPageContent()
  }
}
</script>

<style scoped>
@import url("~mpvue-wxparse/src/wxParse.css");
.wxparse-content {
  width: 700rpx;
  text-align: left;
  font-size: 14px;
}
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
</style>

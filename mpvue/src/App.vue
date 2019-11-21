<script>
import request from '@/utils/request'
export default {
  created () {
    // 检查网络连接状态
    wx.getNetworkType({
      success: (res) => {
        const networkType = res.networkType
        if (networkType === 'none') {
          this.$store.commit('setIsConnected', false)
          wx.showToast({
            title: '当前无网络',
            icon: 'loading',
            duration: 2000
          })
        }
      }
    })
    // 读取CMS分类，用以区分动态、产品展示
    request({
      url: '/cms/category/list',
      method: 'get'
    }).then(res => {
      if (res.code === 0) {
        res.data.forEach(category => {
          wx.setStorageSync('news_category_' + category.key, category)
        })
      }
    })
  }
}
</script>

<style>
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  background-color: #EEEEEE;
}
</style>

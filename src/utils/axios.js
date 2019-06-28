import axios from '../../node_modules/axios/dist/axios'

axios.defaults.adapter = function (config) {
  // 发交易之前显示加载中
  wx.showLoading({ title: '拼命加载中...' })
  // 发交易调用(开发放开注释)
  return new Promise((resolve, reject) => {
    let _url = 'https://api.it120.cc'
    if (!config.publicDomain) {
      _url += ('/' + process.env.SUB_DOMAIN)
    }
    _url += config.url
    let _data = {}
    if (config.data) {
      _data = JSON.parse(config.data)
    }
    wx.request({
      ...config,
      url: _url,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: _data,
      success: res => {
        return resolve(res || {})
      },
      complete: res => {
        wx.hideLoading()
        // TODO:
      }
    })
  })
}

export default axios

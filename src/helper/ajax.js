import $util from './util'

function requestHandle (params) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: params.url,
      method: params.method,
      data: params.data,
      header: {
        'content-type': 'application/json'
      },
      success (res) {
        const result = res.data
        /* @desc: 可跟具体不同业务接口数据，返回你所需要的部分，使得使用尽可能便捷 */
        result.success ? resolve(result.value) : resolve(res.errMsg)
      },
      fail (error) {
        console.log(`🐛 request fail, code = ${error}`)
        reject(error)
      }
    })
  })
}

export default {
  post: function (url, params, op) {
    return requestHandle({
      method: 'post',
      url: url,
      data: params
    })
  },
  get: function (url, params, op) {
    return requestHandle({
      method: 'get',
      url: $util.queryString(url, params)
    })
  }
}

import marked from 'marked'

export default {
  assembleExternalLink (url) {
    const separator = url.endsWith('/') ? '' : '/'
    return `${url}${separator}?utm_source=nicelinks.site`
  },

  /**
   * @desc:获得 mix max 之间的随机值，包括两者;
   * @param {number} min 小值
   * @param {number} max 大值
   * @return {number} 随机数
   */
  getRandomInt (min, max) {
    return Math.floor(min + Math.random() * (max + 1 - min))
  },

  parseMarkdown (mdStr = '') {
    return marked(mdStr, {})
  },

  queryString (url, query) {
    let str = []
    for (let key in query) {
      str.push(key + '=' + query[key])
    }
    let paramStr = str.join('&')
    return paramStr ? `${url}?${paramStr}` : url
  },

  // 获取字符串实际长度(包含汉字,汉字统一按照 2 字节算;)
  getByteLength (str = '') {
    if (typeof str !== 'string') return str.length
    return str.replace(/[^\x00-\xff]/g, 'aa').length
  },

  interceptString (string = '', length = 140) {
    if (this.getByteLength(string) > 140) {
      return string.substring(0, length) + '...'
    } else {
      return string
    }
  },

  /**
   * @desc 前置填充指定位数个“字符”;
   * @param {number|string} source 源字符/数组
   * @param {number} length 指定长度
   * @param {string} keyStr 填充字符
   */
  specifiedPadding (source, length, keyStr) {
    return (Array(length).join(keyStr) + source).slice(-length)
  }
}

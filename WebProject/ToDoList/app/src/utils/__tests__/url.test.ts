import { getQueryParam, getAllQueryParams, hasQueryParam, buildQueryString } from '@/utils/url'

describe('URL 工具函数测试', () => {
  describe('getQueryParam', () => {
    it('应该正确获取单个参数值', () => {
      const url = 'http://127.0.0.1/?key=test'
      const result = getQueryParam('key', { url })
      expect(result).toBe('test')
    })

    it('参数不存在时应该返回 null', () => {
      const url = 'http://127.0.0.1/?key=test'
      const result = getQueryParam('nonexistent', { url })
      expect(result).toBe(null)
    })

    it('应该支持自定义默认值', () => {
      const url = 'http://127.0.0.1/?key=test'
      const result = getQueryParam('nonexistent', { url, defaultValue: 'default' })
      expect(result).toBe('default')
    })

    it('应该正确处理 URL 编码的字符', () => {
      const url = 'http://127.0.0.1/?message=Hello%20World%21'
      const result = getQueryParam('message', { url })
      expect(result).toBe('Hello World!')
    })

    it('应该正确处理特殊字符', () => {
      const url = 'http://127.0.0.1/?data=a%26b%3Dc%2Bd'
      const result = getQueryParam('data', { url })
      expect(result).toBe('a&b=c+d')
    })

    it('应该正确处理中文参数', () => {
      const url = 'http://127.0.0.1/?name=%E5%BC%A0%E4%B8%89'
      const result = getQueryParam('name', { url })
      expect(result).toBe('张三')
    })

    it('应该正确处理多个参数', () => {
      const url = 'http://127.0.0.1/?page=1&pageSize=10&keyword=test'
      const page = getQueryParam('page', { url })
      const pageSize = getQueryParam('pageSize', { url })
      const keyword = getQueryParam('keyword', { url })
      expect(page).toBe('1')
      expect(pageSize).toBe('10')
      expect(keyword).toBe('test')
    })

    it('应该正确处理空参数值', () => {
      const url = 'http://127.0.0.1/?key=&value=test'
      const result = getQueryParam('key', { url })
      expect(result).toBe('')
    })
  })

  describe('getAllQueryParams', () => {
    it('应该正确获取所有参数', () => {
      const url = 'http://127.0.0.1/?name=zhangsan&age=25&city=beijing'
      const result = getAllQueryParams(url)
      expect(result).toEqual({
        name: 'zhangsan',
        age: '25',
        city: 'beijing',
      })
    })

    it('没有参数时应该返回空对象', () => {
      const url = 'http://127.0.0.1/'
      const result = getAllQueryParams(url)
      expect(result).toEqual({})
    })

    it('应该正确处理 URL 编码的参数', () => {
      const url = 'http://example.com/?name=%E5%BC%A0%E4%B8%89&message=Hello%20World'
      const result = getAllQueryParams(url)
      expect(result).toEqual({
        name: '张三',
        message: 'Hello World',
      })
    })

    it('应该正确处理特殊字符', () => {
      const url = 'http://example.com/?data=a%26b%3Dc'
      const result = getAllQueryParams(url)
      expect(result).toEqual({
        data: 'a&b=c',
      })
    })
  })

  describe('hasQueryParam', () => {
    it('参数存在时应该返回 true', () => {
      const url = 'http://127.0.0.1/?key=test'
      const result = hasQueryParam('key', url)
      expect(result).toBe(true)
    })

    it('参数不存在时应该返回 false', () => {
      const url = 'http://127.0.0.1/?key=test'
      const result = hasQueryParam('nonexistent', url)
      expect(result).toBe(false)
    })

    it('没有参数时应该返回 false', () => {
      const url = 'http://127.0.0.1/'
      const result = hasQueryParam('key', url)
      expect(result).toBe(false)
    })
  })

  describe('buildQueryString', () => {
    it('应该正确构建简单的查询字符串', () => {
      const result = buildQueryString({ page: 1, pageSize: 10 })
      expect(result).toBe('page=1&pageSize=10')
    })

    it('应该正确处理包含空格的值', () => {
      const result = buildQueryString({ name: 'zhang san', message: 'hello world' })
      expect(result).toBe('name=zhang+san&message=hello+world')
    })

    it('应该正确处理布尔值', () => {
      const result = buildQueryString({ active: true, verified: false })
      expect(result).toBe('active=true&verified=false')
    })

    it('应该正确处理数字', () => {
      const result = buildQueryString({ age: 25, count: 100 })
      expect(result).toBe('age=25&count=100')
    })

    it('空对象应该返回空字符串', () => {
      const result = buildQueryString({})
      expect(result).toBe('')
    })
  })
})

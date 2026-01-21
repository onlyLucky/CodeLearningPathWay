interface GetQueryParamOptions {
  defaultValue?: string | null
  url?: string
}

function getQueryParam(paramName: string, options: GetQueryParamOptions = {}): string | null {
  const { defaultValue = null, url } = options

  try {
    let queryString: string

    if (url) {
      const urlObj = new URL(url)
      queryString = urlObj.search
      if (!queryString && urlObj.hash) {
        const hashParts = urlObj.hash.split('?')
        if (hashParts.length > 1) {
          queryString = '?' + hashParts.slice(1).join('?')
        }
      }
    } else {
      if (typeof window !== 'undefined' && window.location) {
        queryString = window.location.search
        if (!queryString && window.location.hash) {
          const hashParts = window.location.hash.split('?')
          if (hashParts.length > 1) {
            queryString = '?' + hashParts.slice(1).join('?')
          }
        }
      } else {
        const pages = getCurrentPages()
        if (pages.length > 0) {
          const currentPage = pages[pages.length - 1]
          const options = (currentPage as any).options || (currentPage as any).$page?.options
          if (options && paramName in options) {
            return options[paramName]
          }
        }
        return defaultValue
      }
    }

    if (!queryString) {
      return defaultValue
    }

    const searchParams = new URLSearchParams(queryString)
    const value = searchParams.get(paramName)

    if (value === null) {
      return defaultValue
    }

    return decodeURIComponent(value)
  } catch (error) {
    console.error('获取URL查询参数失败:', error)
    return defaultValue
  }
}

function getAllQueryParams(url?: string): Record<string, string> {
  try {
    let queryString: string

    if (url) {
      const urlObj = new URL(url)
      queryString = urlObj.search
      if (!queryString && urlObj.hash) {
        const hashParts = urlObj.hash.split('?')
        if (hashParts.length > 1) {
          queryString = '?' + hashParts.slice(1).join('?')
        }
      }
    } else {
      if (typeof window !== 'undefined' && window.location) {
        queryString = window.location.search
        if (!queryString && window.location.hash) {
          const hashParts = window.location.hash.split('?')
          if (hashParts.length > 1) {
            queryString = '?' + hashParts.slice(1).join('?')
          }
        }
      } else {
        const pages = getCurrentPages()
        if (pages.length > 0) {
          const currentPage = pages[pages.length - 1]
          const options = (currentPage as any).options || (currentPage as any).$page?.options
          if (options) {
            return options
          }
        }
        return {}
      }
    }

    if (!queryString) {
      return {}
    }

    const searchParams = new URLSearchParams(queryString)
    const params: Record<string, string> = {}

    searchParams.forEach((value, key) => {
      params[key] = decodeURIComponent(value)
    })

    return params
  } catch (error) {
    console.error('获取所有URL查询参数失败:', error)
    return {}
  }
}

function hasQueryParam(paramName: string, url?: string): boolean {
  try {
    let queryString: string

    if (url) {
      const urlObj = new URL(url)
      queryString = urlObj.search
      if (!queryString && urlObj.hash) {
        const hashParts = urlObj.hash.split('?')
        if (hashParts.length > 1) {
          queryString = '?' + hashParts.slice(1).join('?')
        }
      }
    } else {
      if (typeof window !== 'undefined' && window.location) {
        queryString = window.location.search
        if (!queryString && window.location.hash) {
          const hashParts = window.location.hash.split('?')
          if (hashParts.length > 1) {
            queryString = '?' + hashParts.slice(1).join('?')
          }
        }
      } else {
        const pages = getCurrentPages()
        if (pages.length > 0) {
          const currentPage = pages[pages.length - 1]
          const options = (currentPage as any).options || (currentPage as any).$page?.options
          if (options && paramName in options) {
            return true
          }
        }
        return false
      }
    }

    if (!queryString) {
      return false
    }

    const searchParams = new URLSearchParams(queryString)
    return searchParams.has(paramName)
  } catch (error) {
    console.error('检查URL查询参数是否存在失败:', error)
    return false
  }
}

function buildQueryString(params: Record<string, string | number | boolean>): string {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, String(value))
  })

  return searchParams.toString()
}

export { getQueryParam, getAllQueryParams, hasQueryParam, buildQueryString }

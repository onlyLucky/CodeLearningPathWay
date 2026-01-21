interface DownloadOptions {
  showLoading?: boolean
  loadingText?: string
  successText?: string
  errorText?: string
  fileName?: string
}

const downloadFile = (url: string, options: DownloadOptions = {}): void => {
  const {
    showLoading = true,
    loadingText = '下载中...',
    successText = '下载成功',
    errorText = '下载失败，请稍后重试',
    fileName,
  } = options

  if (!url) {
    uni.showToast({
      title: '下载地址不能为空',
      icon: 'none',
      duration: 2000,
    })
    return
  }

  if (showLoading) {
    uni.showLoading({
      title: loadingText,
      mask: true,
    })
  }

  uni.downloadFile({
    url: url,
    success: (res) => {
      if (showLoading) {
        uni.hideLoading()
      }
      if (res.statusCode === 200) {
        const tempFilePath = res.tempFilePath

        if (typeof window !== 'undefined') {
          const link = document.createElement('a')
          link.href = tempFilePath
          const defaultFileName = url.split('/').pop() || 'download'
          const decodedFileName = decodeURIComponent(defaultFileName)
          link.download = fileName || decodedFileName
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          uni.showToast({
            title: successText,
            icon: 'success',
            duration: 2000,
          })
        } else {
          uni.saveFile({
            tempFilePath: tempFilePath,
            success: () => {
              uni.showToast({
                title: successText,
                icon: 'success',
                duration: 2000,
              })
            },
            fail: (err) => {
              console.error('保存文件失败:', err)
              uni.showToast({
                title: '保存文件失败',
                icon: 'none',
                duration: 2000,
              })
            },
          })
        }
      } else {
        uni.showToast({
          title: '下载失败',
          icon: 'none',
          duration: 2000,
        })
      }
    },
    fail: (err) => {
      if (showLoading) {
        uni.hideLoading()
      }
      console.error('下载失败:', err)
      uni.showToast({
        title: errorText,
        icon: 'none',
        duration: 2000,
      })
    },
  })
}

const downloadMultipleFiles = async (urls: string[]): Promise<void> => {
  if (!urls || urls.length === 0) {
    uni.showToast({
      title: '下载地址不能为空',
      icon: 'none',
      duration: 2000,
    })
    return
  }

  const total = urls.length
  let successCount = 0
  let failCount = 0

  uni.showLoading({
    title: `准备下载 ${total} 个文件...`,
    mask: true,
  })

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]

    uni.showLoading({
      title: `正在下载 ${i + 1}/${total}...`,
      mask: true,
    })

    try {
      await new Promise<void>((resolve) => {
        uni.downloadFile({
          url: url,
          success: (res) => {
            if (res.statusCode === 200) {
              const tempFilePath = res.tempFilePath

              if (typeof window !== 'undefined') {
                const link = document.createElement('a')
                link.href = tempFilePath
                const defaultFileName = url.split('/').pop() || `download_${i + 1}`
                const decodedFileName = decodeURIComponent(defaultFileName)
                link.download = decodedFileName
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                successCount++
                console.log(`文件 ${i + 1} 下载成功`)
                resolve()
              } else {
                uni.saveFile({
                  tempFilePath: tempFilePath,
                  success: () => {
                    successCount++
                    console.log(`文件 ${i + 1} 下载成功`)
                    resolve()
                  },
                  fail: (err) => {
                    failCount++
                    console.error(`文件 ${i + 1} 保存失败:`, err)
                    resolve()
                  },
                })
              }
            } else {
              failCount++
              console.error(`文件 ${i + 1} 下载失败，状态码:`, res.statusCode)
              resolve()
            }
          },
          fail: (err) => {
            failCount++
            console.error(`文件 ${i + 1} 下载失败:`, err)
            resolve()
          },
        })
      })
    } catch (error) {
      failCount++
      console.error(`文件 ${i + 1} 下载异常:`, error)
    }
  }

  uni.hideLoading()

  setTimeout(() => {
    if (failCount === 0) {
      uni.showToast({
        title: `全部下载成功 (${successCount}/${total})`,
        icon: 'success',
        duration: 3000,
      })
    } else if (successCount === 0) {
      uni.showToast({
        title: `全部下载失败`,
        icon: 'none',
        duration: 3000,
      })
    } else {
      uni.showToast({
        title: `下载完成 ${successCount}/${total}，失败 ${failCount}`,
        icon: 'none',
        duration: 3000,
      })
    }
  }, 300)
}

export { downloadFile, downloadMultipleFiles }
export type { DownloadOptions }

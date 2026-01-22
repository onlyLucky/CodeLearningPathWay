export function setRem() {
  const baseSize = 100
  const _designWidth = 1920
  const clientWidth = document.documentElement.clientWidth
  
  let fontSize: number

  if (clientWidth >= 3840) {
    fontSize = baseSize * 2
  } else if (clientWidth >= 2560) {
    fontSize = baseSize * 1.333
  } else if (clientWidth >= 1920) {
    fontSize = baseSize
  } else if (clientWidth >= 1600) {
    fontSize = baseSize * 0.8333
  } else if (clientWidth >= 1440) {
    fontSize = baseSize * 0.75
  } else if (clientWidth >= 1366) {
    fontSize = baseSize * 0.7115
  } else if (clientWidth >= 1280) {
    fontSize = baseSize * 0.6667
  } else if (clientWidth >= 1024) {
    fontSize = baseSize * 0.5333
  } else {
    fontSize = baseSize * 0.5
  }

  document.documentElement.style.fontSize = fontSize + 'px'
}

function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return function(this: any, ...args: any[]) {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, wait)
  }
}

export const initRem = () => {
  setRem()
  window.addEventListener('resize', debounce(setRem, 100))
}

export const getCurrentRem = () => {
  return parseFloat(getComputedStyle(document.documentElement).fontSize)
}

export const pxToRem = (px: number): number => {
  const currentRem = getCurrentRem()
  return px / currentRem
}

export const remToPx = (rem: number): number => {
  const currentRem = getCurrentRem()
  return rem * currentRem
}

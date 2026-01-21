export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  const pad = (num: number) => num.toString().padStart(2, '0')

  if (hours > 0) {
    return `${pad(hours)}:${pad(minutes)}:${pad(secs)}`
  }
  return `${pad(minutes)}:${pad(secs)}`
}

export function formatDateTime(
  dateTime: string | Date | number,
  format: string = 'YYYY/MM/DD hh:mm'
): string {
  if (!dateTime) return ''
  const date = new Date(dateTime)
  if (isNaN(date.getTime())) return ''

  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = date.getHours()
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()

  const pad = (num: number) => num.toString().padStart(2, '0')

  const formatMap: Record<string, string> = {
    YYYY: year.toString(),
    YY: year.toString().slice(-2),
    MM: pad(month),
    DD: pad(day),
    hh: pad(hours),
    mm: pad(minutes),
    ss: pad(seconds),
  }

  return format.replace(/YYYY|YY|MM|DD|hh|mm|ss/g, (match) => formatMap[match] || match)
}

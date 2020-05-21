export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ':' + time.getMinutes() + ':00'

  const year = date.getFullYear()
  const month = date.getMonth() + 1 //starts at zero, so add one
  const day = date.getDate()
  const dateString = year + '-' + month + '-' + day

  return new Date(dateString + ' ' + timeString)
}

import { IActivity, IAttendee } from '../models/activity'
import { IUser } from '../models/user'

export const combineDateAndTime = (date: Date, time: Date) => {
  const timeString = time.getHours() + ':' + time.getMinutes() + ':00'

  const year = date.getFullYear()
  const month = date.getMonth() + 1 //starts at zero, so add one
  const day = date.getDate()
  const dateString = year + '-' + month + '-' + day

  return new Date(dateString + ' ' + timeString)
}

export const setActivityProps = (activity: IActivity, user: IUser) => {
  activity.date = new Date(activity.date)
  activity.isGoing = activity.attendees.some(
    (a) => a.userName === user.userName
  )
  activity.isHost = activity.attendees.some(
    (a) => a.userName === user.userName && a.isHost
  )

  return activity
}

export const createAttendee = (user: IUser): IAttendee => {
  return {
    userName: user.userName,
    displayName: user.displayName,
    image: user.image || null,
    isHost: false
  }
}
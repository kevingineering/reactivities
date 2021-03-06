import { observable, action, computed, runInAction, reaction, toJS } from 'mobx'
import { SyntheticEvent } from 'react'
import { toast } from 'react-toastify'
import { IActivity } from '../models/activity'
import agent from '../httpAgent'
import { history } from '../../index'
import RootStore from './rootStore'
import { setActivityProps, createAttendee } from '../utilityFunctions/util'
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from '@microsoft/signalr'
import jwt from 'jsonwebtoken'

const LIMIT = 2

export default class ActivityStore {
  //create rootstore property and add include in constructor - used to add ActivityStore to root
  rootStore: RootStore
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore

    reaction(
      () => this.predicate.keys(),
      () => {
        this.page = 0
        this.activityRegistry.clear()
        this.loadActivities()
      }
    )
  }

  //dynamic keyed observable map - list of activities from database
  @observable activityRegistry = new Map()
  //single activity set when 'View' button is clicked
  @observable currentActivity: IActivity | null = null
  //used when page first loads
  @observable isLoadingInitial = false
  //used when 'Submit' button is clicked on activity form
  @observable isSubmitting = false
  //target determines which button has been clicked
  @observable target = ''
  //general loading, used for attend/unattend
  @observable isLoading = false
  //SignalR - we don't want whole class to be observed, just reference
  @observable.ref hubConnection: HubConnection | null = null
  @observable activityCount = 0
  @observable page = 0
  @observable predicate = new Map()

  @action setPredicate = (predicate: string, value: string | Date) => {
    this.predicate.clear()
    if (predicate !== 'all') {
      this.predicate.set(predicate, value)
    }
  }

  @computed get axiosParams() {
    //URLSearchParams is interface that defines utility methods to work with query string of URL
    const params = new URLSearchParams()
    params.append('limit', String(LIMIT))
    params.append('offset', `${this.page ? this.page * LIMIT : 0}`)
    this.predicate.forEach((value, key) => {
      if (key === 'startDate') {
        params.append(key, value.toISOString())
      } else {
        params.append(key, value)
      }
    })
    return params
  }

  @computed get totalPages() {
    return Math.ceil(this.activityCount / LIMIT)
  }

  @action setPage = (page: number) => {
    this.page = page
  }

  checkTokenAndRefreshIfExpired = async () => {
    const token = localStorage.getItem('jwt')
    const refreshToken = localStorage.getItem('refreshToken')
    if (token && refreshToken) {
      const decodedToken: any = jwt.decode(token)
      console.log(decodedToken)
      if (decodedToken && Date.now() >= decodedToken.exp * 1000 - 5000) {
        try {
          return await agent.Users.refreshToken(token, refreshToken)
        } catch (error) {
          toast.error('Problem connecting to chat.')
        }
      } else {
        return token
      }
    }
  }

  @action createHubConnection = (activityId: string) => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(process.env.REACT_APP_CHAT_URL!, {
        //string containing access token - usually we get token from Http header, but with signalR we get it from query string (different protocol)
        accessTokenFactory: () => this.checkTokenAndRefreshIfExpired(),
      })
      .configureLogging(LogLevel.Information)
      .build()

    //start connection
    this.hubConnection
      .start()
      .then(() => {
        if (this.hubConnection!.state === 'Connected') {
          this.hubConnection!.invoke('AddToGroup', activityId)
        }
      })
      .catch((error) => console.log(error))

    //creates handler for when comment received
    //note ReceiveComment matches ChatHub
    this.hubConnection.on('ReceiveComment', (comment) => {
      runInAction('receiveComment', () =>
        this.currentActivity!.comments.push(comment)
      )
    })

    this.hubConnection.on('Send', (message) => {
      toast.info(message)
    })
  }

  @action stopHubConnection = () => {
    this.hubConnection!.invoke(
      'RemoveFromGroup',
      this.currentActivity!.id
    ).then(() => this.hubConnection!.stop())
    // .then(() => console.log('Connection stopped.'))
    // .catch((err) => console.log(err))
  }

  @action addComment = async (values: any) => {
    try {
      //add activity id to values
      values.activityId = this.currentActivity!.id

      //invoke method on SignalR API and pass values
      //note that this does not return anything, instead a new 'ReceiveComment' event will occur
      await this.hubConnection!.invoke('SendComment', values)
    } catch (error) {
      console.log(error)
    }
    this.hubConnection?.send('')
  }

  //sorts activities by date
  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    )
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    )

    //BREAKDOWN OF STEPS

    //Object.entries produces an array of [string, IActivity]
    // console.log('Object.entries(): ', Object.entries(sortedActivities))
    //creates array of key(date)-value(activity[]) pairs
    // console.log('sortedActivities.reduce(): ', sortedActivities
    //.reduce function creates accumulator from array by looking at each piece (currentValue) one at a time
    // .reduce(
    //   //callback function
    //   (accumulator, currentValue) => {
    //     //remove time from date
    //     const date = currentValue.date.split('T')[0]
    //     //compare dates and add to array if they match
    //     accumulator[date] = accumulator[date] ? [...accumulator[date], currentValue] : [currentValue]
    //     return accumulator
    //   }
    //   //initial value - key is activity date, and array is an array of activities
    //   , {} as {[key: string]: IActivity[]}
    // ))

    return Object.entries(
      sortedActivities.reduce((accumulator, currentValue) => {
        const date = currentValue.date.toISOString().split('T')[0]
        accumulator[date] = accumulator[date]
          ? [...accumulator[date], currentValue]
          : [currentValue]
        return accumulator
      }, {} as { [key: string]: IActivity[] })
    )

    // return sortedActivities
  }

  @action loadActivities = async () => {
    try {
      this.isLoadingInitial = true
      const activitiesEnvelope = await agent.Activities.list(this.axiosParams)
      const { activities, activityCount } = activitiesEnvelope
      //runInAction is required anytime we have an async operation, anything after that is seen as a new expression
      runInAction('load activities', () => {
        activities.forEach((activity) => {
          activity = setActivityProps(activity, this.rootStore.userStore.user!)
          this.activityRegistry.set(activity.id, activity)
          this.activityCount = activityCount
          this.isLoadingInitial = false
        })
      })
      // console.log(this.groupActivitiesByDate(activities))
    } catch (error) {
      runInAction('load activities error', () => {
        this.isLoadingInitial = false
      })
    }
  }

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id)
    if (activity) {
      this.currentActivity = activity
      return toJS(activity) //converts observable to JavaScript object
    } else {
      try {
        this.isLoadingInitial = true
        activity = await agent.Activities.details(id)
        runInAction('load activity', () => {
          activity = setActivityProps(activity, this.rootStore.userStore.user!)
          this.currentActivity = activity
          this.activityRegistry.set(activity.id, activity)
          this.isLoadingInitial = false
        })
        return activity
      } catch (error) {
        runInAction('load activity error', () => {
          this.isLoadingInitial = false
        })
      }
    }
  }

  //returns an activity (if one exists) or undefined
  //activity will be undefined if user navigates directly to a specific activity page
  getActivity = (id: string) => {
    return this.activityRegistry.get(id)
  }

  @action createActivity = async (activity: IActivity) => {
    try {
      this.isSubmitting = true
      await agent.Activities.create(activity)
      const attendee = createAttendee(this.rootStore.userStore.user!)
      attendee.isHost = true
      let attendees = [attendee]
      activity.attendees = attendees
      activity.isHost = true
      activity.isGoing = true
      activity.comments = []
      runInAction('create activity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.isSubmitting = false
      })
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction('create activity error', () => {
        this.isSubmitting = false
        toast.error(error.response.data.title)
      })
    }
  }

  @action editActivity = async (activity: IActivity) => {
    try {
      this.isSubmitting = true
      await agent.Activities.edit(activity)
      runInAction('edit activity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.currentActivity = activity
        this.isSubmitting = false
      })
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction('edit activity error', () => {
        this.isSubmitting = false
        toast.error(error.response.title)
      })
    }
  }

  @action deleteActivity = async (
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    try {
      this.isSubmitting = true
      this.target = e.currentTarget.name
      await agent.Activities.delete(id)
      runInAction('delete activity', () => {
        this.activityRegistry.delete(id)
        this.isSubmitting = false
        this.target = ''
      })
    } catch (error) {
      runInAction('delete activity error', () => {
        this.isSubmitting = false
        this.target = ''
      })
    }
  }

  @action attendActivity = async () => {
    try {
      this.isLoading = true
      await agent.Activities.attend(this.currentActivity!.id)
      runInAction('attend activity', () => {
        //create attendee, push to activity attendees array, set is going to true, and update activity registry
        const attendee = createAttendee(this.rootStore.userStore.user!)
        if (this.currentActivity) {
          this.currentActivity.attendees.push(attendee)
          this.currentActivity.isGoing = true
          this.activityRegistry.set(
            this.currentActivity.id,
            this.currentActivity
          )
          this.isLoading = false
        }
      })
    } catch (error) {
      runInAction('attend activity error', () => {
        this.isLoading = false
      })
      toast.error('Problem signing up for activity.')
    }
  }

  @action unattendActivity = async () => {
    try {
      this.isLoading = true
      await agent.Activities.unattend(this.currentActivity!.id)
      runInAction('unattend activity', () => {
        //remove attendee, remove from activity attendees array, set is going to false, and update activity registry
        if (this.currentActivity) {
          this.currentActivity.attendees = this.currentActivity.attendees.filter(
            (a) => a.userName !== this.rootStore.userStore.user?.userName
          )
          this.currentActivity.isGoing = false
          this.activityRegistry.set(
            this.currentActivity.id,
            this.currentActivity
          )
          this.isLoading = false
        }
      })
    } catch (error) {
      runInAction('unattend activity error', () => {
        this.isLoading = false
        toast.error('Problem cancelling attendance.')
      })
    }
  }

  @action clearActivity = () => {
    this.currentActivity = null
  }
}

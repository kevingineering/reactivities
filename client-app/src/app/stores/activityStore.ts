import { observable, action, computed, runInAction } from 'mobx'
import { SyntheticEvent } from 'react'
import { toast } from 'react-toastify'
import { IActivity } from '../models/Activity'
import agent from '../httpAgent'
import { history } from '../../index'
import RootStore from './rootStore'

export default class ActivityStore {
  //create rootstore property and add include in constructor - used to add ActivityStore to root
  rootStore: RootStore
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  //dynamic keyed observable map - list of activities from database
  @observable activityRegistry = new Map()
  //single activity set when 'View' button is clicked
  @observable currentActivity: IActivity | null = null
  //used when page first loads
  @observable loadingInitial = false
  //used when 'Submit' button is clicked on activity form
  @observable submitting = false
  //target determines which button has been clicked
  @observable target = ''

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
      this.loadingInitial = true
      const activities = await agent.Activities.list()
      //runInAction is required anytime we have an async operation, anything after that is seen as a new expression
      runInAction('load activities', () => {
        activities.forEach((activity) => {
          activity.date = new Date(activity.date)
          this.activityRegistry.set(activity.id, activity)
        })
        this.loadingInitial = false
      })
      // console.log(this.groupActivitiesByDate(activities))
    } catch (error) {
      runInAction('load activities error', () => {
        this.loadingInitial = false
      })
    }
  }

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id)
    if (activity) {
      this.currentActivity = activity
      return activity
    } else {
      try {
        this.loadingInitial = true
        activity = await agent.Activities.details(id)
        runInAction('load activity', () => {
          activity.date = new Date(activity.date)
          this.currentActivity = activity
          this.activityRegistry.set(activity.id, activity)
          this.loadingInitial = false
        })
        return activity
      } catch (error) {
        runInAction('load activity error', () => {
          this.loadingInitial = false
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
      this.submitting = true
      await agent.Activities.create(activity)
      runInAction('create activity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.submitting = false
      })
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction('create activity error', () => {
        this.submitting = false
        toast.error(error.response.data.title)
      })
    }
  }

  @action editActivity = async (activity: IActivity) => {
    try {
      this.submitting = true
      await agent.Activities.edit(activity)
      runInAction('edit activity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.currentActivity = activity
        this.submitting = false
      })
      history.push(`/activities/${activity.id}`)
    } catch (error) {
      runInAction('edit activity error', () => {
        this.submitting = false
        toast.error(error.response.title)
      })
    }
  }

  @action deleteActivity = async (
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    try {
      this.submitting = true
      this.target = e.currentTarget.name
      await agent.Activities.delete(id)
      runInAction('delete activity', () => {
        this.activityRegistry.delete(id)
        this.submitting = false
        this.target = ''
      })
    } catch (error) {
      runInAction('delete activity error', () => {
        this.submitting = false
        this.target = ''
      })
    }
  }

  @action clearActivity = () => {
    this.currentActivity = null
  }
}

import { observable, action, computed, configure, runInAction } from 'mobx'
import { createContext, SyntheticEvent } from 'react'
import { IActivity } from '../models/Activity'
import agent from '../api/agent'

//ensures you cannot mutate state outside of an action
configure({ enforceActions: 'always' })
//async-await schedules new functions that are not covered by an action decorator
//@action decorator wraps functions with transaction to prevent state issues

class ActivityStore {
  //dynamic keyed observable map - list of activities from database
  @observable activityRegistry = new Map()
  //single activity set when 'View' button is clicked
  @observable activity: IActivity | null = null
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
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
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
        const date = currentValue.date.split('T')[0]
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
      runInAction('load activities', () => {
        activities.forEach((activity) => {
          activity.date = activity.date.split('.')[0]
          this.activityRegistry.set(activity.id, activity)
        })
        this.loadingInitial = false
      })
      // console.log(this.groupActivitiesByDate(activities))
    } catch (error) {
      runInAction('load activities error', () => {
        this.loadingInitial = false
        console.log(error)
      })
    }
  }

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id)
    if (activity) {
      this.activity = activity
    } else {
      try {
        this.loadingInitial = true
        activity = await agent.Activities.details(id)
        runInAction('load activity', () => {
          activity.date = activity.date.split('.')[0]
          this.activity = activity
          this.loadingInitial = false
        })
      } catch (error) {
        runInAction('load activity error', () => {
          this.loadingInitial = false
          console.log(error)
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
    } catch (error) {
      runInAction('create activity error', () => {
        this.submitting = false
        console.log(error)
      })
    }
  }

  @action editActivity = async (activity: IActivity) => {
    try {
      this.submitting = true
      await agent.Activities.edit(activity)
      runInAction('edit activity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.activity = activity
        this.submitting = false
      })
    } catch (error) {
      runInAction('edit activity error', () => {
        this.submitting = false
        console.log(error)
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
        console.log(error)
        this.target = ''
      })
    }
  }

  @action clearActivity = () => {
    this.activity = null
  }
}

export default createContext(new ActivityStore())

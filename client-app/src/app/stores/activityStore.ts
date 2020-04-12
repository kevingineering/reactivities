import { observable, action, computed, configure, runInAction } from 'mobx'
import { createContext, SyntheticEvent } from 'react'
import { IActivity } from '../models/Activity'
import agent from '../api/agent'

//ensures you cannot mutate state outside of an action
configure({enforceActions: 'always'})
//async-await schedules new functions that are not covered by an action decorator
//@action decorator wraps functions with transaction to prevent state issues

class ActivityStore {
  //dynamic keyed observable map - 
  @observable activityRegistry = new Map()
  //list of activities from database
  @observable activities: IActivity[] = []
  //single activity set when 'View' button is clicked
  @observable activity: IActivity | undefined
  //used when page first loads
  @observable loadingInitial = false
  //used when
  @observable editMode = false
  //used when 'Submit' button is clicked on activity form
  @observable submitting = false
  //target determines which button has been clicked
  @observable target = ''

  //sorts activities by date
  @computed get activitiesByDate() {
    return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
  }

  @action loadActivities = async () => {
    try {
      this.loadingInitial = true
      const activities = await agent.Activities.list()
      runInAction('load activities', () => {
        activities.forEach(activity => {
          activity.date = activity.date.split('.')[0]
          this.activityRegistry.set(activity.id, activity)
        })
        this.loadingInitial = false

      })
    } catch (error) {
      runInAction('load activities error', () => {
        this.loadingInitial = false
        console.log(error)
      })
    }
  }

  @action createActivity = async (activity: IActivity) => {
    try {
      this.submitting = true
      await agent.Activities.create(activity)
      runInAction('create activity', () => {
        this.activityRegistry.set(activity.id, activity)
        this.selectActivity(activity.id)
        this.editMode = false
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
        this.editMode = false
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

  @action selectActivity = (id: string) => {
    this.activity = this.activityRegistry.get(id)
    this.editMode = false
  }

  @action openCreateForm = () => {
    this.activity = undefined
    this.editMode = true
  }

  @action setEditMode = (val: boolean) => {
    this.editMode = val
  }
}

export default createContext(new ActivityStore())

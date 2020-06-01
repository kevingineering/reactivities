import { createContext } from 'react'
import { configure } from 'mobx'
import UserStore from './userStore'
import ActivityStore from './activityStore'
import CommonStore from './commonStore'
import ModalStore from './modalStore'
import ProfileStore from './profileStore'

//ensures you cannot mutate state outside of an action
configure({ enforceActions: 'always' })
//async-await schedules new functions that are not covered by an action decorator
//@action decorator wraps functions with transaction to prevent state issues

export default class RootStore {
  activityStore: ActivityStore
  userStore: UserStore
  commonStore: CommonStore
  modalStore: ModalStore
  profileStore: ProfileStore

  constructor() {
    this.activityStore = new ActivityStore(this)
    this.userStore = new UserStore(this)
    this.commonStore = new CommonStore(this)
    this.modalStore = new ModalStore(this)
    this.profileStore = new ProfileStore(this)
  }
}

export const RootStoreContext = createContext(new RootStore())

import { observable, action, computed, runInAction } from 'mobx'
import { IUser, IUserFormValues } from '../models/User'
import agent from '../httpAgent'
import RootStore from './rootStore'
import { history } from '../../index'

export default class UserStore {
  //create rootstore property and add include in constructor - used to add UserStore to root
  rootStore: RootStore
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
  }

  @observable user: IUser | null = null

  @computed get isLoggedIn() {
    return !!this.user
  }

  @action login = async (values: IUserFormValues) => {
    try {
      //attempt to login user
      const loginUser = await agent.Users.login(values)
      //set user in store
      runInAction('login', () => {
        this.user = loginUser
      })
      //set token in local storage
      runInAction('setToken', () => {
        this.rootStore.commonStore.setToken(loginUser.token)
      })
      //close modal
      this.rootStore.modalStore.closeModal()
      //redirect
      history.push('/activities')
    } catch (error) {
      throw error //and catch in login component
    }
  }

  @action logout = () => {
    //clear token from storage
    this.rootStore.commonStore.setToken(null)
    //clear user
    this.user = null
    //redirect
    history.push('/')
  }

  @action register = async (values: IUserFormValues) => {
    try {
      //attempt to register user
      const newUser = await agent.Users.register(values)
      //set user in store
      runInAction('register', () => {
        this.user = newUser
      })
      //set token in local storage
      runInAction('setToken', () => {
        this.rootStore.commonStore.setToken(newUser.token)
      })
      //close modal
      this.rootStore.modalStore.closeModal()
      //redirect
      history.push('/activities')
    } catch (error) {
      throw error //and catch in register component
    }
  }

  @action getUser = async () => {
    try {
      //get user from token
      const user = await agent.Users.currentUser()
      //set store user
      runInAction('getUser', () => {
        this.user = user
      })
    } catch (error) {
      console.log(error)
    }
  }
}

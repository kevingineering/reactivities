import { observable, action, reaction } from 'mobx'
import RootStore from './rootStore'

export default class CommonStore {
  rootStore: RootStore
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore

    //reaction automatically reacts to observables
    //this automatically adds/removes token to/from local storage
    reaction(
      () => this.token,
      (token) => {
        if (token) {
          window.localStorage.setItem('jwt', token)
        } else {
          window.localStorage.removeItem('jwt')
        }
      }
    )

    reaction(
      () => this.refreshToken,
      (refreshToken) => {
        if (refreshToken) {
          window.localStorage.setItem('refreshToken', refreshToken)
        } else {
          window.localStorage.removeItem('refreshToken')
        }
      }
    )
  }

  @observable token: string | null = window.localStorage.getItem('jwt')
  @observable refreshToken: string | null = window.localStorage.getItem(
    'refreshToken'
  )
  @observable isAppLoaded: boolean = false

  //add token to local storage
  @action setToken = (token: string | null) => {
    this.token = token
  }

  @action setRefreshToken = (refreshToken: string | null) => {
    this.refreshToken = refreshToken
  }

  @action setAppLoaded = () => {
    this.isAppLoaded = true
  }
}

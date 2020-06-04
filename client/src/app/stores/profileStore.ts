import { observable, action, computed, runInAction, reaction } from 'mobx'
import agent from '../httpAgent'
import RootStore from './rootStore'
import { IProfile, IPhoto } from '../models/profile'
import { toast } from 'react-toastify'

export default class ProfileStore {
  rootStore: RootStore
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore

    reaction(
      () => this.activeTab,
      (activeTab) => {
        if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? 'followers' : 'followings'
          this.listFollowings(predicate)
        } else {
          this.followings = []
        }
      }
    )
  }

  @observable profile: IProfile | null = null
  @observable followings: IProfile[] = []
  @observable activeTab: number = 0
  @observable isLoadingProfile = true
  @observable isUploadingPhoto = false
  @observable isSettingMain = false
  @observable isDeletingPhoto = false
  @observable isLoadingFollowing = false
  @observable isListingFollowing = false

  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.userName === this.profile.userName
    } else {
      return false
    }
  }

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex
  }

  @action getProfile = async (userName: string) => {
    try {
      this.isLoadingProfile = true
      //get profile
      const loadedProfile = await agent.Profiles.get(userName)
      //set profile in store
      runInAction('getProfile', () => {
        this.profile = loadedProfile
        this.isLoadingProfile = false
      })
    } catch (error) {
      runInAction('profileError', () => {
        this.isLoadingProfile = false
      })
      console.log(error)
    }
  }

  @action uploadPhoto = async (file: Blob) => {
    try {
      //set loading to true and upload photo to API
      this.isUploadingPhoto = true
      const photo = await agent.Profiles.uploadPhoto(file)
      runInAction('uploadPhoto', () => {
        //add photo to photos array and set photo as main image if isMain
        if (this.profile) {
          this.profile.photos.push(photo)
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url
            this.profile.image = photo.url
          }
        }
        this.isUploadingPhoto = false
      })
    } catch (error) {
      console.log(error)
      toast.error('Problem uploading photo.')
      runInAction('uploadPhoto', () => {
        this.isUploadingPhoto = false
      })
    }
  }

  @action setMainPhoto = async (photo: IPhoto) => {
    try {
      this.isSettingMain = true
      await agent.Profiles.setMainPhoto(photo.id)
      runInAction('setMainPhoto', () => {
        if (this.profile && this.rootStore.userStore.user) {
          this.rootStore.userStore.user.image = photo.url
          this.profile.photos.find((a) => a.isMain)!.isMain = false
          this.profile.photos.find((a) => a.id === photo.id)!.isMain = true
          this.profile.image = photo.url
        }
        this.isSettingMain = false
      })
    } catch (error) {
      console.log(error)
      toast.error('Problem setting photo as main.')
      runInAction('setmain', () => {
        this.isSettingMain = false
      })
    }
  }

  @action deletePhoto = async (photo: IPhoto) => {
    try {
      this.isDeletingPhoto = true
      await agent.Profiles.deletePhoto(photo.id)
      runInAction('deletePhoto', () => {
        if (this.profile) {
          this.profile.photos = this.profile.photos.filter(
            (a) => a.id !== photo.id
          )
        }
        this.isDeletingPhoto = false
      })
    } catch (error) {
      console.log(error)
      if (photo.isMain) {
        toast.error('You cannot delete your main photo.')
      } else {
        toast.error('Probelm deleting photo.')
      }
      runInAction('deletePhoto', () => {
        this.isDeletingPhoto = false
      })
    }
  }

  @action update = async (profile: IProfile) => {
    try {
      await agent.Profiles.update(profile)
      runInAction('updateProfile', () => {
        if (
          profile.displayName !== this.rootStore.userStore.user!.displayName
        ) {
          this.rootStore.userStore.user!.displayName = profile.displayName!
        }
        this.profile!.displayName = profile.displayName!
        this.profile!.bio = profile.bio!
      })
    } catch (error) {
      console.log(error)
      toast.error('Problem updating profile.')
    }
  }

  @action follow = async (userName: string) => {
    try {
      this.isLoadingFollowing = true
      await agent.Profiles.follow(userName)
      runInAction('follow', () => {
        this.profile!.isFollowing = true
        this.profile!.followersCount++
        this.isLoadingFollowing = false
      })
    } catch (error) {
      toast.error('Problem following user.')
      runInAction('follow', () => {
        this.isLoadingFollowing = false
      })
    }
  }

  @action unfollow = async (userName: string) => {
    try {
      this.isLoadingFollowing = true
      await agent.Profiles.unfollow(userName)
      runInAction('follow', () => {
        this.profile!.isFollowing = false
        this.profile!.followersCount--
        this.isLoadingFollowing = false
      })
    } catch (error) {
      console.log(error)
      toast.error('Problem unfollowing user.')
      runInAction('follow', () => {
        this.isLoadingFollowing = false
      })
    }
  }

  @action listFollowings = async (predicate: string) => {
    try {
      this.isListingFollowing = true
      const followingList = await agent.Profiles.listFollowings(
        this.profile!.userName,
        predicate
      )
      runInAction('listFollowing', () => {
        this.followings = followingList
        this.isListingFollowing = false
      })
    } catch (error) {
      console.log(error)
      runInAction('listFollowing', () => {
        this.isListingFollowing = false
      })
    }
  }
}

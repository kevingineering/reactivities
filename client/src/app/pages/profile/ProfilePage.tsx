import React, { useContext, useEffect } from 'react'
import ProfileHeader from './ProfileHeader'
import { Grid } from 'semantic-ui-react'
import ProfileContent from './ProfileContent'
import { RootStoreContext } from '../../stores/rootStore'
import { RouteComponentProps } from 'react-router-dom'
import LoadingComponent from '../../sharedComponents/LoadingComponent'
import { observer } from 'mobx-react-lite'

interface ProfileParams {
  userName: string
}

const ProfilePage: React.FC<RouteComponentProps<ProfileParams>> = (props) => {
  const rootStore = useContext(RootStoreContext)
  const { isLoadingProfile, profile, getProfile } = rootStore.profileStore

  useEffect(() => {
    getProfile(props.match.params.userName)
    //eslint-disable-next-line
  }, [])

  if (isLoadingProfile) return <LoadingComponent content="Loading profile..." />

  if(profile == null) return <h2>Not Found</h2>
  
  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile}/>
        <ProfileContent profile={profile}/>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ProfilePage)

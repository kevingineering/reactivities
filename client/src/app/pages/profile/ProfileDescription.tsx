import React, { useState, useContext } from 'react'
import { Tab, Grid, Header, Button } from 'semantic-ui-react'
import { RootStoreContext } from '../../stores/rootStore'
import { observer } from 'mobx-react-lite'
import ProfileEditForm from './ProfileEditForm'



const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext)
  const {
    profile,
    isCurrentUser,
    update,
  } = rootStore.profileStore

  const [isEditProfileMode, setIsEditProfileMode] = useState(false)

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16} style={{ paddingBottom: 0 }}>
          <Header
            floated="left"
            icon="user"
            content={`About ${profile?.displayName}`}
          />
          {isCurrentUser && (
            <Button
              floated="right"
              basic
              content={isEditProfileMode ? 'Cancel' : 'Edit Profile'}
              onClick={() => setIsEditProfileMode((prevState) => !prevState)}
            />
          )}
        </Grid.Column>
        <Grid.Column width={16}>
          {isEditProfileMode ? (
            <ProfileEditForm profile={profile!} update={update} />
          ) : (
            <p>{profile?.bio}</p>
          )}
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
}

export default observer(ProfileDescription)

import React, { useContext } from 'react'
import { Tab, Grid, Header, Card } from 'semantic-ui-react'
import ProfileCard from './ProfileCard'
import { RootStoreContext } from '../../stores/rootStore'
import { observer } from 'mobx-react-lite'

const ProfileFollowings = () => {
  const rootStore = useContext(RootStoreContext)
  const { profile, followings, isListingFollowing, activeTab } = rootStore.profileStore

  return (
    <Tab.Pane loading={isListingFollowing}>
      <Grid>
        <Grid.Column width={16}>
          <Header
            floated="left"
            icon="user"
            content={
              activeTab === 3
                ? `People following ${profile!.displayName}`
                : `People ${profile!.displayName} is following`
            }
          />
        </Grid.Column>
        <Grid.Column width={16}>
          <Card.Group itemsPerRow={5}>
            {followings.map((user) => (
              <ProfileCard key={user.userName} profile={user} />
            ))}
          </Card.Group>
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  )
}

export default observer(ProfileFollowings)

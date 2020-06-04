import React from 'react'
import {
  Segment,
  Item,
  Header,
  Button,
  Grid,
  Statistic,
  Divider,
  Reveal,
} from 'semantic-ui-react'
import { IProfile } from '../../models/profile'
import { observer } from 'mobx-react-lite'

interface IProps {
  profile: IProfile
  follow: (userName: string) => void
  unfollow: (userName: string) => void
  isCurrentUser: boolean
  isLoadingFollowing: boolean
}

const ProfileHeader: React.FC<IProps> = ({
  profile,
  follow,
  unfollow,
  isCurrentUser,
  isLoadingFollowing,
}) => {
  return (
    <Segment>
      <Grid>
        <Grid.Column width={12}>
          <Item.Group>
            <Item>
              <Item.Image
                avatar
                size="small"
                src={profile.image || '/assets/user.png'}
              />
              <Item.Content verticalAlign="middle">
                <Header as="h1">{profile.displayName}</Header>
              </Item.Content>
            </Item>
          </Item.Group>
        </Grid.Column>
        <Grid.Column width={4}>
          <Statistic.Group widths={2}>
            <Statistic
              label={profile.followersCount === 1 ? 'Follower' : 'Followers'}
              value={profile.followersCount || 0}
            />
            <Statistic label="Following" value={profile.followingCount || 0} />
          </Statistic.Group>
          <Divider />
          {!isCurrentUser && (
            <Reveal animated="move">
              <Reveal.Content visible style={{ width: '100%' }}>
                <Button
                  fluid
                  color="teal"
                  content={profile.isFollowing ? 'Following' : 'Not Following'}
                />
              </Reveal.Content>
              <Reveal.Content hidden>
                <Button
                  fluid
                  basic
                  color={profile.isFollowing ? 'red' : 'green'}
                  content={profile.isFollowing ? 'Unfollow' : 'Follow'}
                  onClick={
                    profile.isFollowing
                      ? () => unfollow(profile.userName)
                      : () => follow(profile.userName)
                  }
                  disabled={isCurrentUser}
                  loading={isLoadingFollowing}
                />
              </Reveal.Content>
            </Reveal>
          )}
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default observer(ProfileHeader)

import React, { Fragment } from 'react'
import { Segment, List, Item, Label, Image } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { IAttendee } from '../../models/activity'
import { observer } from 'mobx-react-lite'

interface IProps {
  attendees: IAttendee[]
}

const ActivityDetailedSidebar: React.FC<IProps> = ({ attendees }) => {
  const count = attendees.length

  const attendeeList = attendees.map((a) => (
    <Item style={{ position: 'relative' }} key={a.userName}>
      {a.isHost && (
        <Label style={{ position: 'absolute' }} color="orange" ribbon="right">
          Host
        </Label>
      )}
      <Image size="tiny" src={a.image || '/assets/user.png'} />
      <Item.Content verticalAlign="middle">
        <Item.Header as="h3">
          <Link to={`/profile/${a.userName}`}>{a.displayName}</Link>
        </Item.Header>
        {a.isFollowing && (
          <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
        )}
      </Item.Content>
    </Item>
  ))

  return (
    <Fragment>
      <Segment
        textAlign="center"
        style={{ border: 'none' }}
        attached="top"
        secondary
        inverted
        color="teal"
      >
        {count} {count === 1 ? 'Person' : 'People'} Going
      </Segment>
      <Segment attached>
        <List relaxed divided>
          {attendeeList}
        </List>
      </Segment>
    </Fragment>
  )
}

export default observer(ActivityDetailedSidebar)

import React from 'react'
import { List, Image, Popup } from 'semantic-ui-react'
import { IAttendee } from '../../models/activity'

interface IProps {
  attendees: IAttendee[]
}

const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
  const attendeesList = attendees.map((a) => (
    <List.Item key={a.userName}>
      <Popup
        header={a.displayName}
        trigger={
          <Image
            size="mini"
            circular
            src={a.image || '/assets/user.png'}
            style={a.isFollowing ? { border: '2px solid orange' } : {}}
          />
        }
      />
    </List.Item>
  ))

  return <List horizontal>{attendeesList}</List>
}

export default ActivityListItemAttendees

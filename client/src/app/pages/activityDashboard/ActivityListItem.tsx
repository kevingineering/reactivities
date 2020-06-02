import React from 'react'
import { Item, Button, Segment, Icon, Label } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { IActivity } from '../../models/activity'
import ActivityListItemAttendees from './ActivityListItemAttendees'

interface IProps {
  activity: IActivity
}

const ActivityListItem: React.FC<IProps> = ({ activity }) => {
  const host = activity.attendees.filter((a) => a.isHost)[0]
  return (
    <Segment.Group>
      <Segment>
        <Item.Group>
          <Item>
            <Item.Image
              size="tiny"
              circular
              src={host.image || '/assets/user.png'}
              style={{ marginBottom: 5 }} //keeps picture round
            />
            <Item.Content>
              <Item.Header as={Link} to={`activities/${activity.id}`}>
                {activity.title}
              </Item.Header>
              <Item.Description>
                Hosted by
                <Link to={`/profile/${host.userName}`}> {host.displayName}</Link>
              </Item.Description>
              {activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="orange"
                    content="You are hosting this activity."
                  />
                </Item.Description>
              )}
              {activity.isGoing && !activity.isHost && (
                <Item.Description>
                  <Label
                    basic
                    color="green"
                    content="You are attending this activity."
                  />
                </Item.Description>
              )}
            </Item.Content>
          </Item>
        </Item.Group>
      </Segment>
      <Segment>
        <Icon name="clock" />
        {format(activity.date, 'h:mm a')}
        <Icon name="marker" />
        {activity.venue}, {activity.city}
      </Segment>
      <Segment secondary>
        <ActivityListItemAttendees attendees={activity.attendees} />
      </Segment>
      <Segment clearing>
        <span>{activity.description}</span>
        <Button
          as={Link}
          to={`/activities/${activity.id}`}
          floated="right"
          content="View"
          color="blue"
        />
      </Segment>
    </Segment.Group>
  )
}

export default ActivityListItem

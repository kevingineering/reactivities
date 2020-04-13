import React, { useContext } from 'react'
import { Item, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ActivityStore from '../../../app/stores/activityStore'
import ActivityListItem from './ActivityListItem'

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore)
  const { activitiesByDate } = activityStore
  return (
    <React.Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <React.Fragment key={group}>
          <Label size="large" color="blue">
            {group}
          </Label>
          <Item.Group divided>
            {activities.map((activity) => {
              return <ActivityListItem activity={activity} key={activity.id} />
            })}
          </Item.Group>
        </React.Fragment>
      ))}
    </React.Fragment>
  )
}

export default observer(ActivityList)

import React, { useContext } from 'react'
import { Item, Label } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ActivityListItem from './ActivityListItem'
import { RootStoreContext } from '../../stores/rootStore'
import { format } from 'date-fns'

const ActivityList: React.FC = () => {
  const rootStore = useContext(RootStoreContext)
  const { activitiesByDate } = rootStore.activityStore

  return (
    <React.Fragment>
      {activitiesByDate.map(([group, activities]) => (
        <React.Fragment key={group}>
          <Label size="large" color="blue">
            {format(group, 'eeee MMMM do')}
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

import React, { useContext } from 'react'
import { Grid } from 'semantic-ui-react'
import ActivityList from './ActivityList'
import ActivityDetails from '../details/ActivityDetails'
import ActivityForm from '../form/ActivityForm'
import { observer } from 'mobx-react-lite'
import ActivityStore from '../../../app/stores/activityStore'

const ActivityDashboard: React.FC = () => {
  const activityStore = useContext(ActivityStore)
  const {activity, editMode} = activityStore
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        {activity && !editMode && (
          <ActivityDetails />
        )}
        {editMode && (
          <ActivityForm />
        )}
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDashboard)

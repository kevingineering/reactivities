import React, { useEffect, useContext } from 'react'
import { Grid } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ActivityList from '../activityDashboard/ActivityList'
import { RootStoreContext } from '../../stores/rootStore'
import LoadingComponent from '../../sharedComponents/LoadingComponent'

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext)
  const { loadingInitial, loadActivities } = rootStore.activityStore

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  if (loadingInitial)
    return <LoadingComponent content="Loading activities..." />

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList />
      </Grid.Column>
      <Grid.Column width={6}>
        <h2>Activity Filters</h2>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDashboard)

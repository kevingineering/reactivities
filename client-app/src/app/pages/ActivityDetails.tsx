import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ActivityDetailsHeader from './activitySupport/ActivityDetailedHeader'
import ActivityDetailedInfo from './activitySupport/ActivityDetailedInfo'
import ActivityDetailedChats from './activitySupport/ActivityDetailedChats'
import ActivityDetailedSidebar from './activitySupport/ActivityDetailedSidebar'
import { RootStoreContext } from '../stores/rootStore'
import LoadingComponent from '../sharedComponents/LoadingComponent'

interface DetailParams {
  id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = (
  props
) => {
  const rootStore = useContext(RootStoreContext)
  const {
    currentActivity,
    loadActivity,
    loadingInitial,
  } = rootStore.activityStore

  useEffect(() => {
    loadActivity(props.match.params.id)
    //eslint-disable-next-line
  }, [])

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />

  if (!currentActivity) return <h2>Not Found</h2>

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailsHeader activity={currentActivity} />
        <ActivityDetailedInfo activity={currentActivity} />
        <ActivityDetailedChats />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDetails)

import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Grid } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ActivityDetailsHeader from './ActivityDetailedHeader'
import ActivityDetailedInfo from './ActivityDetailedInfo'
import ActivityDetailedChat from './ActivityDetailedChat'
import ActivityDetailedSidebar from './ActivityDetailedSidebar'
import { RootStoreContext } from '../../stores/rootStore'
import LoadingComponent from '../../sharedComponents/LoadingComponent'

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
    isLoadingInitial,
  } = rootStore.activityStore

  useEffect(() => {
    loadActivity(props.match.params.id)
    //eslint-disable-next-line
  }, [])

  if (isLoadingInitial) return <LoadingComponent content="Loading activity..." />

  if (!currentActivity) return <h2>Not Found</h2>

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailsHeader activity={currentActivity} />
        <ActivityDetailedInfo activity={currentActivity} />
        <ActivityDetailedChat id={props.match.params.id}/>
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar attendees={currentActivity.attendees}/>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDetails)

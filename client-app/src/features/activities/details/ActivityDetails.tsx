import React, { useContext, useEffect } from 'react'
import { Grid } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ActivityStore from '../../../app/stores/activityStore'
import { RouteComponentProps } from 'react-router-dom'
import LoadingComponent from '../../../app/layout/LoadingComponent'
import ActivityDetailsHeader from './ActivityDetailedHeader'
import ActivityDetailedInfo from './ActivityDetailedInfo'
import ActivityDetailedChats from './ActivityDetailedChats'
import ActivityDetailedSidebar from './ActivityDetailedSidebar'

interface DetailParams {
  id: string
}

const ActivityDetails: React.FC<RouteComponentProps<DetailParams>> = (
  props
) => {
  const activityStore = useContext(ActivityStore)
  const {
    activity,
    loadActivity,
    loadingInitial,
  } = activityStore

  useEffect(() => {
    loadActivity(props.match.params.id)
    //eslint-disable-next-line
  }, [])

  if (loadingInitial) 
    return <LoadingComponent content="Loading activity..." />
  
  if (!activity)
    return <h2>Not Found</h2>

  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityDetailsHeader activity={activity}/>
        <ActivityDetailedInfo activity={activity}/>
        <ActivityDetailedChats />
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityDetailedSidebar />
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDetails)

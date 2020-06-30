import React, { useEffect, useContext, useState } from 'react'
import { Grid, Loader } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ActivityList from '../activityDashboard/ActivityList'
import { RootStoreContext } from '../../stores/rootStore'
import InfiniteScroll from 'react-infinite-scroller'
import ActivityFilters from './ActivityFilters'
import ActivityListItemPlaceholder from './ActivityListItemPlaceholder'

const ActivityDashboard: React.FC = () => {
  const rootStore = useContext(RootStoreContext)
  const {
    isLoadingInitial,
    loadActivities,
    setPage,
    page,
    totalPages,
  } = rootStore.activityStore
  const [isLoadingNext, setIsLoadingNext] = useState(false)

  const handleGetNext = async () => {
    setIsLoadingNext(true)
    setPage(page + 1)
    await loadActivities()
    setIsLoadingNext(false)
  }

  useEffect(() => {
    loadActivities()
  }, [loadActivities])

  return (
    <Grid>
      <Grid.Column width={10}>
        {isLoadingInitial && page === 0 ? (
          <ActivityListItemPlaceholder />
        ) : (
          <InfiniteScroll
            pageStart={0}
            loadMore={handleGetNext}
            hasMore={!isLoadingNext && page + 1 < totalPages}
            initialLoad={false}
          >
            <ActivityList />
          </InfiniteScroll>
        )}
      </Grid.Column>
      <Grid.Column width={6}>
        <ActivityFilters />
      </Grid.Column>
      <Grid.Column width={10}>
        <Loader active={isLoadingNext} style={{ marginBottom: '10px' }} />
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityDashboard)

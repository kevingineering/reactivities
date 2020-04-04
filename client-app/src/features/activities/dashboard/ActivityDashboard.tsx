import React from 'react'
import { Grid } from 'semantic-ui-react'
import { IActivity } from '../../../app/models/Activity'
import ActivityList from './ActivityList'
import ActivityDetails from '../details/ActivityDetails'
import ActivityForm from '../form/ActivityForm'

interface IProps {
  activities: IActivity[]
  selectActivity: (id: string) => void
  activity: IActivity | null
  editMode: boolean
  setEditMode: (editMode: boolean) => void
  setSelectedActivity: (activity: IActivity | null) => void
  createActivity: (activity: IActivity) => void
  editActivity: (activity: IActivity) => void
  deleteActivity: (id: string) => void
}

const ActivityDashboard: React.FC<IProps> = ({
  activities,
  selectActivity,
  activity,
  editMode,
  setEditMode,
  setSelectedActivity,
  createActivity,
  editActivity,
  deleteActivity
}) => {
  return (
    <Grid>
      <Grid.Column width={10}>
        <ActivityList
          activities={activities}
          selectActivity={selectActivity}
          deleteActivity={deleteActivity}
        />
      </Grid.Column>
      <Grid.Column width={6}>
        {activity && !editMode && (
          <ActivityDetails
            activity={activity}
            setEditMode={setEditMode}
            setSelectedActivity={setSelectedActivity}
          />
        )}
        {editMode && (
          <ActivityForm
            //key causes for to rerender when it changes
            key={activity ? activity.id : 0}
            activity={activity}
            setEditMode={setEditMode}
            createActivity={createActivity}
            editActivity={editActivity}
          />
        )}
      </Grid.Column>
    </Grid>
  )
}

export default ActivityDashboard

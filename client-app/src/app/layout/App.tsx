import React, { useState, useEffect } from 'react'
import { Container } from 'semantic-ui-react'
import axios from 'axios'
import { IActivity } from '../models/Activity'
import Navbar from '../../features/nav/Navbar'
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard'

const App = () => {
  const [activities, setActivities] = useState<IActivity[]>([])
  //selectedActivity can be either an activity or null
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  )
  const [editMode, setEditMode] = useState(false)

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(activity => activity.id === id)[0])
    setEditMode(false)
  }

  const handleOpenCreateForm = () => {
    setSelectedActivity(null)
    setEditMode(true)
  }

  const handleCreateActivity = (activity: IActivity) => {
    setActivities([...activities, activity])
    setSelectedActivity(activity)
    setEditMode(false)
  }

  const handleEditActivity = (activity: IActivity) => {
    setActivities([...activities.filter(a => a.id !== activity.id), activity])
    setSelectedActivity(activity)
    setEditMode(false)
  }

  const handleDeleteActivity = (id: string) => {
    setActivities([...activities.filter(a => a.id !== id)])
  }

  useEffect(() => {
    axios
      .get<IActivity[]>('http://localhost:5000/api/activities')
      .then(response => {
        let activities = [];
        response.data.forEach(activity => {
          activity.date = activity.date.split('.')[0]
          activities.push(activity)
        })
        setActivities(response.data)
      })
  }, [])

  return (
    <React.Fragment>
      <Navbar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          setSelectedActivity={setSelectedActivity}
          activity={selectedActivity}
          editMode={editMode}
          setEditMode={setEditMode}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
        />
      </Container>
    </React.Fragment>
  )
}

export default App

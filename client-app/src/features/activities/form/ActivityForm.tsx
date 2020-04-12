import React, { useState, useContext, FormEvent } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { v4 as uuid } from 'uuid'
import { observer } from 'mobx-react-lite'
import ActivityStore from '../../../app/stores/activityStore'
import { IActivity } from '../../../app/models/Activity'

const ActivityForm: React.FC = () => {
  const activityStore = useContext(ActivityStore)
  const {
    activity: initialActivity,
    setEditMode,
    createActivity,
    editActivity,
    submitting
  } = activityStore

  const initializeForm = (): IActivity => {
    if (initialActivity) {
      return initialActivity
    } else {
      return {
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: ''
      }
    }
  }

  const [activity, setActivity] = useState<IActivity>(initializeForm())

  const handleSubmit = () => {
    if (initialActivity) editActivity(activity)
    else {
      activity.id = uuid()
      createActivity(activity)
    }
  }

  const handleChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setActivity({
      ...activity,
      [event.currentTarget.name]: event.currentTarget.value
    })
  }

  return (
    <Segment clearing>
      <Form>
        <Form.Input
          placeholder="Title"
          name="title"
          value={activity?.title}
          onChange={handleChange}
        />
        <Form.TextArea
          placeholder="Description"
          name="description"
          rows={2}
          value={activity?.description}
          onChange={handleChange}
        />
        <Form.Input
          placeholder="Category"
          name="category"
          value={activity?.category}
          onChange={handleChange}
        />
        <Form.Input
          type="datetime-local"
          placeholder="Date"
          name="date"
          value={activity?.date}
          onChange={handleChange}
        />
        <Form.Input
          placeholder="City"
          name="city"
          value={activity?.city}
          onChange={handleChange}
        />
        <Form.Input
          placeholder="Venue"
          name="venue"
          value={activity?.venue}
          onChange={handleChange}
        />
        <Button
          floated="right"
          positive
          type="button"
          content="Submit"
          onClick={() => handleSubmit()}
          loading={submitting}
        />
        <Button
          floated="right"
          type="button"
          content="Cancel"
          onClick={() => setEditMode(false)}
        />
      </Form>
    </Segment>
  )
}

export default observer(ActivityForm)

import React, { useState, useContext, FormEvent, useEffect } from 'react'
import { Segment, Form, Button } from 'semantic-ui-react'
import { v4 as uuid } from 'uuid'
import { observer } from 'mobx-react-lite'
import ActivityStore from '../../../app/stores/activityStore'
import { IActivity } from '../../../app/models/Activity'
import { RouteComponentProps } from 'react-router-dom'

interface DetailParams {
  id: string
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = (props) => {
  const activityStore = useContext(ActivityStore)
  const {
    activity: initialActivity,
    createActivity,
    editActivity,
    loadActivity,
    clearActivity,
    submitting
  } = activityStore

  const [activity, setActivity] = useState<IActivity>({
    id: '',
    title: '',
    category: '',
    description: '',
    date: '',
    city: '',
    venue: '',
  })

  useEffect(() => {
    if (props.match.params.id) {
      loadActivity(props.match.params.id).then(
        () => initialActivity && setActivity(initialActivity)
      )
    }
    return () => {
      clearActivity()
    }
    //eslint-disable-next-line
  }, [])

  const handleSubmit = async () => {
    if (initialActivity) await editActivity(activity)
    else {
      activity.id = uuid()
      await createActivity(activity)
    }
    props.history.push(`/activities/${activity.id}`)
  }

  const handleChange = (
    event: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setActivity({
      ...activity,
      [event.currentTarget.name]: event.currentTarget.value,
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
          onClick={() => {
            if (initialActivity) props.history.push(`/activities/${activity.id}`)
            else props.history.push('/activities')
          }}
        />
      </Form>
    </Segment>
  )
}

export default observer(ActivityForm)

import React, { useState, useContext, useEffect } from 'react'
import { Segment, Form, Button, Grid } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ActivityStore from '../../../app/stores/activityStore'
import { ActivityFormValues } from '../../../app/models/Activity'
import { RouteComponentProps } from 'react-router-dom'
import { Form as FinalForm, Field } from 'react-final-form'
import TextInput from '../../../app/common/form/TextInput'
import TextAreaInput from '../../../app/common/form/TextAreaInput'
import SelectInput from '../../../app/common/form/SelectInput'
import category from '../../../app/common/options/categoryOptions'
import DateInput from '../../../app/common/form/DateInput'
import { combineDateAndTime } from '../../../app/common/util/util'
import { v4 as uuid } from 'uuid'
import {
  combineValidators,
  isRequired,
  composeValidators,
  hasLengthGreaterThan,
} from 'revalidate'

const validate = combineValidators({
  title: isRequired({ message: 'The event title is required' }),
  category: isRequired('Category'),
  description: composeValidators(
    isRequired('Description'),
    hasLengthGreaterThan(4)({
      message: 'Description must have at least five characters.',
    })
  )(),
  city: isRequired('City'),
  venue: isRequired('Venue'),
  date: isRequired('Date'),
  time: isRequired('Time'),
})

interface DetailParams {
  id: string
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = (props) => {
  const activityStore = useContext(ActivityStore)
  const {
    createActivity,
    editActivity,
    loadActivity,
    submitting,
  } = activityStore

  const [activity, setActivity] = useState(new ActivityFormValues())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (props.match.params.id) {
      setLoading(true)
      loadActivity(props.match.params.id)
        .then((a) => setActivity(new ActivityFormValues(a)))
        .finally(() => {
          setLoading(false)
        })
    }
    //eslint-disable-next-line
  }, [])

  const handleFinalFormSubmit = async (values: any) => {
    const dateAndTime = combineDateAndTime(values.date, values.time)
    const { date, time, ...activity } = values
    activity.date = dateAndTime
    if (activity.id) {
      await editActivity(activity)
    } else {
      activity.id = uuid()
      await createActivity(activity)
    }
  }

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <FinalForm
            initialValues={activity}
            onSubmit={handleFinalFormSubmit}
            validate={validate}
            // invalid is bool that checks if any fields are invalid
            // pristine is bool that checks if nothing has changed
            render={({ handleSubmit, invalid, pristine }) => (
              <Form onSubmit={handleSubmit} loading={loading}>
                <Field
                  placeholder="Title"
                  name="title"
                  value={activity?.title}
                  component={TextInput}
                />
                <Field
                  placeholder="Description"
                  name="description"
                  rows={3}
                  value={activity?.description}
                  component={TextAreaInput}
                />
                <Field
                  placeholder="Category"
                  name="category"
                  value={activity?.category}
                  component={SelectInput}
                  options={category}
                />
                {/* makes these inline and same width */}
                <Form.Group widths="equal">
                  <Field
                    placeholder="Date"
                    name="date"
                    date={true}
                    value={activity?.date}
                    component={DateInput}
                  />
                  <Field
                    placeholder="Time"
                    name="time"
                    time={true}
                    value={activity?.date}
                    component={DateInput}
                  />
                </Form.Group>
                <Field
                  placeholder="City"
                  name="city"
                  value={activity?.city}
                  component={TextInput}
                />
                <Field
                  placeholder="Venue"
                  name="venue"
                  value={activity?.venue}
                  component={TextInput}
                />
                <Button
                  floated="right"
                  positive
                  type="submit"
                  content="Submit"
                  loading={submitting}
                  disabled={loading || invalid || pristine }
                />
                <Button
                  floated="right"
                  type="button"
                  content="Cancel"
                  onClick={() => {
                    if (activity.id)
                      props.history.push(`/activities/${activity.id}`)
                    else props.history.push('/activities')
                  }}
                  disabled={loading}
                />
              </Form>
            )}
          />
        </Segment>
      </Grid.Column>
    </Grid>
  )
}

export default observer(ActivityForm)

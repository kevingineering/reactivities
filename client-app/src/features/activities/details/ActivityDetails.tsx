import React, { useContext, useEffect } from 'react'
import { Card, Image, Button } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'
import ActivityStore from '../../../app/stores/activityStore'
import { RouteComponentProps, Link } from 'react-router-dom'
import LoadingComponent from '../../../app/layout/LoadingComponent'

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
  }, [loadActivity])

  return (loadingInitial || !activity) ? (
    <LoadingComponent content="Loading activity..." />
  ) : (
    <Card fluid>
      <Image
        src={`/assets/categoryImages/${activity?.category}.jpg`}
        wrapped
        ui={false}
      />
      <Card.Content>
        <Card.Header>{activity?.title}</Card.Header>
        <Card.Meta>
          <span>{activity?.date}</span>
        </Card.Meta>
        <Card.Description>{activity?.description}</Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths={2}>
          <Button
            as={Link}
            to={`/manage/${activity.id}`}
            basic
            color="blue"
            content="Edit"
            onClick={() => props.history.push(`/createActivity`)}
          />
          <Button
            basic
            color="grey"
            content="Cancel"
            //clears activity
            onClick={() => props.history.push('/activities')}
          />
        </Button.Group>
      </Card.Content>
    </Card>
  )
}

export default observer(ActivityDetails)

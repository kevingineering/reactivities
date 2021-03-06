import React, { Fragment, useContext, useEffect } from 'react'
import { Segment, Header, Form, Button, Comment } from 'semantic-ui-react'
import { RootStoreContext } from '../../stores/rootStore'
import { Form as FinalForm, Field } from 'react-final-form'
import { Link } from 'react-router-dom'
import TextAreaInput from '../../sharedComponents/formComponents/TextAreaInput'
import { observer } from 'mobx-react-lite'
import { formatDistance } from 'date-fns'

interface IProps {
  id: string
}
const ActivityDetailedChat: React.FC<IProps> = ({ id }) => {
  const rootStore = useContext(RootStoreContext)
  const {
    createHubConnection,
    stopHubConnection,
    addComment,
    currentActivity,
  } = rootStore.activityStore

  useEffect(() => {
    createHubConnection(id)
    return () => stopHubConnection()
    //eslint-disable-next-line
  }, [])

  return (
    <Fragment>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: 'none' }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached>
        <Comment.Group>
          {currentActivity &&
            currentActivity.comments &&
            currentActivity.comments.map((comment) => (
              <Comment key={comment.id}>
                <Comment.Avatar src={comment.image || '/assets/user.png'} />
                <Comment.Content>
                  <Comment.Author as={Link} to={`/profile/${comment.userName}`}>
                    {comment.displayName}
                  </Comment.Author>
                  <Comment.Metadata>
                    <div>{formatDistance(comment.createdAt, new Date())}</div>
                  </Comment.Metadata>
                  <Comment.Text>{comment.body}</Comment.Text>
                </Comment.Content>
              </Comment>
            ))}
          <FinalForm
            onSubmit={addComment}
            render={({ handleSubmit, submitting, form, values }) => (
              <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
                <Field
                  name="body"
                  component={TextAreaInput}
                  rows={2}
                  placeholder="Add your comment"
                />
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  //ensure not just whitespace
                  disabled={!values.body || (values.body && !values.body.trim())}
                  loading={submitting}
                />
              </Form>
            )}
          />
        </Comment.Group>
      </Segment>
    </Fragment>
  )
}

export default observer(ActivityDetailedChat)

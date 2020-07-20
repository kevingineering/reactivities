import React from 'react'
import { AxiosResponse } from 'axios'
import { Message } from 'semantic-ui-react'

interface IProps {
  error: AxiosResponse
  text?: string
}

const ErrorMessage: React.FC<IProps> = ({ error, text }) => {
  //gets array of objects, each object has key and array
  console.log('error', error)

  const errors = error.data.errors
  //gets values (arrays) from array of objects, then concatenate arrays
  let errorMessages = []
  if (errors) errorMessages = Object.values(errors).flat()

  return (
    <Message error>
      <Message.Header>{error.statusText}</Message.Header>
      {errorMessages.length > 0 && (
        <Message.List>
          {errorMessages.map((err, i) => (
            <Message.Item key={i}>{err}</Message.Item>
          ))}
        </Message.List>
      )}
      {text && <Message.Content content={text} />}
    </Message>
  )
}

export default ErrorMessage

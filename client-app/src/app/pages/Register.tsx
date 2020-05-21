import React, { useContext } from 'react'
import { Form as FinalForm, Field } from 'react-final-form'
import { RootStoreContext } from '../stores/rootStore'
import { IUserFormValues } from '../models/User'
import { FORM_ERROR } from 'final-form'
import { isRequired, combineValidators } from 'revalidate'
import { Form, Header, Button } from 'semantic-ui-react'
import ErrorMessage from '../sharedComponents/formComponents/ErrorMessage'
import TextInput from '../sharedComponents/formComponents/TextInput'

const validate = combineValidators({
  username: isRequired('Username'),
  displayName: isRequired('Display Name'),
  email: isRequired('Email'),
  password: isRequired('Password'),
})

const Register = () => {
  const rootStore = useContext(RootStoreContext)
  const { register } = rootStore.userStore

  const handleFinalFormSubmit = async (values: IUserFormValues) => {
    try {
      await register(values)
    } catch (error) {
      //catch submission error and set constant in final form
      return { [FORM_ERROR]: error }
    }
  }

  return (
    <FinalForm
      onSubmit={handleFinalFormSubmit}
      validate={validate}
      render={({
        handleSubmit,
        submitting,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        // <h1>Hello world</h1>
        <Form onSubmit={handleSubmit} error>
          <Header
            as="h2"
            content="Sign up for Reactivities"
            color="teal"
            textAlign="center"
          />
          <Field placeholder="Username" name="username" component={TextInput} />
          <Field
            placeholder="Display Name"
            name="displayName"
            component={TextInput}
          />
          <Field placeholder="Email" name="email" component={TextInput} />
          <Field
            placeholder="Password"
            name="password"
            component={TextInput}
            type="password"
          />
          {/* Show login errors */}
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
            />
          )}
          <Button
            type="submit"
            color="teal"
            content="Register"
            fluid
            loading={submitting}
            disabled={
              (submitting || !dirtySinceLastSubmit) && (invalid || pristine)
            }
          />
        </Form>
      )}
    />
  )
}

export default Register

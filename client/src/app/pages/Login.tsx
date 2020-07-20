import React, { useContext } from 'react'
import { Form as FinalForm, Field } from 'react-final-form'
import { Form, Button, Header, Divider } from 'semantic-ui-react'
import { FORM_ERROR } from 'final-form'
import { isRequired, combineValidators } from 'revalidate'
import { RootStoreContext } from '../stores/rootStore'
import { IUserFormValues } from '../models/user'
import TextInput from '../sharedComponents/formComponents/TextInput'
import ErrorMessage from '../sharedComponents/formComponents/ErrorMessage'
import SocialLogin from './login/SocialLogin'
import { observer } from 'mobx-react-lite'

const validate = combineValidators({
  email: isRequired('Email'),
  password: isRequired('Password'),
})

const Login = () => {
  const rootStore = useContext(RootStoreContext)
  const { login, fbLogin, loading } = rootStore.userStore

  const handleFinalFormSubmit = async (values: IUserFormValues) => {
    try {
      await login(values)
    } catch (error) {
      //catch submission error and set constant in final form
      return { [FORM_ERROR]: error }
    }
  }

  return (
    <FinalForm
      onSubmit={handleFinalFormSubmit}
      validate={validate}
      //to see all available fields on form, uncomment form and <pre> tag below
      render={({
        handleSubmit,
        submitting,
        // form,
        submitError,
        invalid,
        pristine,
        dirtySinceLastSubmit,
      }) => (
        <Form onSubmit={handleSubmit} error>
          <Header
            as='h2'
            content='Log in to Reactivities'
            color='teal'
            textAlign='center'
          />
          <Field placeholder='Email' name='email' component={TextInput} />
          <Field
            placeholder='Password'
            name='password'
            component={TextInput}
            type='password'
          />
          {/* Show login errors */}
          {submitError && !dirtySinceLastSubmit && (
            <ErrorMessage
              error={submitError}
              text='Invalid email or password.'
            />
          )}
          <Button
            type='submit'
            color='teal'
            content='Log In'
            fluid
            loading={submitting}
            disabled={
              (submitting || !dirtySinceLastSubmit) && (invalid || pristine)
            }
          />
          <Divider horizontal>Or</Divider>
          <SocialLogin fbCallback={fbLogin} loading={loading}></SocialLogin>
          {/* <pre>{JSON.stringify(form.getState(), null, 2)}</pre> */}
        </Form>
      )}
    />
  )
}

export default observer(Login)

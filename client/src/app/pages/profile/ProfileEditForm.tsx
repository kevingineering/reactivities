import React from 'react'
import { Form as FinalForm, Field } from 'react-final-form'
import TextInput from '../../sharedComponents/formComponents/TextInput'
import TextAreaInput from '../../sharedComponents/formComponents/TextAreaInput'
import { isRequired, combineValidators } from 'revalidate'
import { IProfile } from '../../models/profile'
import { Button, Form } from 'semantic-ui-react'
import { observer } from 'mobx-react-lite'

interface IProps {
  profile: IProfile
  update: (profile: IProfile) => void
}

const validate = combineValidators({
  displayName: isRequired({ message: 'You must have a display name.' }),
})

const ProfileEditForm: React.FC<IProps> = ({ profile, update }) => {
  return (
    <FinalForm
      initialValues={profile}
      onSubmit={update}
      validate={validate}
      render={({ handleSubmit, invalid, submitting, values }) => (
        <Form onSubmit={handleSubmit} error>
          <Field
            placeholder="Display Name"
            name="displayName"
            value={profile!.displayName}
            component={TextInput}
          />
          <Field
            placeholder="Bio"
            name="bio"
            value={profile!.bio}
            rows={3}
            component={TextAreaInput}
          />
          <Button
            floated="right"
            positive
            content="Update Profile"
            type="submit"
            loading={submitting}
            // using individual attributes because pristine is not resetting to new values after submission
            disabled={invalid || (profile.displayName === values.displayName && profile.bio === values.bio)}
          />
        </Form>
      )}
    />
  )
}

export default observer(ProfileEditForm)

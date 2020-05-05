import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label, Select } from 'semantic-ui-react'

//changed HTMLSelectElement to any
interface IProps extends FieldRenderProps<string, any>, FormFieldProps {}

const SelectInput: React.FC<IProps> = ({
  input,
  width,
  options,
  placeholder,
  meta: { touched, error },
}) => {
  return (
    <Form.Field error={touched && !!error} width={width}>
      {/* instead of spreading input like on TextInput, we break it into value and onChange */}
      <Select 
        value={input.value}
        onChange={(e, data) => input.onChange(data.value)}
        placeholder={placeholder} 
        options={options} 
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  )
}

export default SelectInput

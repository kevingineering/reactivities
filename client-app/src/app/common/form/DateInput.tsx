import React from 'react'
import { FieldRenderProps } from 'react-final-form'
import { FormFieldProps, Form, Label } from 'semantic-ui-react'
import { DateTimePicker } from 'react-widgets'

//changed Date to any and HTMLInputElement to any
interface IProps extends FieldRenderProps<any, any>, FormFieldProps {}

const DateInput: React.FC<IProps> = ({
  input,
  width,
  date = false, 
  time = false,
  placeholder,
  meta: { touched, error },
  // ...rest
}) => {
  const onChange = (e: any) => {
    input.onChange(e)
    console.log(input.value)
  }
  return (
    <Form.Field error={touched && !!error} width={width}>
      {/* rest accomodates rest of the properties on the DateTimePicker */}
      <DateTimePicker
        value={input.value || null}
        placeholder={placeholder}
        onChange={(e) => onChange(e)}
        onBlur={input.onBlur}
        onKeyDown={(e) => e.preventDefault()}
        date={date}
        time={time}
        // {...rest}
      />
      {touched && error && (
        <Label basic color="red">
          {error}
        </Label>
      )}
    </Form.Field>
  )
}

export default DateInput

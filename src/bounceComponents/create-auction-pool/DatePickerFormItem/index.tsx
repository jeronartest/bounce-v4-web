import { ReactNode } from 'react'
import { FieldProps, getIn } from 'formik'
import { DatePicker as MuiDatePicker, DatePickerProps as MuiDatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { TextField, TextFieldProps } from '@mui/material'
import { Moment } from 'moment'

interface DatePickerProps extends FieldProps, Omit<MuiDatePickerProps<Moment, Moment>, 'name' | 'value' | 'error'> {
  textField?: TextFieldProps
}

function createErrorHandler(
  fieldError: unknown,
  fieldName: string,
  setFieldError: (field: string, message?: string) => void
) {
  return (error?: ReactNode) => {
    if (error !== fieldError && error !== '') {
      setFieldError(fieldName, error ? String(error) : undefined)
    }
  }
}

function fieldToDatePicker({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  field: { onChange: _onChange, ...field },
  form: { isSubmitting, touched, errors, setFieldValue, setFieldError, setFieldTouched },
  textField: { helperText, onBlur, ...textField } = {},
  disabled,
  label,
  onChange,
  onError,
  renderInput,
  ...props
}: DatePickerProps): MuiDatePickerProps<Moment, Moment> {
  const fieldError = getIn(errors, field.name)

  const showError = getIn(touched, field.name) && !!fieldError

  return {
    inputFormat: 'MMM D, Y  HH:mm', //Jan 1, 2021  00:00
    renderInput:
      renderInput ??
      (params => (
        <TextField
          {...params}
          error={showError}
          helperText={showError ? fieldError : helperText}
          label={label}
          // InputProps={{
          //   readOnly: true,
          // }}
          // sx={{
          //   '& .MuiInputBase-input': {
          //     caretColor: 'transparent',
          //   },
          // }}
          onBlur={
            onBlur ??
            function () {
              setFieldTouched(field.name, true, true)
            }
          }
          {...textField}
        />
      )),
    disabled: disabled ?? isSubmitting,
    onChange:
      onChange ??
      function (date) {
        // Do not switch this order, otherwise you might cause a race condition
        // See https://github.com/formium/formik/issues/2083#issuecomment-884831583
        setFieldTouched(field.name, true, false)
        setFieldValue(field.name, date, true)
      },
    onError: onError ?? createErrorHandler(fieldError, field.name, setFieldError),
    ...field,
    ...props
  }
}

function DatePickerFormItem({ children, ...props }: DatePickerProps) {
  return <MuiDatePicker {...fieldToDatePicker(props)}>{children}</MuiDatePicker>
}

export default DatePickerFormItem

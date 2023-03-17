import { Fragment, ReactNode } from 'react'
import { FieldProps, getIn } from 'formik'
import { Moment } from 'moment'
import {
  DateRangePicker as MuiDateRangePicker,
  DateRangePickerProps as MuiDateRangePickerProps
} from '@mui/x-date-pickers-pro/DateRangePicker'
import { TextField, TextFieldProps } from '@mui/material'

interface DateRangePickerFormItemProps
  extends FieldProps,
    Omit<MuiDateRangePickerProps<Moment, Moment>, 'name' | 'value' | 'error'> {
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

function fieldToDateRangePicker({
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
}: DateRangePickerFormItemProps): MuiDateRangePickerProps<Moment, Moment> {
  const fieldError = getIn(errors, field.name)

  const showError = getIn(touched, field.name) && !!fieldError

  return {
    renderInput:
      renderInput ??
      ((startProps, endProps) => (
        <Fragment>
          <TextField
            {...startProps}
            error={showError}
            helperText={showError ? fieldError : helperText}
            label={label}
            onBlur={
              onBlur ??
              function () {
                setFieldTouched(field.name, true, true)
              }
            }
            {...textField}
          />
          <TextField
            {...endProps}
            error={showError}
            helperText={showError ? fieldError : helperText}
            label={label}
            onBlur={
              onBlur ??
              function () {
                setFieldTouched(field.name, true, true)
              }
            }
            {...textField}
          />
        </Fragment>
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

function DateRangePickerFormItem({ children, ...props }: DateRangePickerFormItemProps) {
  return <MuiDateRangePicker {...fieldToDateRangePicker(props)}>{children}</MuiDateRangePicker>
}

export default DateRangePickerFormItem

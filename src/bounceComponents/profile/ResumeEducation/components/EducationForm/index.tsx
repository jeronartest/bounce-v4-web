import { Stack } from '@mui/system'
import { Formik, Form } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import * as yup from 'yup'
import { Button, Grid, MenuItem, OutlinedInput, Select, Typography } from '@mui/material'
import { useModal } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import moment from 'moment'
import FormItem from '@/components/common/FormItem'
import { ReactComponent as DeleteIcon } from '@/assets/imgs/components/delete.svg'
import SearchInput, { ISearchOption } from '@/components/common/SearchInput'
import { RootState } from '@/store'
import { searchEduInfo } from '@/api/optionsData'
import { educationItems, FormType } from '@/api/profile/type'
import DefaultAvaSVG from '@/assets/imgs/components/defaultAva.svg'
import DateMonthPicker from '@/components/common/DateMonthPicker'
import { formCheckValid } from '@/utils'
import EducationDefaultSVG from '@/assets/imgs/defaultAvatar/education.svg'

export type IEducationFormProps = {
  onAdd?: (data: educationItems) => void
  onEdit?: (data: educationItems, index: number) => void
  editData?: { data: educationItems; index: number }
  onDelete?: (index: number) => void
}
const DESCRIPTION_LENGTH = 1000

const validationSchema = yup.object({
  university: yup.object({
    name: yup
      .string()
      .required(formCheckValid('Educational Institution', FormType.Select))
      .max(300, 'Allow only no more than 300 letters')
      .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect educational institution'),
    link: yup.string(),
    avatar: yup.string(),
  }),
  startTime: yup
    .number()
    .required(formCheckValid('Start Date', FormType.Select))
    .min(1, formCheckValid('Start Date', FormType.Select))
    .max(moment().unix(), 'Incorrect date. Start date should be earlier than the current date'),
  endTime: yup
    .number()
    .max(moment().unix(), 'Incorrect date. End date should be earlier than the current date')
    .test('CHECK_STARTTIME', 'Incorrect date. End date should be earlier than the start date', (value, ctx) => {
      if (value && value < ctx?.parent?.startTime) {
        return false
      }
      return true
    })
    .test('CHECK_CURRENTLY', formCheckValid('End Date', FormType.Select), (value, ctx) => {
      if (!ctx?.parent?.isCurrently && !value) {
        return false
      }
      return true
    }),
  degree: yup.string().required(formCheckValid('Degree Type', FormType.Select)),
  major: yup.string().required(formCheckValid('Major/Field of Study', FormType.Input)),
  description: yup
    .string()
    .required('Please introduce yourself, your GPA')
    .max(DESCRIPTION_LENGTH, `Allow only no more than ${DESCRIPTION_LENGTH} letters`),
})

const EducationForm: React.FC<IEducationFormProps> = ({ onAdd, editData, onEdit, onDelete }) => {
  const modal = useModal()
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)

  const initialValues = editData
    ? editData.data
    : {
        university: {
          avatar: '',
          link: '',
          name: '',
        },
        startTime: 0,
        endTime: 0,
        degree: '',
        major: '',
        description: '',
      }

  const handleSubmit = useCallback(
    (values: typeof initialValues) => {
      if (!editData) {
        onAdd?.({ ...values, degree: Number(values.degree) })
      } else {
        onEdit?.({ ...values, degree: Number(values.degree) }, editData.index)
      }
      modal.hide()
    },
    [editData, modal, onAdd, onEdit],
  )

  const handleDelete = useCallback(
    (handleReset) => {
      if (!editData) {
        handleReset()
      } else {
        onDelete?.(editData.index)
        modal.hide()
      }
    },
    [editData, modal, onDelete],
  )

  const [eduOptions, setEduOptions] = useState<ISearchOption[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [first, setfirst] = useState<boolean>(true)

  useEffect(() => {
    if (first) {
      return
    }

    searchEduInfo({
      limit: 100,
      offset: 0,
      value: searchText,
    }).then((res) => {
      const { code, data } = res
      if (code !== 200) {
        toast.error('search error')
      }
      setEduOptions(
        data.list.map((v) => {
          return {
            label: v.name,
            icon: v.avatar || EducationDefaultSVG,
            value: v,
          }
        }),
      )
    })
  }, [searchText, first])

  return (
    <Stack>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {({ handleReset, setFieldValue, values }) => (
          <Stack component={Form} spacing={40} noValidate>
            <Grid container spacing={10}>
              <Grid item xs={12}>
                <FormItem name="university" label="Educational Institution" required fieldType="custom">
                  <SearchInput
                    options={eduOptions}
                    selected={{
                      label: values.university.name,
                      icon: values.university.avatar,
                      value: values.university,
                    }}
                    onSearch={(text: string) => {
                      setfirst(false)
                      setSearchText(text)
                    }}
                    value={values.university.name}
                    onChange={(e, newValue) => {
                      setfirst(false)
                      setSearchText(newValue)
                      setFieldValue('university', { name: newValue, avatar: '', link: '' })
                    }}
                    onSelect={(e, newVal) => setFieldValue('university', newVal.value)}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={6}>
                <FormItem name="startTime" label="Start Date" required fieldType="custom">
                  <DateMonthPicker
                    value={values.startTime}
                    onChange={(val) => {
                      const { year, month } = val
                      const tempMonth = month + 1 < 10 ? `0${month + 1}` : month + 1
                      setFieldValue('startTime', moment(`${year}-${tempMonth}-01`).unix())
                    }}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={6}>
                <FormItem name="endTime" label="End Date" required fieldType="custom">
                  <DateMonthPicker
                    value={values.endTime}
                    onChange={(val) => {
                      const { year, month } = val
                      const tempMonth = month + 1 < 10 ? `0${month + 1}` : month + 1
                      setFieldValue('endTime', moment(`${year}-${tempMonth}-01`).unix())
                    }}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={12}>
                <FormItem name="degree" label="Degree Type" required>
                  <Select>
                    {optionDatas?.degreeOpt.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.degree}
                      </MenuItem>
                    ))}
                  </Select>
                </FormItem>
              </Grid>
              <Grid item xs={12}>
                <FormItem name="major" label="Major/Field of Study" required>
                  <OutlinedInput autoComplete="off" />
                </FormItem>
              </Grid>
              <Grid item xs={12}>
                <FormItem name="description" required>
                  <OutlinedInput
                    placeholder="Introduce yourself, your GPA. ..."
                    multiline
                    autoComplete="off"
                    endAdornment={
                      <Typography
                        variant="body2"
                        className="endAdorn"
                      >{`${values?.description?.length} / ${DESCRIPTION_LENGTH}`}</Typography>
                    }
                    className="areaInput"
                    inputProps={{ sx: { minHeight: 144 } }}
                  />
                </FormItem>
              </Grid>
            </Grid>
            <Stack direction="row" spacing={10} justifyContent="end">
              <Button variant="outlined" onClick={() => handleDelete(handleReset)}>
                Delete record
                <DeleteIcon style={{ marginLeft: 10 }} />
              </Button>
              <Button type="submit" variant="contained" size="medium" sx={{ width: 120 }}>
                Save
              </Button>
            </Stack>
          </Stack>
        )}
      </Formik>
    </Stack>
  )
}

export default EducationForm
function dayjs(value: any) {
  throw new Error('Function not implemented.')
}

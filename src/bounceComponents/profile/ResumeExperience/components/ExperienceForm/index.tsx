import { Stack } from '@mui/system'
import { Formik, Form } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import * as yup from 'yup'
import {
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  ListSubheader,
  MenuItem,
  OutlinedInput,
  Select,
  Typography
} from '@mui/material'
import { useModal } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import moment from 'moment'
import FormItem from 'bounceComponents/common/FormItem'
import { ReactComponent as DeleteIcon } from 'assets/imgs/components/delete.svg'
import { experienceItems, FormType } from 'api/profile/type'
import SearchInput from 'bounceComponents/common/SearchInput'
import { searchCompanyInfo } from 'api/optionsData'
import { RootState } from '@/store'
import DefaultAvaSVG from 'assets/imgs/components/defaultAva.svg'
import DateMonthPicker from 'bounceComponents/common/DateMonthPicker'
import { formCheckValid } from '@/utils'

export type IExperienceFormProps = {
  onAdd?: (data: experienceItems) => void
  onEdit?: (data: experienceItems, index: number) => void
  editData?: { data: any; index: number }
  onDelete?: (index: number) => void
}

const DESCRIPTION_LENGTH = 1000

const validationSchema = yup.object({
  company: yup.object({
    name: yup
      .string()
      .required(formCheckValid('Company', FormType.Select))
      .max(300, 'Allow only no more than 300 letters')
      .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect company'),
    link: yup.string(),
    avatar: yup.string()
  }),
  position: yup.string().required(formCheckValid('Primary Role', FormType.Select)),
  isCurrently: yup.boolean(),
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
    // .when('isCurrently', {
    //   is: false,
    //   then: yup.number().required('ksdhfgkhsdg'),
    //   otherwise(schema) {
    //     console.log('錯誤', schema)
    //     return yup.number().required('輸入數字')
    //   },
    // })
    .test('CHECK_CURRENTLY', formCheckValid('End Date', FormType.Select), (value, ctx) => {
      if (!ctx?.parent?.isCurrently && !value) {
        return false
      }
      return true
    }),
  description: yup
    .string()
    .required('Please introduce your experience')
    .max(DESCRIPTION_LENGTH, `Allow only no more than ${DESCRIPTION_LENGTH} letters`)
})

interface ICheckboxItemsProps {
  value?: boolean
  onChange?: (ev: any, checked: boolean) => void
}

const CheckboxItems: React.FC<ICheckboxItemsProps> = ({ value, onChange }) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={value} value={value} onChange={onChange} />}
      label="I currently work here"
    />
  )
}

const ExperienceForm: React.FC<IExperienceFormProps> = ({ onAdd, editData, onEdit, onDelete }) => {
  const modal = useModal()
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)

  const initialValues = editData
    ? editData.data
    : {
        company: {
          avatar: '',
          link: '',
          name: ''
        },
        companyId: 0,
        thirdpartId: 0,
        position: '',
        startTime: 0,
        endTime: 0,
        isCurrently: false,
        description: ''
      }

  const handleSubmit = useCallback(
    (values: typeof initialValues) => {
      if (!editData) {
        onAdd?.({ ...values, isCurrently: values.isCurrently ? 2 : 1, position: Number(values.position) })
      } else {
        onEdit?.(
          { ...values, isCurrently: values.isCurrently ? 2 : 1, position: Number(values.position) },
          editData.index
        )
      }
      modal.hide()
    },
    [editData, modal, onAdd, onEdit]
  )

  const handleDelete = useCallback(
    handleReset => {
      if (!editData) {
        handleReset()
      } else {
        onDelete?.(editData.index)
        modal.hide()
      }
    },
    [editData, modal, onDelete]
  )

  const [companyData, setCompanyData] = useState([])
  const [comSearchText, setComSearchText] = useState<string>('')

  useEffect(() => {
    searchCompanyInfo({
      limit: 100,
      offset: 0,
      value: comSearchText
    }).then(res => {
      const { code, data } = res
      if (code !== 200) {
        toast.error('search error')
      }
      setCompanyData(
        data.list.map(v => {
          return {
            label: v.name,
            icon: v.avatar || DefaultAvaSVG,
            value: v
          }
        })
      )
    })
  }, [comSearchText])

  return (
    <Stack>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {({ handleReset, setFieldValue, values }) => (
          <Stack component={Form} spacing={40} noValidate>
            <Grid container spacing={10}>
              <Grid item xs={12}>
                <FormItem name="company" label="Company" required fieldType="custom">
                  <SearchInput
                    options={companyData}
                    selected={{
                      label: values.company.name,
                      icon: values.company.avatar,
                      value: values.company
                    }}
                    onSearch={(text: string) => setComSearchText(text)}
                    value={values?.company?.name}
                    onChange={(e, newValue) => {
                      setComSearchText(newValue)
                      setFieldValue('company', { name: newValue, avatar: '', link: '' })
                      setFieldValue('companyId', 0)
                      setFieldValue('thirdpartId', 0)
                    }}
                    onSelect={(e, newVal) => {
                      setFieldValue('company', {
                        avatar: newVal.value.avatar,
                        link: newVal.value.link,
                        name: newVal.value.name
                      })
                      setFieldValue('companyId', newVal.value.companyId)
                      setFieldValue('thirdpartId', newVal.value.thirdpartId)
                    }}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={12}>
                <FormItem name="position" label="Primary Role" required>
                  <Select>
                    {optionDatas?.primaryRoleOpt?.map((item, index) => [
                      <ListSubheader key={index}>{item.level1Name}</ListSubheader>,
                      item.child.map((child, index) => [
                        <MenuItem key={index} value={child.id}>
                          {child.level2Name}
                        </MenuItem>
                      ])
                    ])}
                  </Select>
                </FormItem>
              </Grid>
              <Grid item xs={6}>
                <FormItem name="startTime" label="Start Date" required fieldType="custom">
                  <DateMonthPicker
                    value={values.startTime}
                    onChange={val => {
                      const { year, month } = val
                      const tempMonth = month + 1 < 10 ? `0${month + 1}` : month + 1
                      setFieldValue('startTime', moment(`${year}-${tempMonth}-01`).unix())
                    }}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={6}>
                <FormItem name="endTime" label="End Date" required={!values.isCurrently} fieldType="custom">
                  <DateMonthPicker
                    disabled={values.isCurrently}
                    value={values.endTime}
                    onChange={val => {
                      const { year, month } = val
                      const tempMonth = month + 1 < 10 ? `0${month + 1}` : month + 1
                      setFieldValue('endTime', moment(`${year}-${tempMonth}-01`).unix())
                    }}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={12}>
                <FormItem name="isCurrently" fieldType="custom">
                  <CheckboxItems
                    value={values.isCurrently}
                    onChange={val => {
                      setFieldValue('isCurrently', val.target.checked)
                      setFieldValue('endTime', 0)
                    }}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={12}>
                <FormItem name="description" required>
                  <OutlinedInput
                    placeholder="Introduce your experience..."
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

export default ExperienceForm

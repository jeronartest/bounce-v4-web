import { Stack } from '@mui/system'
import { Formik, Form } from 'formik'
import React, { useCallback, useState, useEffect } from 'react'
import * as yup from 'yup'
import { Button, OutlinedInput, Grid, MenuItem, Select, InputAdornment } from '@mui/material'
import { useModal } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import moment from 'moment'
import FormItem from '@/components/common/FormItem'
import { ReactComponent as DeleteIcon } from '@/assets/imgs/components/delete.svg'
import SearchInput, { ISearchOption } from '@/components/common/SearchInput'
import { searchCompanyInfo } from '@/api/optionsData'
import { RootState } from '@/store'
import { FormType, IInvestmentItems } from '@/api/profile/type'
import DefaultAvaSVG from '@/assets/imgs/components/defaultAva.svg'
import DateMonthPicker from '@/components/common/DateMonthPicker'
import { formCheckValid } from '@/utils'

export type IInvestmentsFormProps = {
  onAdd?: (data: IInvestmentItems) => void
  onEdit?: (data: IInvestmentItems, index: number) => void
  editData?: { data: IInvestmentItems; index: number }
  onDelete?: (index: number) => void
}

const validationSchema = yup.object({
  company: yup.object({
    name: yup.string().required('Please select a company'),
    link: yup.string(),
    avatar: yup.string(),
  }),
  investDate: yup
    .number()
    .required(formCheckValid('Investment Date', FormType.Select))
    .min(1, formCheckValid('Investment Date', FormType.Select))
    .max(moment().unix(), 'Incorrect date. Investment date should be earlier than the current date'),
  investType: yup.string().required(formCheckValid('Investment Type', FormType.Select)),
  investAmount: yup
    .string()
    .trim()
    .when(['investType'], (investType, schema) => {
      return schema.test({
        name: 'amount',
        skipAbsent: true,
        test(value, ctx) {
          if (!value) {
            return ctx.createError({ message: formCheckValid('Amount', FormType.Input) })
          }
          if (Number(investType) === 1 && !(value > 0 && value <= 100)) {
            return ctx.createError({ message: 'Amount should be between 0-100' })
          }
          if (Number(investType) === 2) {
            if (/[\u4e00-\u9fa5]/g.test(value)) {
              return ctx.createError({ message: 'Chinese characters cannot be entered' })
            }
            const rep2 = /[`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g
            if (rep2.test(value)) {
              return ctx.createError({ message: 'Special characters cannot be entered' })
            }
            return true
          }
          return true
        },
      })
    }),
})

const InvestmentsForm: React.FC<IInvestmentsFormProps> = ({ onAdd, editData, onEdit, onDelete }) => {
  const modal = useModal()
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)

  const initialValues = editData
    ? editData.data
    : {
        company: {
          avatar: '',
          link: '',
          name: '',
        },
        companyId: 0,
        thirdpartId: 0,
        investDate: 0,
        investType: '',
        investAmount: '',
      }

  const handleSubmit = useCallback(
    (values: typeof initialValues) => {
      if (!editData) {
        onAdd?.({
          ...values,
          investAmount: values.investType === 1 ? Number(values.investAmount).toString() : values.investAmount,
        })
      } else {
        onEdit?.(
          {
            ...values,
            investAmount: values.investType === 1 ? Number(values.investAmount).toString() : values.investAmount,
          },
          editData.index,
        )
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

  const [companyData, setCompanyData] = useState<ISearchOption[]>([])
  const [comSearchText, setComSearchText] = useState<string>('')

  useEffect(() => {
    searchCompanyInfo({
      limit: 100,
      offset: 0,
      value: comSearchText,
    }).then((res) => {
      const { code, data } = res
      if (code !== 200) {
        toast.error('search error')
      }
      setCompanyData(
        data.list.map((v) => {
          return {
            label: v.name,
            icon: v.avatar || DefaultAvaSVG,
            value: v,
          }
        }),
      )
    })
  }, [comSearchText])

  return (
    <Stack>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {({ values, setFieldValue, handleReset }) => (
          <Stack component={Form} spacing={40} noValidate>
            <Grid container spacing={10}>
              <Grid item xs={6}>
                <FormItem name="company" label="Company" required fieldType="custom">
                  <SearchInput
                    options={companyData}
                    selected={{
                      label: values.company.name,
                      icon: values.company.avatar,
                      value: values.company,
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
                        name: newVal.value.name,
                      })
                      setFieldValue('companyId', newVal.value.companyId)
                      setFieldValue('thirdpartId', newVal.value.thirdpartId)
                    }}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={6}>
                <FormItem name="investDate" label="Investment Date" required fieldType="custom">
                  <DateMonthPicker
                    value={values.investDate}
                    onChange={(val) => {
                      const { year, month } = val
                      const tempMonth = month + 1 < 10 ? `0${month + 1}` : month + 1
                      setFieldValue('investDate', moment(`${year}-${tempMonth}-01`).unix())
                    }}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={6}>
                <FormItem name="investType" label="Investment Type" required fieldType="custom">
                  <Select
                    value={values.investType}
                    onChange={(val) => {
                      setFieldValue('investType', val.target.value)
                      setFieldValue('investAmount', '')
                    }}
                  >
                    {optionDatas?.investmentTypeOpt.map((v) => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.investment_type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormItem>
              </Grid>
              <Grid item xs={6}>
                <FormItem name="investAmount" label="Amount" required>
                  <OutlinedInput
                    disabled={!values.investType}
                    autoComplete="off"
                    endAdornment={
                      Number(values.investType) === 1 ? <InputAdornment position="end">%</InputAdornment> : null
                    }
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

export default InvestmentsForm

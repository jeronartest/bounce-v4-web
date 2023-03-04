import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography
} from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useMemo } from 'react'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { LoadingButton } from '@mui/lab'
import Head from 'next/head'
import FormItem from 'bounceComponents/common/FormItem'
import { useOptionsData } from 'bounceHooks/useOptionsData'
import { RootState } from '@/store'
import { usePersonalResume } from 'bounceHooks/profile/useUpdateBasic'
import EditLayout, { resumeTabsList } from 'bounceComponents/company/EditLayout'
import { FormType, IUpdatePersonalParams } from 'api/profile/type'
import { ResumeActionType } from 'bounceComponents/profile/components/ResumeContextProvider'
import { LeavePageWarn } from 'bounceComponents/common/LeavePageWarn'
import EditCancelConfirmation from 'bounceComponents/profile/components/EditCancelConfirmation'
import { formCheckValid } from '@/utils'

interface ICheckboxList {
  label: string
  value: number
}
interface ICheckboxItemsProps {
  listItem: ICheckboxList[]
  value: number[]
  onChange: (value: number[]) => void
  sx?: any
}

const CheckboxItems: React.FC<ICheckboxItemsProps> = ({ listItem, value, onChange, sx }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const _value = Number(event.target.value)
    const _checked = event.target.checked
    let temp = [...value]
    if (_checked) {
      temp.push(_value)
    } else {
      temp = temp.filter(v => v !== _value)
    }
    onChange?.(temp)
  }
  return (
    <FormGroup>
      {listItem.map(item => {
        return (
          <FormControlLabel
            key={item.value}
            control={<Checkbox checked={value?.includes(item.value)} value={item.value} onChange={handleChange} />}
            label={item.label}
            sx={{ width: 'fit-content' }}
          />
        )
      })}
    </FormGroup>
  )
}

const validationSchema = yup.object({
  currentState: yup.string().required(formCheckValid('Current State', FormType.Select)),
  jobTypes: yup
    .array()
    .of(yup.number())
    .required(formCheckValid('Job Types', FormType.Select))
    .min(1, formCheckValid('Job Types', FormType.Select))
    .max(2, 'Allow only no more than 2 Job Types'),
  ifRemotely: yup
    .number()
    .required(formCheckValid('Remote work', FormType.Select))
    .min(1, formCheckValid('Remote work', FormType.Select)),
  desiredSalary: yup
    .string()
    .required(formCheckValid('Desired Salary', FormType.Input))
    .test('MUST BE', 'Must be > 0 numbers.', function (val) {
      if (val) {
        if (Number(val) > 0 && /(^[1-9](\d+)?(\.\d+)?$)|(^\d\.\d+$)/.test(val)) {
          return true
        } else {
          return false
        }
      }
      return true
    }),
  desiredCompanySize: yup.number().required(formCheckValid('Desired Company Size', FormType.Select)),
  desiredMarket: yup
    .array()
    .of(yup.number())
    .required(formCheckValid('Desired Market', FormType.Select))
    .min(1, formCheckValid('Desired Market', FormType.Select))
    .max(2, 'Allow only no more than 2 Desired Market'),
  careJobs: yup
    .array()
    .of(yup.number())
    .required("Please check What's most important in the next job?")
    .min(1, "Please check What's most important in the next job?")
    .max(2, 'Allow only no more than 2 next job')
})

export interface IPreferenceItemsProps {
  resumeProfileValues?: IUpdatePersonalParams
  firstEdit?: boolean
  resumeProfileDispatch?: (val: any) => void
}

export const PreferenceItems: React.FC<IPreferenceItemsProps> = ({
  resumeProfileValues,
  firstEdit,
  resumeProfileDispatch
}) => {
  const { optionsData } = useOptionsData()
  const { userInfo } = useSelector((state: RootState) => state.user)
  const { loading, runAsync: runPersonalResume } = usePersonalResume()

  const initialValues = {
    currentState: resumeProfileValues?.currentState || userInfo?.currentState || 'Active',
    jobTypes: resumeProfileValues?.jobTypes || userInfo?.jobTypes || [],
    ifRemotely: resumeProfileValues?.ifRemotely || userInfo?.ifRemotely || '',
    desiredCompanySize: resumeProfileValues?.desiredCompanySize || userInfo?.desiredCompanySize || '',
    desiredMarket: resumeProfileValues?.desiredMarket || userInfo?.desiredMarket || [],
    desiredSalary: resumeProfileValues?.desiredSalary || userInfo?.desiredSalary || '',
    careJobs: resumeProfileValues?.careJobs || userInfo?.careJobs || []
  }

  const handleSubmit = values => {
    if (firstEdit) {
      return resumeProfileDispatch({
        type: ResumeActionType.SetPreference,
        payload: {
          ...resumeProfileValues,
          ...values,
          desiredSalary: values?.desiredSalary?.trim()
        }
      })
    }
    runPersonalResume({ ...values, desiredSalary: values?.desiredSalary?.trim() })
  }

  const jobCheckboxList = useMemo(() => {
    const _list = []
    optionsData?.data?.jobCareOpt.map(item => {
      const temp = {
        label: item.jobCare,
        value: item.id
      }
      _list.push(temp)
    })
    return _list || []
  }, [optionsData])

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, dirty, resetForm }) => (
        <Stack component={Form} spacing={20} noValidate>
          <LeavePageWarn dirty={dirty || (firstEdit && resumeProfileValues?.activeStep !== 4)} />
          {firstEdit && (
            <Typography variant="h2" mb={20}>
              Your preferences
            </Typography>
          )}
          <FormItem name="currentState" label="Current State" required>
            <Select>
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Closed to offer">Closed to offer</MenuItem>
            </Select>
          </FormItem>
          <FormItem name="jobTypes" label="Job Types (Max 2)" required>
            <Select multiple>
              {optionsData?.data?.jobTypeOpt?.map(item => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.jobType}
                  </MenuItem>
                )
              })}
            </Select>
          </FormItem>
          <FormItem name="ifRemotely" label="Remote work" required>
            <Select>
              <MenuItem value={1}>No</MenuItem>
              <MenuItem value={2}>Yes</MenuItem>
            </Select>
          </FormItem>
          <FormItem name="desiredSalary" label="Desired Salary, $ (Annual)" required>
            <OutlinedInput endAdornment={<Typography variant="body1">$</Typography>} />
          </FormItem>
          <FormItem name="desiredCompanySize" label="Desired Company Size" required>
            <Select>
              {optionsData?.data?.companySizeOpt?.map(item => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.size}
                  </MenuItem>
                )
              })}
            </Select>
          </FormItem>
          <FormItem name="desiredMarket" label="Desired Market (Max 2)" required>
            <Select multiple>
              {optionsData?.data?.marketTypeOpt?.map(item => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.marketType}
                  </MenuItem>
                )
              })}
            </Select>
          </FormItem>
          <Typography
            variant="body1"
            sx={{ fontFamily: "'Sharp Grotesk DB Cyr Medium 22'", lineHeight: '18px', mt: 32 }}
          >
            {`What's most important in the next job? *`}
          </Typography>
          <Typography variant="body1" sx={{ color: 'var(--ps-gray-700)' }} style={{ marginTop: 4 }}>
            (Max 2)
          </Typography>
          <FormItem name="careJobs" label="" fieldType="custom" required style={{ marginTop: 9 }}>
            <CheckboxItems
              listItem={jobCheckboxList}
              value={values.careJobs}
              onChange={job => {
                setFieldValue('careJobs', job)
              }}
              sx={{ width: 160, height: 160, display: 'flex', borderRadius: '50%', objectFit: 'cover' }}
            />
          </FormItem>
          <Box sx={{ textAlign: 'right' }}>
            {firstEdit && (
              <Stack direction={'row'} justifyContent="flex-end" spacing={10} mt={40}>
                <EditCancelConfirmation onResetForm={resetForm} routerLink="/profile/portfolio" />
                <Button variant="contained" sx={{ width: 140 }} type="submit">
                  Next
                </Button>
              </Stack>
            )}
            {!firstEdit && (
              <LoadingButton loading={loading} variant="contained" sx={{ width: 140, mt: 40 }} type="submit">
                Submit
              </LoadingButton>
            )}
          </Box>
        </Stack>
      )}
    </Formik>
  )
}

const PreferenceItemsPage: React.FC = () => {
  const router = useRouter()
  const { userId } = useSelector((state: RootState) => state.user)
  const goBack = () => {
    router.push(`/profile/portfolio?id=${userId}`)
  }
  return (
    <section>
      <Head>
        <title>Edit Portfolio | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>
      <EditLayout tabsList={resumeTabsList} title="Edit portfolio" goBack={goBack}>
        <PreferenceItems />
      </EditLayout>
    </section>
  )
}

export default PreferenceItemsPage

import { Box, Button, ListSubheader, MenuItem, OutlinedInput, Select, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'
import { LoadingButton } from '@mui/lab'
import FormItem from 'bounceComponents/common/FormItem'
import { useGetOptionsData } from 'bounceHooks/useOptionsData'
import { usePersonalResume } from 'bounceHooks/profile/useUpdateBasic'
import EditLayout, { resumeTabsList } from 'bounceComponents/company/EditLayout'
import { FormType, IUpdatePersonalParams } from 'api/profile/type'
import EditCancelConfirmation from 'bounceComponents/profile/components/EditCancelConfirmation'
import { ResumeActionType } from 'bounceComponents/profile/components/ResumeContextProvider'
import { LeavePageWarn } from 'bounceComponents/common/LeavePageWarn'
import { formCheckValid } from 'utils'
import { useUserInfo } from 'state/users/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const SKILLS_LENGTH = 140

const validationSchema = yup.object({
  primaryRole: yup.number().required(formCheckValid('Primary Role', FormType.Select)),
  years: yup.number().required(formCheckValid('Experience', FormType.Select)),
  skills: yup
    .string()
    .trim()
    .required('Please tell employers more about your skills...')
    .max(SKILLS_LENGTH, `Allow only no more than ${SKILLS_LENGTH} letters`)
})

export interface IJobOverviewProps {
  resumeProfileValues?: IUpdatePersonalParams
  firstEdit?: boolean
  resumeProfileDispatch?: (val: any) => void
}

export const JobOverview: React.FC<IJobOverviewProps> = ({ resumeProfileValues, firstEdit, resumeProfileDispatch }) => {
  const { userInfo } = useUserInfo()

  const initialValues = {
    primaryRole: resumeProfileValues?.primaryRole || userInfo?.primaryRole || '',
    years: resumeProfileValues?.years || userInfo?.years || '',
    skills: resumeProfileValues?.skills || userInfo?.skills || ''
  }
  const { loading, runAsync: runPersonalResume } = usePersonalResume()

  const handleSubmit = (values: { skills: string }) => {
    if (firstEdit && resumeProfileDispatch) {
      return resumeProfileDispatch({
        type: ResumeActionType.SetJobOverview,
        payload: {
          ...resumeProfileValues,
          ...values,
          skills: values.skills.trim()
        }
      })
    }
    runPersonalResume({ ...values, skills: values.skills.trim() })
  }

  const { optionsData } = useGetOptionsData()

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, dirty }) => (
        <Stack component={Form} spacing={20} noValidate>
          <LeavePageWarn dirty={dirty || !!(firstEdit && resumeProfileValues?.activeStep !== 4)} />
          {firstEdit && (
            <Typography variant="h2" mb={20}>
              Introduce yourself
            </Typography>
          )}
          <FormItem name="primaryRole" required label="Primary Role">
            <Select>
              {optionsData?.data?.primaryRoleOpt?.map((item, index) => [
                <ListSubheader key={index}>{item.level1Name}</ListSubheader>,
                item.child.map((child, index) => [
                  <MenuItem key={index} value={child.id}>
                    {child.level2Name}
                  </MenuItem>
                ])
              ])}
            </Select>
          </FormItem>
          <FormItem name="years" label="Experience" required>
            <Select>
              {optionsData?.data?.experienceYearOpt.map(item => {
                return (
                  <MenuItem key={item.id} value={item.id}>
                    {item.years}
                  </MenuItem>
                )
              })}
            </Select>
          </FormItem>
          <FormItem name="skills" label=" ">
            <OutlinedInput
              placeholder="Tell employers more about your skills..."
              multiline
              endAdornment={
                <Typography
                  variant="body2"
                  className="endAdorn"
                >{`${values.skills?.length} / ${SKILLS_LENGTH}`}</Typography>
              }
              className="areaInput"
              inputProps={{ sx: { minHeight: 144 } }}
            />
          </FormItem>
          <Box sx={{ textAlign: 'right' }}>
            {firstEdit && (
              <Stack direction={'row'} justifyContent="flex-end" spacing={10} mt={40}>
                <EditCancelConfirmation routerLink="/profile/portfolio" />
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

const JobOverviewPage: React.FC = () => {
  const { userId } = useUserInfo()
  const navigate = useNavigate()
  const goBack = () => {
    navigate(`${routes.profile.portfolio}?id=${userId}`)
  }
  return (
    <section>
      <EditLayout tabsList={resumeTabsList} title="Edit portfolio" goBack={goBack}>
        <JobOverview />
      </EditLayout>
    </section>
  )
}

export default JobOverviewPage

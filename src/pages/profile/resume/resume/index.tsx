import { Box, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { LoadingButton } from '@mui/lab'
import { useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import Head from 'next/head'
import FormItem from 'bounceComponents/common/FormItem'
import { usePersonalResume } from 'bounceHooks/profile/useUpdateBasic'
import { RootState } from '@/store'
import EditLayout, { resumeTabsList } from 'bounceComponents/company/EditLayout'
import ResumeUpload from 'bounceComponents/profile/ResumeFiles/ResumeUpload'
import { IUpdatePersonalParams } from 'api/profile/type'
import { LeavePageWarn } from 'bounceComponents/common/LeavePageWarn'
import EditCancelConfirmation from 'bounceComponents/profile/components/EditCancelConfirmation'

const validationSchema = yup.object({
  resumes: yup.array().of(
    yup.object({
      fileName: yup.string(),
      fileSize: yup.number(),
      fileThumbnailUrl: yup.string(),
      fileType: yup.string(),
      fileUrl: yup.string(),
      id: yup.number()
    })
  )
})

export type IResumeFilesProps = {
  firstEdit?: boolean
  resumeProfileValues?: IUpdatePersonalParams
}

export const ResumeFiles: React.FC<IResumeFilesProps> = ({ firstEdit, resumeProfileValues }) => {
  const { userInfo } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const [formDirty, setFormDirty] = useState<boolean>(false)

  useEffect(() => {
    if (firstEdit) {
      setFormDirty(true)
    }
  }, [firstEdit])

  const initialValues = {
    resumes: userInfo?.resumes || []
  }
  const { loading, runAsync: runPersonalResume } = usePersonalResume()

  const handleSubmit = (values, e) => {
    setFormDirty(false)
    if (firstEdit) {
      return runPersonalResume?.({
        ...resumeProfileValues,
        resumes: values.resumes
      }).then(() => {
        e?.resetForm()
        router.push('/profile/portfolio')
      })
    }
    runPersonalResume(values)
  }

  return (
    <Box>
      <Stack direction={'row'} alignItems="center">
        <Typography variant="h2">Upload your resume</Typography>
        <Typography variant="body1" color="var(--ps-gray-700)" sx={{ ml: 10 }}>
          (Optional)
        </Typography>
      </Stack>
      <Typography
        variant="body2"
        color="var(--ps-gray-600)"
        sx={{ lineHeight: '20px', mb: 37 }}
      >{`(PDF, PPTX Files, Size<50M, Max 3)`}</Typography>
      <Formik
        validationSchema={validationSchema}
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, setFieldValue, dirty, resetForm }) => {
          return (
            <Stack component={Form} spacing={20} noValidate>
              <LeavePageWarn dirty={formDirty} />
              <FormItem label="" name="resumes" fieldType="custom">
                <ResumeUpload
                  value={values.resumes}
                  onChange={files => {
                    setFieldValue('resumes', files)
                    setFormDirty(true)
                  }}
                  maxNum={3}
                  accept={[
                    'application/pdf',
                    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
                  ]}
                  tips={'Only PDF, PPTX Files, Size<50M'}
                  limitSize={50}
                />
              </FormItem>
              <Box sx={{ textAlign: 'right' }}>
                {firstEdit && (
                  <Stack direction={'row'} justifyContent="flex-end" spacing={10} mt={40}>
                    <EditCancelConfirmation onResetForm={resetForm} routerLink="/profile/portfolio" />
                    <LoadingButton variant="contained" sx={{ width: 140 }} type="submit">
                      Submit
                    </LoadingButton>
                  </Stack>
                )}
                {!firstEdit && (
                  <LoadingButton
                    loading={loading}
                    loadingPosition="start"
                    startIcon={<></>}
                    variant="contained"
                    sx={{ width: 140, mt: 40, textAlign: 'right' }}
                    type="submit"
                  >
                    Submit
                  </LoadingButton>
                )}
              </Box>
            </Stack>
          )
        }}
      </Formik>
    </Box>
  )
}

const ResumeFilesPage: React.FC = () => {
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
        <ResumeFiles />
      </EditLayout>
    </section>
  )
}

export default ResumeFilesPage

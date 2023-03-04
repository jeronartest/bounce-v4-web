import { Box, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'
import { LoadingButton } from '@mui/lab'
import { useSelector } from 'react-redux'
import ResumeUpload from './ResumeUpload'
import UploadItem from 'bounceComponents/common/UploadCard/UploadItem'
import FormItem from 'bounceComponents/common/FormItem'
import UploadList from 'bounceComponents/common/UploadCard'
import { usePersonalResume } from 'bounceHooks/profile/useUpdateBasic'
import { RootState } from '@/store'

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

const ResumeFiles: React.FC = () => {
  const { userInfo } = useSelector((state: RootState) => state.user)

  const initialValues = {
    resumes: userInfo?.resumes || []
  }
  const { loading, runAsync: runPersonalResume } = usePersonalResume()

  const handleSubmit = values => {
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
        {({ values, setFieldValue }) => (
          <Stack component={Form} spacing={20} noValidate>
            <FormItem label="" name="resumes" fieldType="custom">
              <ResumeUpload
                value={values.resumes}
                onChange={files => {
                  setFieldValue('resumes', files)
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
            </Box>
          </Stack>
        )}
      </Formik>
    </Box>
  )
}

export default ResumeFiles

import { Button, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'
import EditCancelConfirmation from '../EditCancelConfirmation'
import styles from './styles'
import UploadItem from '@/components/common/UploadCard/UploadItem'
import FormItem from '@/components/common/FormItem'
import { IFileType } from '@/api/upload/type'
import { LeavePageWarn } from '@/components/common/LeavePageWarn'

const validationSchema = yup.object({
  avatar: yup.object({
    fileName: yup.string(),
    fileSize: yup.number(),
    fileThumbnailUrl: yup.string(),
    fileType: yup.string(),
    fileUrl: yup.string().required('Please upload your Profile Picture'),
    id: yup.number(),
  }),
})

export interface IUploadAvatarProps {
  cancelLink?: string
  avatar: IFileType
  onSubmit: (values: any) => void
}

const UploadAvatar: React.FC<IUploadAvatarProps> = ({ avatar, cancelLink, onSubmit }) => {
  const initialValues = {
    avatar: avatar || {
      fileName: '',
      fileSize: 0,
      fileThumbnailUrl: '',
      fileType: '',
      fileUrl: '',
      id: 0,
    },
  }

  return (
    <Formik initialValues={initialValues} validationSchema={validationSchema} enableReinitialize onSubmit={onSubmit}>
      {({ values, setFieldValue, dirty, resetForm }) => {
        return (
          <Stack component={Form} noValidate>
            <LeavePageWarn dirty={dirty || !!avatar?.fileUrl} />
            <Typography variant="h2" mb={40}>
              Upload a profile picture
            </Typography>
            <FormItem
              label="Profile Picture"
              name="avatar"
              tips="(JPEG, PNG, WEBP Files, Size<10M)"
              fieldType="custom"
              sx={styles.fileItem}
            >
              <UploadItem
                value={{
                  fileUrl: values.avatar.fileThumbnailUrl || values.avatar.fileUrl,
                }}
                onChange={(file) => {
                  setFieldValue('avatar', file)
                }}
                sx={{ width: 240, height: 240, display: 'flex', borderRadius: '50%', objectFit: 'cover' }}
                accept={['image/jpeg', 'image/png', 'image/webp']}
                tips={'Only JPEG, PNG, WEBP Files, Size<10M'}
                limitSize={10}
              />
            </FormItem>
            <Stack direction={'row'} justifyContent="flex-end" spacing={10}>
              <EditCancelConfirmation routerLink={cancelLink} onResetForm={resetForm} />
              <Button variant="contained" sx={{ width: 140 }} type="submit">
                Next
              </Button>
            </Stack>
          </Stack>
        )
      }}
    </Formik>
  )
}

export default UploadAvatar

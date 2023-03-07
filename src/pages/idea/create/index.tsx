import { Box, Button, Container, MenuItem, OutlinedInput, Paper, Select, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useMemo, useState } from 'react'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'
import { show } from '@ebay/nice-modal-react'
import styles from './styles'
import FormItem from 'bounceComponents/common/FormItem'
import ResumeUpload from 'bounceComponents/profile/ResumeFiles/ResumeUpload'
import { createUpdateIdea, deleteIdea, getIdeaDetail } from 'api/idea'
import { IIdeaDetail, IUpdateIdeaParams } from 'api/idea/type'
import { ReactComponent as DeleteSVG } from 'bounceComponents/profile/ResumeFiles/assets/delete.svg'
import DialogTips from 'bounceComponents/common/DialogTips'
import { formCheckValid } from 'utils'
import { FormType } from 'api/profile/type'
import { useOptionDatas } from 'state/configOptions/hooks'
import { useQueryParams } from 'hooks/useQueryParams'
import { useUserInfo } from 'state/users/hooks'
import { routes } from 'constants/routes'
import { useNavigate } from 'react-router-dom'

const SUMMARY_INFO_LENGTH = 140
const DETAILS_INFO_LENGTH = 3000

const validationSchema = yup.object({
  title: yup
    .string()
    .trim()
    .required(formCheckValid('Title', FormType.Input))
    .max(300, 'Allow only no more than 300 letters')
    .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect title'),
  summary: yup
    .string()
    .trim()
    .required('Please enter the summary of the Idea')
    .max(SUMMARY_INFO_LENGTH, `Allow only no more than ${SUMMARY_INFO_LENGTH} letters`),
  marketType: yup.number().required(formCheckValid('Market Category', FormType.Select)),
  detail: yup
    .string()
    .trim()
    .required('Please introduce the idea in details')
    .max(DETAILS_INFO_LENGTH, `Allow only no more than ${DETAILS_INFO_LENGTH} letters`),
  posts: yup.array().of(
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

const IdeaCreate: React.FC = () => {
  const optionDatas = useOptionDatas()
  const { id } = useQueryParams()
  const ideaId = useMemo(() => Number(id), [id])
  const [loading, setLoading] = useState<boolean>(false)
  const [ideaDetail, setIdeaDetail] = useState<IIdeaDetail | null>(null)
  const { userId } = useUserInfo()
  const navigate = useNavigate()

  useEffect(() => {
    const getDetail = async () => {
      const res = await getIdeaDetail({ ideaId: Number(ideaId) })
      setIdeaDetail(res?.data)
    }
    if (ideaId) {
      getDetail()
    }
  }, [ideaId])

  const initialValues = useMemo(() => {
    return {
      title: ideaDetail?.title || '',
      summary: ideaDetail?.summary || '',
      marketType: ideaDetail?.marketType || 0,
      detail: ideaDetail?.detail || '',
      posts: ideaDetail?.posts || [],
      id: ideaDetail?.id || ideaId || 0
    }
  }, [ideaDetail, ideaId])

  const handleSubmit = (values: IUpdateIdeaParams) => {
    setLoading(true)
    createUpdateIdea({
      ...values,
      title: values.title?.trim(),
      summary: values.summary?.trim(),
      detail: values.detail?.trim()
    })
      .then(res => {
        toast.success(`${ideaId ? 'Save' : 'Propose'} idea succeed`)
        navigate(`${routes.idea.detail}?id=${res.data?.ideaId}`)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const deleteIdeaItem = () => {
    deleteIdea({ ideaId: Number(ideaId) }).then(res => {
      if (res.code === 200) {
        toast.success('Delete succeed')
        setTimeout(() => {
          window.history.go(-1)
        }, 300)
      } else {
        toast.error('Delete failed')
      }
    })
  }

  const handleDelete = () => {
    show(DialogTips, {
      title: 'Delete the idea',
      onAgain: deleteIdeaItem,
      content: <Typography variant="body1">Are you sure you want to delete this idea?</Typography>,
      cancelBtn: 'Cancel',
      againBtn: 'Delete',
      iconType: 'error'
    })
  }

  return (
    <section>
      <Container maxWidth="md">
        <Paper elevation={0} sx={styles.rootPaper}>
          <Typography variant="h2">{!!ideaId ? 'Edit the idea' : 'Propose an idea'}</Typography>
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
            enableReinitialize
          >
            {({ values, setFieldValue }) => {
              return (
                <Stack component={Form} spacing={20} mt={40} noValidate>
                  <FormItem name="title" label="Title" required>
                    <OutlinedInput />
                  </FormItem>
                  <FormItem name="summary" label=" ">
                    <OutlinedInput
                      placeholder="Enter the summary of the Idea"
                      multiline
                      endAdornment={
                        <Typography
                          variant="body2"
                          className="endAdorn"
                        >{`${values?.summary?.length} / ${SUMMARY_INFO_LENGTH}`}</Typography>
                      }
                      className="areaInput"
                      inputProps={{ sx: { minHeight: 84 } }}
                    />
                  </FormItem>
                  <FormItem name="marketType" label="Market Category" required>
                    <Select>
                      {optionDatas?.marketTypeOpt
                        ?.filter(item => item?.id !== 1)
                        ?.map(item => {
                          return (
                            <MenuItem key={item.id} value={Number(item.id)}>
                              {item.marketType}
                            </MenuItem>
                          )
                        })}
                    </Select>
                  </FormItem>
                  <FormItem name="detail" label=" ">
                    <OutlinedInput
                      placeholder="Introduce the idea in details..."
                      multiline
                      endAdornment={
                        <Typography
                          variant="body2"
                          className="endAdorn"
                        >{`${values?.detail?.length} / ${DETAILS_INFO_LENGTH}`}</Typography>
                      }
                      className="areaInput"
                      inputProps={{ sx: { minHeight: 144 } }}
                    />
                  </FormItem>
                  <Box style={{ marginTop: 32 }}>
                    <Typography variant="h4">Upload files</Typography>
                    <Typography variant="body2">{`(Size<50M, Max 3)`}</Typography>
                  </Box>

                  <FormItem label="" name="posts" fieldType="custom">
                    <ResumeUpload
                      value={values.posts}
                      onChange={files => {
                        setFieldValue('posts', files)
                      }}
                      tips={'Only Size<50M'}
                      maxNum={3}
                      limitSize={50}
                    />
                  </FormItem>
                  <Stack
                    direction={'row'}
                    justifyContent={ideaId ? 'space-between' : 'flex-end'}
                    style={{ marginTop: 40 }}
                  >
                    {!!ideaId && ideaDetail?.userId === userId ? (
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', ml: 16, cursor: 'pointer' }}
                        onClick={handleDelete}
                      >
                        <Typography variant="body1" sx={{ mr: 4 }}>
                          Delete record
                        </Typography>
                        <DeleteSVG />
                      </Box>
                    ) : (
                      <Box></Box>
                    )}
                    <Stack direction={'row'} justifyContent="flex-end" spacing={10}>
                      <Button variant="outlined" sx={{ width: 120 }} onClick={() => window.history.go(-1)}>
                        Cancel
                      </Button>
                      <LoadingButton loading={loading} variant="contained" sx={{ width: 120 }} type="submit">
                        {ideaId ? 'Save' : 'Propose'}
                      </LoadingButton>
                    </Stack>
                  </Stack>
                </Stack>
              )
            }}
          </Formik>
        </Paper>
      </Container>
    </section>
  )
}

export default IdeaCreate

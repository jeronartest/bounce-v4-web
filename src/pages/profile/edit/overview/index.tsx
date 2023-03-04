import { Box, Button, ListSubheader, MenuItem, OutlinedInput, Select, Stack, Typography } from '@mui/material'
import { Form, Formik } from 'formik'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import Head from 'next/head'
import styles from './styles'
import FormItem from 'bounceComponents/common/FormItem'
import { RootState } from '@/store'
import { useUpdateBasic } from 'bounceHooks/profile/useUpdateBasic'
import UploadItem from 'bounceComponents/common/UploadCard/UploadItem'
import LocationTimeZone, { timezone } from 'bounceComponents/common/LocationTimeZone'
import SearchInput, { ISearchOption } from 'bounceComponents/common/SearchInput'
import { searchCompanyInfo, searchEduInfo } from 'api/optionsData'
// import DefaultAvaSVG from 'assets/imgs/components/defaultAva.svg'
import EditLayout, { profileTabsList } from 'bounceComponents/company/EditLayout'
import { ActionType } from 'bounceComponents/profile/components/BasicContextProvider'
import { FormType, IupdateBasicParams } from 'api/profile/type'
import EditCancelConfirmation from 'bounceComponents/profile/components/EditCancelConfirmation'
import { LeavePageWarn } from 'bounceComponents/common/LeavePageWarn'
import { formCheckValid } from '@/utils'
import CompanyDefaultSVG from 'assets/imgs/defaultAvatar/company.svg'
import EducationDefaultSVG from 'assets/imgs/defaultAvatar/education.svg'

const DESCRIPTION_LENGTH = 350

const validationSchema = yup.object({
  avatar: yup.object({
    fileName: yup.string(),
    fileSize: yup.number(),
    fileThumbnailUrl: yup.string(),
    fileType: yup.string(),
    fileUrl: yup.string().required('Please upload your Profile Picture'),
    id: yup.number()
  }),
  fullName: yup
    .string()
    .trim()
    .required(formCheckValid('Full name', FormType.Input))
    .max(300, 'Allow only no more than 300 letters')
    .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect full name'),
  publicRole: yup
    .array()
    .of(yup.number())
    .required(formCheckValid('Public Role', FormType.Select))
    .min(1, formCheckValid('Public Role', FormType.Select))
    .max(2, 'Allow only no more than 2 Public Role'),
  companyRole: yup.number().required(formCheckValid('Company Role', FormType.Select)),
  description: yup
    .string()
    .trim()
    .required('Please introduce yourself, highlight your past experiences and ambitions for the future...')
    .max(DESCRIPTION_LENGTH, `Allow only no more than ${DESCRIPTION_LENGTH} letters`),
  location: yup.string().required(formCheckValid('location（time zone）', FormType.Select)),
  university: yup.object({
    name: yup.string(),
    avatar: yup.string(),
    link: yup.string()
  }),
  company: yup.object({
    name: yup.string(),
    avatar: yup.string(),
    link: yup.string()
  })
})

export interface IEditProps {
  basicProfileValues?: IupdateBasicParams
  firstEdit?: boolean
  basicProfileDispatch?: (val: any) => void
}

export const BasicOverview: React.FC<IEditProps> = ({ firstEdit, basicProfileDispatch, basicProfileValues }) => {
  const optionDatas = useSelector((state: RootState) => state.configOptions.optionDatas)
  const { userInfo } = useSelector((state: RootState) => state.user)
  const [eduOptions, setEduOptions] = useState<ISearchOption[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [companyOptions, setCompanyOptions] = useState<ISearchOption[]>([])
  const [comSearchText, setComSearchText] = useState<string>('')
  const [first, setfirst] = useState<boolean>(true)

  useEffect(() => {
    if (first) {
      return
    }
    searchEduInfo({
      limit: 100,
      offset: 0,
      value: searchText
    }).then(res => {
      const { code, data } = res
      if (code !== 200) {
        toast.error('search error')
      }
      setEduOptions(
        data.list.map(v => {
          return {
            label: v.name,
            icon: v.avatar || EducationDefaultSVG,
            value: v
          }
        })
      )
    })
  }, [searchText, first])

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
      setCompanyOptions(
        data.list.map(v => {
          return {
            label: v.name,
            icon: v.avatar || CompanyDefaultSVG,
            value: v
          }
        })
      )
    })
  }, [comSearchText])

  const { loading, runAsync: runUpdateBasic } = useUpdateBasic()

  const initialValues = {
    avatar: basicProfileValues?.avatar ||
      userInfo?.avatar || {
        fileName: '',
        fileSize: 0,
        fileThumbnailUrl: '',
        fileType: '',
        fileUrl: '',
        id: 0
      },
    fullName: basicProfileValues?.fullName || userInfo?.fullName || '',
    publicRole: basicProfileValues?.publicRole || userInfo?.publicRole || [],
    companyRole: basicProfileValues?.companyRole || userInfo?.companyRole || '',
    description: basicProfileValues?.description || userInfo?.description || '',

    company: basicProfileValues?.company ||
      userInfo?.company || {
        avatar: '',
        link: '',
        name: ''
      },
    companyId: basicProfileValues?.companyId || userInfo?.companyId || 0,
    thirdpartId: basicProfileValues?.thirdpartId || userInfo?.thirdpartId || 0,

    location: basicProfileValues?.location || userInfo?.location || '',
    timezone: timezone.toString(),
    university: basicProfileValues?.university ||
      userInfo?.university || {
        avatar: '',
        link: '',
        name: ''
      }
  }

  const handleSubmit = values => {
    if (firstEdit) {
      return basicProfileDispatch?.({
        type: ActionType.SetIntro,
        payload: {
          ...values
        }
      })
    }
    runUpdateBasic(values)
  }

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ values, setFieldValue, dirty }) => {
        return (
          <Stack component={Form} spacing={20} noValidate>
            <LeavePageWarn dirty={dirty || (firstEdit && basicProfileValues?.activeStep !== 3)} />
            {firstEdit && <Typography variant="h2">Tell us about yourself</Typography>}
            {!firstEdit && (
              <FormItem
                label="Profile Picture"
                name="avatar"
                tips="(JPEG, PNG, WEBP Files, Size<10M)"
                fieldType="custom"
                sx={styles.fileItem}
              >
                <UploadItem
                  value={{
                    fileUrl: values.avatar.fileThumbnailUrl || values.avatar.fileUrl
                  }}
                  onChange={file => {
                    setFieldValue('avatar', file)
                  }}
                  sx={{ width: 160, height: 160, display: 'flex', borderRadius: '50%', objectFit: 'cover' }}
                  accept={['image/jpeg', 'image/png', 'image/webp']}
                  tips={'Only JPEG, PNG, WEBP Files, Size<10M'}
                  limitSize={10}
                />
              </FormItem>
            )}

            <FormItem name="fullName" label="Full name" required style={{ marginTop: 40 }}>
              <OutlinedInput />
            </FormItem>
            <FormItem name="location" label="Location (Time Zone)" required fieldType="custom">
              <LocationTimeZone value={values.location} onChange={val => setFieldValue('location', val)} />
            </FormItem>
            <FormItem name="publicRole" label="Public Role (Max 2)" required>
              <Select multiple>
                {optionDatas?.publicRoleOpt?.map(item => {
                  return (
                    <MenuItem key={item.id} value={item.id}>
                      {item.role}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormItem>
            <FormItem name="university" label="Education" fieldType="custom">
              <SearchInput
                options={eduOptions}
                selected={{
                  label: values.university.name,
                  icon: values.university.avatar,
                  value: values.university
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
            <FormItem name="company" label="Company" fieldType="custom">
              <SearchInput
                options={companyOptions}
                selected={{
                  label: values.company.name,
                  icon: values.company.avatar,
                  value: {
                    ...values.company,
                    companyId: values.companyId,
                    thirdpartId: values.thirdpartId
                  }
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
            <FormItem name="companyRole" label="Company Role" required>
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
            <FormItem name="description" label=" ">
              <OutlinedInput
                placeholder="Introduce yourself, highlight your past experiences and ambitions for the future..."
                multiline
                endAdornment={
                  <Typography
                    variant="body2"
                    className="endAdorn"
                  >{`${values.description?.length} / ${DESCRIPTION_LENGTH}`}</Typography>
                }
                inputProps={{ sx: { minHeight: 144 } }}
              />
            </FormItem>
            <Box sx={{ textAlign: 'right' }}>
              {firstEdit && (
                <Stack direction={'row'} justifyContent="flex-end" spacing={10} mt={40}>
                  <EditCancelConfirmation routerLink="/profile/summary" />
                  <Button variant="contained" sx={{ width: 140 }} type="submit">
                    Next
                  </Button>
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
  )
}

const BasicOverviewPage: React.FC = () => {
  const router = useRouter()
  const { userId } = useSelector((state: RootState) => state.user)
  const goBack = () => {
    router.push(`/profile/summary?id=${userId}`)
  }
  return (
    <section>
      <Head>
        <title>Edit Summary | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>
      <EditLayout tabsList={profileTabsList} title="Edit summary" goBack={goBack}>
        <BasicOverview />
      </EditLayout>
    </section>
  )
}

export default BasicOverviewPage

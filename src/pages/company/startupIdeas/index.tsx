import { Box, Button, Container, Link, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Stack } from '@mui/system'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import Head from 'next/head'
import StartupIdeas from '@/components/market/components/StartupIdeas'
import DefaultAvaSVG from '@/assets/imgs/components/defaultAva.svg'
import TopSearchLayout from '@/components/market/TopSearchLayout/idnex'
import FormItem from '@/components/common/FormItem'
import SearchInput, { ISearchOption } from '@/components/common/SearchInput'
import { searchCreator, searchUser } from '@/api/optionsData'
import { USER_TYPE } from '@/api/user/type'

export type IStartupIdeasPageProps = {}
const validationSchema = yup.object({
  user: yup.object({
    id: yup.number(),
    fullName: yup.string(),
    avatar: yup.string(),
  }),
})
const StartupIdeasPage: React.FC<IStartupIdeasPageProps> = ({}) => {
  const [userData, setUserData] = useState<ISearchOption[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [userId, setUserId] = useState<number>(0)
  const initialValues = {
    user: {
      id: '',
      fullName: '',
      avatar: '',
    },
  }
  useEffect(() => {
    searchCreator({
      limit: 100,
      offset: 0,
      creatorName: searchText,
    }).then((res) => {
      const { code, data } = res
      if (code !== 200) {
        toast.error('search error')
      }
      const temp = data?.list?.map((v) => {
        return {
          label: v?.fullName,
          icon: v?.avatar || DefaultAvaSVG,
          value: v,
        }
      })
      setUserData(temp)
    })
  }, [searchText])

  const handleSubmit = (values: typeof initialValues) => {
    setUserId(Number(values.user.id))
  }
  return (
    <section>
      <Head>
        <title>Startup Ideas | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>

      <TopSearchLayout title={'Startup Ideas'} centerBox={<StartupIdeas userId={userId} />}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
          {({ setFieldValue, values }) => (
            <Stack direction={'row'} spacing={20} component={Form}>
              <FormItem
                name="user"
                label="Search by creator name"
                sx={{
                  width: 976,
                  '.MuiOutlinedInput-root': {
                    background: 'var(--ps-black)',
                    border: '1px solid #484848',
                    color: 'var(--ps-white)',
                  },
                  '.MuiOutlinedInput-notchedOutline': { border: 0 },
                }}
                fieldType="custom"
              >
                <SearchInput
                  options={userData}
                  selected={{
                    label: values?.user?.fullName,
                    icon: values?.user?.avatar,
                    value: values?.user,
                  }}
                  filterOptions={(list) => list}
                  loadingText={'No result'}
                  renderOption={(option) => {
                    return (
                      <span>
                        {option?.label}
                        {option?.value?.userType === USER_TYPE.USER && (
                          <span style={{ color: 'rgba(23, 23, 23, 0.7)', marginLeft: 8 }}>
                            #{option?.value?.fullNameId}
                          </span>
                        )}
                      </span>
                    )
                  }}
                  onSearch={(text: string) => setSearchText(text)}
                  value={values?.user?.fullName}
                  onChange={(e, newValue) => {
                    setSearchText(newValue)
                    setFieldValue('user', { fullName: newValue, avatar: '', id: '' })
                  }}
                  onSelect={(e, newVal) => setFieldValue('user', newVal.value)}
                />
              </FormItem>
              <Button
                type="submit"
                sx={{
                  width: 204,
                  '&.MuiButton-textPrimary': {
                    background: 'var(--ps-blue)',
                    color: 'var(--ps-white)',
                    '&:hover': {
                      background: 'var(--ps-blue-50)',
                    },
                    '&:active': {
                      background: 'var(--ps-blue-100)',
                    },
                  },
                }}
              >
                Search
              </Button>
            </Stack>
          )}
        </Formik>
      </TopSearchLayout>
    </section>
  )
}

export default StartupIdeasPage

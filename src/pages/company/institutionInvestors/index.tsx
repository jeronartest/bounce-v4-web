import { Button, OutlinedInput } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Stack } from '@mui/system'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import Head from 'next/head'
import TopSearchLayout from '@/components/market/TopSearchLayout/idnex'
import FormItem from '@/components/common/FormItem'
import SearchInput, { ISearchOption } from '@/components/common/SearchInput'
import { searchUser } from '@/api/optionsData'
import DefaultAvaSVG from '@/assets/imgs/components/defaultAva.svg'
import Institution from '@/components/market/components/Institution'

export type IInstitutionInvestorsProps = {}
const validationSchema = yup.object({
  user: yup.string()
})
const InstitutionInvestors: React.FC<IInstitutionInvestorsProps> = ({}) => {
  const [userName, setUserName] = useState<string>('')
  const initialValues = {
    user: ''
  }

  const handleSubmit = (values: typeof initialValues) => {
    setUserName(values.user)
  }

  return (
    <section>
      <Head>
        <title>Institution Investors | Bounce</title>
        <meta name="description" content="" />
        <meta name="keywords" content="Bounce" />
      </Head>

      <TopSearchLayout title={'Institution Investors'} centerBox={<Institution userName={userName} />}>
        <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
          {() => (
            <Stack direction={'row'} spacing={20} component={Form}>
              <FormItem
                name="user"
                label="Search by company name"
                sx={{
                  width: 976,
                  '.MuiOutlinedInput-root': {
                    background: 'var(--ps-black)',
                    border: '1px solid #484848',
                    color: 'var(--ps-white)'
                  },
                  '.MuiOutlinedInput-notchedOutline': { border: 0 }
                }}
              >
                <OutlinedInput />
              </FormItem>
              <Button
                type="submit"
                sx={{
                  width: 204,
                  '&.MuiButton-textPrimary': {
                    background: 'var(--ps-blue)',
                    color: 'var(--ps-white)',
                    '&:hover': {
                      background: 'var(--ps-blue-50)'
                    },
                    '&:active': {
                      background: 'var(--ps-blue-100)'
                    }
                  }
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

export default InstitutionInvestors

//  TopCompanies

import { Button, OutlinedInput } from '@mui/material'
import React, { useState } from 'react'
import { Stack } from '@mui/system'
import { Form, Formik } from 'formik'
import * as yup from 'yup'
import TopSearchLayout from 'bounceComponents/market/TopSearchLayout/idnex'
import FormItem from 'bounceComponents/common/FormItem'
// import SearchInput, { ISearchOption } from 'bounceComponents/common/SearchInput'
// import { searchUser } from 'api/optionsData'
// import DefaultAvaSVG from 'assets/imgs/components/defaultAva.svg'
import Companies from 'bounceComponents/market/components/Companies'

// export type ITopCompaniesProps = {}
const validationSchema = yup.object({
  user: yup.string()
})
const TopCompanies: React.FC = ({}) => {
  const [userName, setUserName] = useState<string>('')

  const initialValues = {
    user: ''
  }

  const handleSubmit = (values: typeof initialValues) => {
    setUserName(values.user)
  }

  return (
    <section>
      <TopSearchLayout title={'Top Companies'} centerBox={<Companies userName={userName} />}>
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

export default TopCompanies

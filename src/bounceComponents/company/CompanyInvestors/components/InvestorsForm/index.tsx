import { Stack } from '@mui/system'
import { Formik, Form } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import * as yup from 'yup'
import { Button, Grid, MenuItem, Select } from '@mui/material'
import { useModal } from '@ebay/nice-modal-react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import FormItem from 'bounceComponents/common/FormItem'
import { ReactComponent as DeleteIcon } from 'assets/imgs/components/delete.svg'
import SearchInput, { ISearchOption } from 'bounceComponents/common/SearchInput'
import { searchUser } from 'api/optionsData'
import { RootState } from '@/store'
import { ICompanyInvestorsListItems } from 'api/company/type'
import { formCheckValid } from '@/utils'
import { FormType } from 'api/profile/type'
import CompanyDefaultSVG from 'assets/imgs/defaultAvatar/company.svg'
import DefaultAvatarSVG from 'assets/imgs/profile/yellow_avatar.svg'

export type IInvestorsFormProps = {
  onAdd?: (data: ICompanyInvestorsListItems) => void
  onEdit?: (data: ICompanyInvestorsListItems, index: number) => void
  editData?: { data: any; index: number }
  onDelete?: (index: number) => void
}

const validationSchema = yup.object({
  userInfo: yup.object({
    id: yup.number(),
    name: yup
      .string()
      .trim()
      .required(formCheckValid('Full name', FormType.Input))
      .max(300, 'Allow only no more than 300 letters')
      .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect full name'),
    avatar: yup.string()
  }),
  investorType: yup.string().required(formCheckValid('Investor type', FormType.Select))
})

const InvestorsForm: React.FC<IInvestorsFormProps> = ({ onAdd, editData, onEdit, onDelete }) => {
  const modal = useModal()
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)

  const initialValues = editData
    ? editData.data
    : {
        userInfo: {
          link: '',
          name: '',
          avatar: ''
        },
        investorType: '',
        userId: 0,
        thirdpartId: 0,
        linkedinName: '',
        companyId: 0
      }

  const handleSubmit = useCallback(
    (values: typeof initialValues) => {
      if (!editData) {
        onAdd?.(values)
      } else {
        onEdit?.(values, editData.index)
      }
      modal.hide()
    },
    [editData, modal, onAdd, onEdit]
  )

  const handleDelete = useCallback(
    handleReset => {
      if (!editData) {
        handleReset()
      } else {
        onDelete?.(editData.index)
        modal.hide()
      }
    },
    [editData, modal, onDelete]
  )

  const [userData, setUserData] = useState<ISearchOption[]>([])
  const [searchText, setSearchText] = useState<string>('')
  const [searchType, setSearchType] = useState<number>(editData?.data?.investorType || 0)

  useEffect(() => {
    searchUser({
      limit: 100,
      offset: 0,
      userType: searchType === 2 ? 3 : searchType,
      value: searchText
    }).then(res => {
      const { code, data } = res
      if (code !== 200) {
        toast.error('System failed. Please try again')
      }
      const temp = data?.list?.map(v => {
        return {
          label: v?.name,
          icon: v?.avatar || (searchType === 2 ? CompanyDefaultSVG : DefaultAvatarSVG),
          value: v
        }
      })
      setUserData(temp)
    })
  }, [searchText, searchType])

  return (
    <Stack>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {({ handleReset, setFieldValue, values }) => (
          <Stack component={Form} spacing={40} noValidate>
            <Grid container spacing={10}>
              <Grid item xs={6}>
                <FormItem name="investorType" label="Investor type" required fieldType="custom">
                  <Select
                    value={values.investorType}
                    onChange={ev => {
                      setSearchType(ev.target.value)
                      setFieldValue('investorType', ev.target.value)
                      setFieldValue('userInfo', {
                        link: '',
                        name: '',
                        avatar: ''
                      })
                      setFieldValue('userId', 0)
                      setFieldValue('thirdpartId', 0)
                      setFieldValue('linkedinName', '')
                      setFieldValue('companyId', 0)
                    }}
                  >
                    {optionDatas?.investorTypeOpt?.map(v => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.investorType}
                      </MenuItem>
                    ))}
                  </Select>
                </FormItem>
              </Grid>
              <Grid item xs={6}>
                <FormItem name="userInfo" label="Full name" required fieldType="custom">
                  <SearchInput
                    options={userData}
                    selected={{
                      label: values.userInfo.name,
                      icon: values.userInfo.avatar,
                      value: values.userInfo
                    }}
                    onSearch={(text: string) => setSearchText(text)}
                    value={values?.userInfo?.name}
                    onChange={(e, newValue) => {
                      setSearchText(newValue)
                      setFieldValue('userInfo', { name: newValue, avatar: '', link: '' })
                    }}
                    onSelect={(e, newVal) => {
                      setFieldValue('userInfo', {
                        avatar: newVal.value.avatar,
                        link: newVal.value.link || '',
                        name: newVal.value.name
                      })
                      setFieldValue('userId', newVal.value.userId)
                      setFieldValue('thirdpartId', newVal.value.thirdpartId)
                      setFieldValue('linkedinName', newVal.value.linkedinName)
                      setFieldValue('companyId', newVal.value.companyId)
                    }}
                  />
                </FormItem>
              </Grid>
            </Grid>
            <Stack direction="row" spacing={10} justifyContent="end">
              <Button variant="outlined" onClick={() => handleDelete(handleReset)}>
                Delete record
                <DeleteIcon style={{ marginLeft: 10 }} />
              </Button>
              <Button type="submit" variant="contained" size="medium" sx={{ width: 120 }}>
                Save
              </Button>
            </Stack>
          </Stack>
        )}
      </Formik>
    </Stack>
  )
}

export default InvestorsForm

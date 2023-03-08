import { Stack } from '@mui/system'
import { Formik, Form } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import * as yup from 'yup'
import { toast } from 'react-toastify'
import { Button, Grid, ListSubheader, MenuItem, Select } from '@mui/material'
import { useModal } from '@ebay/nice-modal-react'
import FormItem from 'bounceComponents/common/FormItem'
import { ReactComponent as DeleteIcon } from 'assets/imgs/components/delete.svg'
import SearchInput, { ISearchOption } from 'bounceComponents/common/SearchInput'
import { searchUser } from 'api/optionsData'
import { ICompanyTeamListItems } from 'api/company/type'
import DefaultAvaSVG from 'assets/imgs/components/defaultAva.svg'
import { formCheckValid } from 'utils'
import { FormType } from 'api/profile/type'
import { useOptionDatas } from 'state/configOptions/hooks'

export type ITeamFormProps = {
  onAdd?: (data: ICompanyTeamListItems) => void
  onEdit?: (data: ICompanyTeamListItems, index: number) => void
  editData?: { data: any; index: number }
  onDelete?: (index: number) => void
}

const validationSchema = yup.object({
  user: yup.object({
    userId: yup.number(),
    name: yup
      .string()
      .required(formCheckValid('Full Name', FormType.Select))
      .max(300, 'Allow only no more than 300 letters')
      .matches(/^[^\u4E00-\u9FA5]+$/g, 'Incorrect full name'),
    avatar: yup.string()
  }),
  roleIds: yup
    .array()
    .of(yup.number())
    .min(1, formCheckValid('Primary Role (Max 2)', FormType.Select))
    .max(2, 'Allow only no more than 2 primary role')
})

const TeamForm: React.FC<ITeamFormProps> = ({ onAdd, editData, onEdit, onDelete }) => {
  const modal = useModal()
  const optionDatas = useOptionDatas()

  const initialValues = editData
    ? editData.data
    : {
        user: {
          userId: 0,
          name: '',
          avatar: ''
        },
        roleIds: []
      }

  const handleSubmit = useCallback(
    (values: typeof initialValues) => {
      const { user, roleIds } = values
      if (!editData) {
        onAdd?.({ userId: user.userId || 0, userAvatar: user.avatar, userName: user.name, roleIds })
      } else {
        onEdit?.({ userId: user.userId || 0, userAvatar: user.avatar, userName: user.name, roleIds }, editData.index)
      }
      modal.hide()
    },
    [editData, modal, onAdd, onEdit]
  )

  const handleDelete = useCallback(
    (handleReset: () => void) => {
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

  useEffect(() => {
    searchUser({
      limit: 100,
      offset: 0,
      userType: 1,
      value: searchText
    }).then(res => {
      const { code, data } = res
      if (code !== 200) {
        toast.error('search error')
      }
      const temp = data?.list?.map((v: any) => {
        return {
          label: v?.name,
          icon: v?.avatar || DefaultAvaSVG,
          value: v
        }
      })
      setUserData(temp)
    })
  }, [searchText])

  return (
    <Stack>
      <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={validationSchema}>
        {({ handleReset, setFieldValue, values }) => (
          <Stack component={Form} spacing={40} noValidate>
            <Grid container spacing={10}>
              <Grid item xs={6}>
                <FormItem name="user" label="Full name" required fieldType="custom">
                  <SearchInput
                    options={userData}
                    selected={{
                      label: values?.user?.name,
                      icon: values?.user?.avatar,
                      value: values?.user
                    }}
                    onSearch={(text: string) => setSearchText(text)}
                    value={values?.user?.name}
                    onChange={(e, newValue) => {
                      setSearchText(newValue)
                      // setFieldValue('user', { name: newValue, avatar: '', id: 0 })
                    }}
                    onSelect={(e, newVal) => setFieldValue('user', newVal.value)}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={6}>
                <FormItem name="roleIds" label="Primary Role (Max 2)" required>
                  <Select multiple>
                    {optionDatas?.primaryRoleOpt?.map((item: any, index: number) => [
                      <ListSubheader key={index}>{item.level1Name}</ListSubheader>,
                      item.child.map((child: any, idx: number) => [
                        <MenuItem key={idx} value={child.id}>
                          {child.level2Name}
                        </MenuItem>
                      ])
                    ])}
                  </Select>
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

export default TeamForm

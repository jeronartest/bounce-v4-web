import { Stack } from '@mui/system'
import { Formik, Form } from 'formik'
import React, { useCallback, useEffect, useState } from 'react'
import * as yup from 'yup'
import { Button, OutlinedInput, Grid, MenuItem, Select, FormControlLabel, Checkbox } from '@mui/material'
import { useModal } from '@ebay/nice-modal-react'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import FormItem from 'bounceComponents/common/FormItem'
import { ReactComponent as DeleteIcon } from 'assets/imgs/components/delete.svg'
import { RootState } from '@/store'
import SearchInput, { ISearchOption } from 'bounceComponents/common/SearchInput'
import DefaultAvaSVG from 'assets/imgs/components/defaultAva.svg'
import { searchToken } from 'api/optionsData'
import { ICompanyTokensListItems } from 'api/company/type'
import { isAddress } from '@/utils/web3/address'
import { formCheckValid } from '@/utils'
import { FormType } from 'api/profile/type'
import TokenDefaultSVG from 'assets/imgs/defaultAvatar/token.svg'

export type ITokensFormProps = {
  onAdd?: (data: ICompanyTokensListItems) => void
  onEdit?: (data: ICompanyTokensListItems, index: number) => void
  editData?: { data: ICompanyTokensListItems; index: number }
  onDelete?: (index: number) => void
}

const validationSchema = yup.object({
  chainIdentifierId: yup.number().required(formCheckValid('Chain', FormType.Select)),
  tokenAddress: yup
    .string()
    .test('CHECK_ADDRESS', 'Incorrect token address', val => {
      if (val && !isAddress(val)) {
        return false
      }
      return true
    })
    .test('CHECK_ISSUED', 'Please input a token contract address', (val, ctx) => {
      if (!val && !ctx.parent.isIssued) {
        return false
      }
      return true
    }),
  tokenName: yup
    .string()
    .test('CHECK_TOKENNAME', formCheckValid('Token name', FormType.Input), (val, ctx) => {
      if (!val && ctx.parent.isIssued) {
        return false
      }
      return true
    })
    .test('CHECK_CHINESE', '', (val, ctx) => {
      if (!/^[^\u4e00-\u9fa5]{0,}$/.test(val)) {
        return ctx.createError({ message: `Incorrect Token name` })
      }
      return true
    }),
  tokenType: yup.number().test('CHECK_TOKENTYPE', formCheckValid('Token Type', FormType.Select), (val, ctx) => {
    if (!val && ctx.parent.isIssued) {
      return false
    }
    return true
  })
})

interface ICheckboxItemsProps {
  value?: boolean
  onChange?: (ev: any, checked: boolean) => void
}

const CheckboxItems: React.FC<ICheckboxItemsProps> = ({ value, onChange }) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={value} value={value} onChange={onChange} />}
      label="Token is not issued"
    />
  )
}

const TokensForm: React.FC<ITokensFormProps> = ({ onAdd, editData, onEdit, onDelete }) => {
  const modal = useModal()
  const { optionDatas } = useSelector((state: RootState) => state.configOptions)

  const initialValues = editData
    ? editData.data
    : {
        chainIdentifierId: '',
        isIssued: false,
        tokenAddress: '',
        tokenLogo: '',
        tokenName: '',
        tokenType: ''
      }

  const handleSubmit = useCallback(
    (values: typeof initialValues) => {
      if (!editData) {
        onAdd?.({ ...values, chainIdentifierId: Number(values.chainIdentifierId), tokenType: Number(values.tokenType) })
      } else {
        onEdit?.(
          { ...values, chainIdentifierId: Number(values.chainIdentifierId), tokenType: Number(values.tokenType) },
          editData.index
        )
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

  useEffect(() => {
    searchToken({
      limit: 100,
      offset: 0,
      value: searchText
    }).then(res => {
      const { code, data } = res
      if (code !== 200) {
        toast.error('search error')
      }
      const temp = data?.list?.map(v => {
        return {
          label: v?.contract,
          icon: v?.smallUrl || TokenDefaultSVG,
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
              <Grid item xs={12}>
                <FormItem name="chainIdentifierId" label="Chain" required>
                  <Select>
                    {optionDatas?.chainInfoOpt.map(v => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.shortName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormItem>
              </Grid>
              <Grid item xs={12}>
                <FormItem name="isIssued" fieldType="custom">
                  <CheckboxItems
                    value={values.isIssued}
                    onChange={val => {
                      setFieldValue('isIssued', val.target.checked)
                      setFieldValue('tokenAddress', '')
                      setFieldValue('tokenName', '')
                      setFieldValue('tokenType', '')
                      setFieldValue('tokenLogo', '')
                    }}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={12}>
                <FormItem name="tokenAddress" label="Token contract address" fieldType="custom">
                  <SearchInput
                    disabled={values.isIssued}
                    options={userData}
                    selected={{
                      label: values.tokenAddress,
                      icon: values.tokenLogo,
                      value: values.tokenAddress
                    }}
                    onSearch={(text: string) => setSearchText(text)}
                    value={values?.tokenAddress}
                    onChange={(e, newValue) => {
                      setSearchText(newValue)
                      setFieldValue('tokenAddress', newValue)
                      setFieldValue('tokenName', '')
                      setFieldValue('tokenType', '')
                      setFieldValue('tokenLogo', '')
                    }}
                    onSelect={(e, newVal) => {
                      setFieldValue('tokenAddress', newVal.value.contract)
                      setFieldValue('tokenName', newVal.value.name)
                      setFieldValue('tokenType', newVal.value.tokenType)
                      setFieldValue('tokenLogo', newVal.value.smallUrl)
                    }}
                  />
                </FormItem>
              </Grid>
              <Grid item xs={12}>
                <FormItem name="tokenName" label="Token name">
                  <OutlinedInput autoComplete="off" disabled={!values.isIssued} />
                </FormItem>
              </Grid>
              <Grid item xs={12}>
                <FormItem name="tokenType" label="Token type">
                  <Select disabled={!values.isIssued}>
                    {optionDatas?.tokenTypeOpt.map(v => (
                      <MenuItem key={v.id} value={v.id}>
                        {v.name}
                      </MenuItem>
                    ))}
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

export default TokensForm

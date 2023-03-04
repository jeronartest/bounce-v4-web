import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { show } from '@ebay/nice-modal-react'
import { useSelector } from 'react-redux'
import { LoadingButton } from '@mui/lab'
import { CompanyActionType } from '../components/CompanyContextProvider'
import Add from './components/Add'
import TokensForm from './components/TokensForm'
import TokensList from './components/TokensList'
import { ReactComponent as AddIcon } from '@/assets/imgs/home/add.svg'
import MuiDialog from '@/components/common/Dialog'
import { useGetCompanyTokens } from '@/hooks/company/useGetCompanyTokens'
import { RootState } from '@/store'
import { useUpdateCompany } from '@/hooks/company/useUpdateCompany'
import { ICompanyProfileParams, ICompanyTokensListItems } from '@/api/company/type'
import { useWarnIfUnsavedChanges } from '@/hooks/profile/useWarnIfUnsavedChanges'
import EditCancelConfirmation from '@/components/profile/components/EditCancelConfirmation'

export type ICompanyTokensProps = {
  companyProfileValues?: ICompanyProfileParams
  firstEdit?: boolean
  companyProfileDispatch?: (val: any) => void
}

const add_text = {
  label: 'Add new company token',
  description: "Nothing to see for now. When you add new company token, they'll show up here.",
}

const CompanyTokens: React.FC<ICompanyTokensProps> = ({ companyProfileValues, firstEdit, companyProfileDispatch }) => {
  const { userId } = useSelector((state: RootState) => state.user)
  const { data, runAsync: runGetCompanyTokens } = useGetCompanyTokens()
  const { runAsync: runUpdateCompany } = useUpdateCompany(firstEdit)

  const [list, setlist] = useState<ICompanyTokensListItems[]>([])
  const [formDirty, setFormDirty] = useState<boolean>(false)

  useWarnIfUnsavedChanges(formDirty)

  useEffect(() => {
    !firstEdit && userId && runGetCompanyTokens({ limit: 100, offset: 0, companyId: Number(userId) })
  }, [runGetCompanyTokens, userId, firstEdit])

  useEffect(() => {
    if (firstEdit) {
      setFormDirty(true)
    }
  }, [firstEdit])

  useEffect(() => {
    if (firstEdit) {
      setlist(companyProfileValues?.companyTokens)
    } else {
      setlist(data?.data?.list)
    }
  }, [data?.data?.list, firstEdit, companyProfileValues?.companyTokens])

  const addList = useCallback(
    (data) => {
      setlist([...list, data])
      setFormDirty(true)
    },
    [list],
  )

  const editList = useCallback(
    (v, i) => {
      const temp = [...list]
      temp.splice(i, 1, v)
      setlist(temp)
      setFormDirty(true)
    },
    [list],
  )

  const handleAdd = useCallback(() => {
    show(MuiDialog, {
      title: 'Add new company token',
      fullWidth: true,
      children: <TokensForm onAdd={addList} />,
    })
  }, [addList])

  const handleSubmit = useCallback(
    (flag) => {
      if (firstEdit) {
        setFormDirty(false)
        return companyProfileDispatch({
          type: CompanyActionType.SetTokens,
          payload: {
            ...companyProfileValues,
            companyTokens: ['DIRECTLY'].includes(flag) ? [] : list,
          },
        })
      }
      runUpdateCompany({ companyTokens: ['DIRECTLY'].includes(flag) ? [] : list }).then(() => setFormDirty(false))
    },
    [list, runUpdateCompany, firstEdit, companyProfileValues, companyProfileDispatch],
  )

  const deleteList = useCallback(
    (i) => {
      const temp = [...list]
      temp.splice(i, 1)
      setlist(temp)
      !temp.length && handleSubmit('DIRECTLY')
      setFormDirty(true)
    },
    [handleSubmit, list],
  )

  if (!list?.length) {
    return (
      <Box>
        <Add {...add_text} onAdd={addList} />
        {firstEdit && (
          <Stack direction={'row'} justifyContent="flex-end" spacing={10} mt={40}>
            <EditCancelConfirmation routerLink="/company/summary" />
            <Button variant="contained" sx={{ width: 140 }} onClick={handleSubmit}>
              Next
            </Button>
          </Stack>
        )}
      </Box>
    )
  }

  return (
    <Stack spacing={40}>
      <TokensList list={list} onEdit={editList} onDelete={deleteList} />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" size="medium" sx={{ width: 120 }} onClick={handleAdd}>
          Add
          <AddIcon color="inherit" style={{ marginLeft: 10 }} />
        </Button>
        {firstEdit && (
          <Stack direction={'row'} justifyContent="flex-end" spacing={10}>
            <EditCancelConfirmation routerLink="/company/summary" />
            <Button variant="contained" sx={{ width: 140 }} onClick={handleSubmit}>
              Next
            </Button>
          </Stack>
        )}
        {!firstEdit && (
          <LoadingButton variant="contained" size="medium" sx={{ width: 140 }} onClick={handleSubmit}>
            Submit
          </LoadingButton>
        )}
      </Stack>
    </Stack>
  )
}

export default CompanyTokens

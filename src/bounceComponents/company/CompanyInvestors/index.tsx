import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { show } from '@ebay/nice-modal-react'
import { LoadingButton } from '@mui/lab'
import { CompanyActionType } from '../components/CompanyContextProvider'
import Add from './components/Add'
import InvestorsForm from './components/InvestorsForm'
import InvestorsList from './components/InvestorsList'
import { ReactComponent as AddIcon } from 'assets/imgs/home/add.svg'
import MuiDialog from 'bounceComponents/common/Dialog'
import { useGetCompanyInvestors } from 'bounceHooks/company/useGetCompanyInvestors'
import { useUpdateCompany } from 'bounceHooks/company/useUpdateCompany'
import { ICompanyInvestorsListItems, ICompanyProfileParams } from 'api/company/type'
import { useWarnIfUnsavedChanges } from 'bounceHooks/profile/useWarnIfUnsavedChanges'
import EditCancelConfirmation from 'bounceComponents/profile/components/EditCancelConfirmation'
import { useUserInfo } from 'state/users/hooks'

export type ICompanyInvestorsProps = {
  companyProfileValues?: ICompanyProfileParams
  firstEdit?: boolean
  companyProfileDispatch?: (val: any) => void
}

const add_text = {
  label: 'Add new investor',
  description: "Nothing to see for now. When you add new investor, they'll show up here."
}

const CompanyInvestors: React.FC<ICompanyInvestorsProps> = ({
  companyProfileValues,
  firstEdit,
  companyProfileDispatch
}) => {
  const { userId } = useUserInfo()

  const { data, runAsync: runGetCompanyInvestors } = useGetCompanyInvestors()
  const { runAsync: runUpdateCompany } = useUpdateCompany(firstEdit)

  const [list, setlist] = useState<ICompanyInvestorsListItems[]>([])
  const [formDirty, setFormDirty] = useState<boolean>(false)
  useWarnIfUnsavedChanges(formDirty)

  useEffect(() => {
    !firstEdit && userId && runGetCompanyInvestors({ limit: 100, offset: 0, companyId: Number(userId) })
  }, [runGetCompanyInvestors, userId, firstEdit])

  useEffect(() => {
    if (firstEdit) {
      setFormDirty(true)
    }
  }, [firstEdit])

  useEffect(() => {
    if (firstEdit) {
      setlist(companyProfileValues?.companyInvestors)
    } else {
      setlist(data?.data?.list)
    }
  }, [data?.data?.list, firstEdit, companyProfileValues?.companyInvestors])

  const addList = useCallback(
    data => {
      setlist([...list, data])
      setFormDirty(true)
    },
    [list]
  )

  const editList = useCallback(
    (v, i) => {
      const temp = [...list]
      temp.splice(i, 1, v)
      setlist(temp)
      setFormDirty(true)
    },
    [list]
  )

  const handleAdd = useCallback(() => {
    show(MuiDialog, {
      title: 'Add new investor',
      fullWidth: true,
      children: <InvestorsForm onAdd={addList} />
    })
  }, [addList])

  const handleSubmit = useCallback(
    flag => {
      if (firstEdit) {
        setFormDirty(false)
        return companyProfileDispatch({
          type: CompanyActionType.SetInvestors,
          payload: {
            ...companyProfileValues,
            companyInvestors: ['DIRECTLY'].includes(flag) ? [] : list
          }
        })
      }
      runUpdateCompany({ companyInvestors: ['DIRECTLY'].includes(flag) ? [] : list }).then(() => setFormDirty(false))
    },
    [list, runUpdateCompany, firstEdit, companyProfileValues, companyProfileDispatch]
  )

  const deleteList = useCallback(
    i => {
      const temp = [...list]
      temp.splice(i, 1)
      setlist(temp)
      !temp.length && handleSubmit('DIRECTLY')
      setFormDirty(true)
    },
    [handleSubmit, list]
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
      <InvestorsList list={list} onEdit={editList} onDelete={deleteList} />
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

export default CompanyInvestors

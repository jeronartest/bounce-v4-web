import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { show } from '@ebay/nice-modal-react'
import { useSelector } from 'react-redux'
import { LoadingButton } from '@mui/lab'
import { useRouter } from 'next/router'
import Add from './components/Add'
import InvestmentsForm from './components/InvestmentsForm'
import InvestmentsList from './components/InvestmentsList'
import { ReactComponent as AddIcon } from 'assets/imgs/home/add.svg'
import MuiDialog from 'bounceComponents/common/Dialog'
import { useGetCompanyInvestments } from 'bounceHooks/company/useGetCompanyInvestments'
import { RootState } from '@/store'
import { useUpdateCompany } from 'bounceHooks/company/useUpdateCompany'
import { ICompanyInvestmentsListItems, ICompanyProfileParams } from 'api/company/type'
import { useWarnIfUnsavedChanges } from 'bounceHooks/profile/useWarnIfUnsavedChanges'
import EditCancelConfirmation from 'bounceComponents/profile/components/EditCancelConfirmation'
import DialogTips from 'bounceComponents/common/DialogTips'

export type ICompanyInvestmentsProps = {
  companyProfileValues?: ICompanyProfileParams
  firstEdit?: boolean
  companyProfileDispatch?: (val: any) => void
}

const add_text = {
  label: 'Add new investment',
  description: "Nothing to see for now. When you add new investment, they'll show up here."
}

const CompanyInvestments: React.FC<ICompanyInvestmentsProps> = ({
  companyProfileValues,
  firstEdit,
  companyProfileDispatch
}) => {
  const { userId } = useSelector((state: RootState) => state.user)

  const { data, runAsync: runGetCompanyInvestments } = useGetCompanyInvestments()
  const { loading, runAsync: runUpdateCompany } = useUpdateCompany(firstEdit)

  const [list, setlist] = useState<ICompanyInvestmentsListItems[]>([])
  const [formDirty, setFormDirty] = useState<boolean>(false)
  const router = useRouter()

  useWarnIfUnsavedChanges(formDirty)

  useEffect(() => {
    !firstEdit && userId && runGetCompanyInvestments({ limit: 100, offset: 0, companyId: Number(userId) })
  }, [runGetCompanyInvestments, userId, firstEdit])

  useEffect(() => {
    if (firstEdit) {
      setlist(companyProfileValues?.companyInvestments)
    } else {
      setlist(data?.data?.list)
    }
  }, [data?.data?.list, firstEdit, companyProfileValues?.companyInvestments])

  useEffect(() => {
    if (firstEdit) {
      setFormDirty(true)
    }
  }, [firstEdit])

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
      title: 'Add new investment',
      fullWidth: true,
      children: <InvestmentsForm onAdd={addList} />
    })
  }, [addList])

  const handleSubmit = useCallback(
    flag => {
      if (firstEdit) {
        setFormDirty(false)
        return runUpdateCompany({
          ...companyProfileValues,
          companyInvestments: ['DIRECTLY'].includes(flag) ? [] : list
        }).then(() => {
          show(DialogTips, {
            title: 'Сongratulations! You have completed company profile',
            content: <></>,
            iconType: 'success',
            cancelBtn: 'Browse Now',
            againBtn: 'My Homepage',
            onCancel: () => router.push('/company/institutionInvestors'),
            onAgain: () => router.push('/company/summary')
          })
        })
      }
      runUpdateCompany({ companyInvestments: ['DIRECTLY'].includes(flag) ? [] : list }).then(() => setFormDirty(false))
    },
    [list, runUpdateCompany, firstEdit, companyProfileValues, router]
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
              Save
            </Button>
          </Stack>
        )}
      </Box>
    )
  }

  return (
    <Stack spacing={40}>
      <InvestmentsList list={list} onEdit={editList} onDelete={deleteList} />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" size="medium" sx={{ width: 120 }} onClick={handleAdd}>
          Add
          <AddIcon color="inherit" style={{ marginLeft: 10 }} />
        </Button>
        {firstEdit && (
          <Stack direction={'row'} justifyContent="flex-end" spacing={10}>
            <EditCancelConfirmation routerLink="/company/summary" />
            <LoadingButton loading={loading} variant="contained" sx={{ width: 140 }} onClick={handleSubmit}>
              Save
            </LoadingButton>
          </Stack>
        )}
        {!firstEdit && (
          <LoadingButton loading={loading} variant="contained" size="medium" sx={{ width: 140 }} onClick={handleSubmit}>
            Submit
          </LoadingButton>
        )}
      </Stack>
    </Stack>
  )
}

export default CompanyInvestments

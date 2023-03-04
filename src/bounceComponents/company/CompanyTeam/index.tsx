import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { show } from '@ebay/nice-modal-react'
import { useSelector } from 'react-redux'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { CompanyActionType } from '../components/CompanyContextProvider'
import Add from './components/Add'
import TeamList from './components/TeamList'
import TeamForm from './components/TeamForm'
import { useGetCompanyTeam } from 'bounceHooks/company/useGetCompanyTeam'
import { ReactComponent as AddIcon } from 'assets/imgs/home/add.svg'
import MuiDialog from 'bounceComponents/common/Dialog'
import { useUpdateCompany } from 'bounceHooks/company/useUpdateCompany'
import { ICompanyProfileParams, ICompanyTeamListItems } from 'api/company/type'
import { RootState } from '@/store'
import EditCancelConfirmation from 'bounceComponents/profile/components/EditCancelConfirmation'
import { useWarnIfUnsavedChanges } from 'bounceHooks/profile/useWarnIfUnsavedChanges'

export type ICompanyTeamProps = {
  companyProfileValues?: ICompanyProfileParams
  firstEdit?: boolean
  companyProfileDispatch?: (val: any) => void
}

const add_text = {
  label: 'Add new team member',
  description: "Nothing to see for now. When you add new team member, they'll show up here."
}

const CompanyTeam: React.FC<ICompanyTeamProps> = ({ companyProfileValues, firstEdit, companyProfileDispatch }) => {
  const { userId } = useSelector((state: RootState) => state.user)

  const { data, runAsync: runGetCompanyTeam } = useGetCompanyTeam()
  const { runAsync: runUpdateCompany } = useUpdateCompany(firstEdit)

  const [list, setlist] = useState<ICompanyTeamListItems[]>([])
  const [formDirty, setFormDirty] = useState<boolean>(false)

  useWarnIfUnsavedChanges(formDirty)

  useEffect(() => {
    !firstEdit && userId && runGetCompanyTeam({ limit: 100, offset: 0, companyId: Number(userId) })
  }, [runGetCompanyTeam, userId, firstEdit])

  useEffect(() => {
    if (firstEdit) {
      setFormDirty(true)
    }
  }, [firstEdit])

  useEffect(() => {
    if (firstEdit) {
      setlist(companyProfileValues?.teamMembers)
    } else {
      setlist(data?.data?.list)
    }
  }, [data?.data?.list, firstEdit, companyProfileValues?.teamMembers])

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
      title: 'Add new team member',
      fullWidth: true,
      children: <TeamForm onAdd={addList} />
    })
  }, [addList])

  const handleSubmit = useCallback(
    flag => {
      if (firstEdit) {
        if (list?.length === 0) {
          return toast.error('Please add your team members')
        }
        setFormDirty(false)
        return companyProfileDispatch({
          type: CompanyActionType.SetTeam,
          payload: {
            ...companyProfileValues,
            teamMembers: ['DIRECTLY'].includes(flag) ? [] : list
          }
        })
      }
      runUpdateCompany({ teamMembers: ['DIRECTLY'].includes(flag) ? [] : list }).then(() => {
        setFormDirty(false)
      })
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
      <TeamList list={list} onEdit={editList} onDelete={deleteList} />
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

export default CompanyTeam

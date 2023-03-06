import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { show } from '@ebay/nice-modal-react'
import EditCancelConfirmation from '../components/EditCancelConfirmation'
import Add from './components/Add'
import InvestmentsForm from './components/InvestmentsForm'
import InvestmentsList from './components/InvestmentsList'
import { ReactComponent as AddIcon } from 'assets/imgs/home/add.svg'
import MuiDialog from 'bounceComponents/common/Dialog'
import { useGetBasicInvestments } from 'bounceHooks/profile/useGetBasicInvestments'
import { useUpdateBasic } from 'bounceHooks/profile/useUpdateBasic'
import { IInvestmentItems, IupdateBasicParams } from 'api/profile/type'
import DialogTips from 'bounceComponents/common/DialogTips'
import { useWarnIfUnsavedChanges } from 'bounceHooks/profile/useWarnIfUnsavedChanges'
import { useUserInfo } from 'state/users/hooks'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

export type IBasicInvestmentsProps = {
  firstEdit?: boolean
  basicProfileValues?: IupdateBasicParams
}

const add_text = {
  label: 'Add new investment',
  description: "Nothing to see for now. When you add new investment, they'll show up here."
}

const BasicInvestments: React.FC<IBasicInvestmentsProps> = ({ firstEdit, basicProfileValues }) => {
  const { userId } = useUserInfo()
  const navigate = useNavigate()

  const { data, runAsync: runGetBasicInvestments } = useGetBasicInvestments()
  const { runAsync: runUpdateBasic } = useUpdateBasic()

  const [list, setlist] = useState<IInvestmentItems[]>([])
  const [formDirty, setFormDirty] = useState<boolean>(false)

  useWarnIfUnsavedChanges(formDirty)

  useEffect(() => {
    userId &&
      runGetBasicInvestments({
        userId,
        limit: 100,
        offset: 0
      })
  }, [runGetBasicInvestments, userId])

  useEffect(() => {
    setlist(data?.data?.list)
  }, [data?.data?.list])

  useEffect(() => {
    if (firstEdit) {
      setFormDirty(true)
    }
  }, [firstEdit])

  const addList = useCallback(
    (data: IInvestmentItems) => {
      setlist([...list, data])
      setFormDirty(true)
    },
    [list]
  )

  const editList = useCallback(
    (v: IInvestmentItems, i: number) => {
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
        return runUpdateBasic?.({
          ...basicProfileValues,
          invest: ['DIRECTLY'].includes(flag) ? [] : list
        }).then(() => {
          setFormDirty(false)
          show(DialogTips, {
            title: 'Сongratulations! You have completed your profile.',
            content: (
              <Typography variant="h2" sx={{ mt: 10 }}>
                Would you like to complete a portfolio too?
              </Typography>
            ),
            iconType: 'success',
            cancelBtn: 'Skip',
            againBtn: 'Complete Now',
            onCancel: () => navigate(routes.profile.summary),
            onAgain: () => navigate(routes.profile.resume.resume)
          })
        })
      }
      runUpdateBasic({ invest: ['DIRECTLY'].includes(flag) ? [] : list }).then(() => {
        setFormDirty(false)
      })
      return
    },
    [firstEdit, runUpdateBasic, list, basicProfileValues, navigate]
  )

  const deleteList = useCallback(
    i => {
      const temp = [...list]
      temp.splice(i, 1)
      setlist(temp)
      !temp.length && handleSubmit('DIRECTLY')
    },
    [handleSubmit, list]
  )

  if (!list?.length) {
    return (
      <Box>
        <Add {...add_text} onAdd={addList} />
        {firstEdit && (
          <Stack direction={'row'} justifyContent="flex-end" spacing={10} mt={40}>
            <EditCancelConfirmation routerLink="/profile/summary" />
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
      <InvestmentsList list={list} onEdit={editList} onDelete={deleteList} />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" size="medium" sx={{ width: 120 }} onClick={handleAdd}>
          Add
          <AddIcon color="inherit" style={{ marginLeft: 10 }} />
        </Button>
        <Button variant="contained" size="medium" sx={{ width: 140 }} onClick={handleSubmit}>
          Submit
        </Button>
      </Stack>
    </Stack>
  )
}

export default BasicInvestments

import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { show } from '@ebay/nice-modal-react'
import { useSelector } from 'react-redux'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import { ResumeActionType } from '../components/ResumeContextProvider'
import EditCancelConfirmation from '../components/EditCancelConfirmation'
import Add from './components/Add'
import EducationForm from './components/EducationForm'
import EducationList from './components/EducationList'
import { ReactComponent as AddIcon } from 'assets/imgs/home/add.svg'
import MuiDialog from 'bounceComponents/common/Dialog'
import { RootState } from '@/store'
import { useGetResumeEducation } from 'bounceHooks/profile/useGetResumeEducation'
import { educationItems, IUpdatePersonalParams } from 'api/profile/type'
import { usePersonalResume } from 'bounceHooks/profile/useUpdateBasic'
import { useWarnIfUnsavedChanges } from 'bounceHooks/profile/useWarnIfUnsavedChanges'

export type IResumeEducationProps = {
  resumeProfileValues?: IUpdatePersonalParams
  firstEdit?: boolean
  resumeProfileDispatch?: (val: any) => void
}

const add_text = {
  label: 'Add new education',
  description: "Nothing to see for now. When you add new education, they'll show up here."
}

const ResumeEducation: React.FC<IResumeEducationProps> = ({
  resumeProfileValues,
  firstEdit,
  resumeProfileDispatch
}) => {
  const { userId } = useSelector((state: RootState) => state.user)

  const { data, runAsync: runGetResumeEducation } = useGetResumeEducation()
  const { loading, runAsync: runPersonalResume } = usePersonalResume()

  const [list, setlist] = useState<educationItems[]>([])
  const [formDirty, setFormDirty] = useState<boolean>(false)

  useEffect(() => {
    if (firstEdit) {
      setFormDirty(true)
    }
  }, [firstEdit])

  useEffect(() => {
    setlist(resumeProfileValues?.education)
  }, [resumeProfileValues?.education])

  useWarnIfUnsavedChanges(formDirty)

  useEffect(() => {
    userId &&
      runGetResumeEducation({
        userId,
        limit: 100,
        offset: 0
      })
  }, [runGetResumeEducation, userId])

  useEffect(() => {
    if (firstEdit) {
      setlist(resumeProfileValues?.education)
    } else {
      setlist(data?.data?.list)
    }
  }, [data?.data?.list, firstEdit, resumeProfileValues?.education])

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
      title: 'Add new education',
      fullWidth: true,
      children: <EducationForm onAdd={addList} />
    })
  }, [addList])

  const handleSubmit = useCallback(
    flag => {
      if (firstEdit) {
        if (list?.length === 0) {
          return toast.error('Please describe your education')
        }
        setFormDirty(false)
        return resumeProfileDispatch({
          type: ResumeActionType.SetEducation,
          payload: {
            ...resumeProfileValues,
            education: ['DIRECTLY'].includes(flag) ? [] : list
          }
        })
      }
      runPersonalResume({ education: ['DIRECTLY'].includes(flag) ? [] : list }).then(() => {
        setFormDirty(false)
      })
    },
    [list, runPersonalResume, firstEdit, resumeProfileValues, resumeProfileDispatch]
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
            <EditCancelConfirmation routerLink="/profile/portfolio" />
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
      <EducationList list={list} onEdit={editList} onDelete={deleteList} />
      <Stack direction="row" justifyContent="space-between">
        <Button variant="contained" size="medium" sx={{ width: 120 }} onClick={handleAdd}>
          Add
          <AddIcon color="inherit" style={{ marginLeft: 10 }} />
        </Button>
        {firstEdit && (
          <Stack direction={'row'} justifyContent="flex-end" spacing={10}>
            <EditCancelConfirmation routerLink="/profile/portfolio" />
            <Button variant="contained" sx={{ width: 140 }} onClick={handleSubmit}>
              Next
            </Button>
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

export default ResumeEducation

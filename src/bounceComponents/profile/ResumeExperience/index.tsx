import React, { useCallback, useEffect, useState } from 'react'
import { Box, Button, Stack } from '@mui/material'
import { show } from '@ebay/nice-modal-react'
import { useSelector } from 'react-redux'
import { LoadingButton } from '@mui/lab'
import { toast } from 'react-toastify'
import EditCancelConfirmation from '../components/EditCancelConfirmation'
import { ResumeActionType } from '../components/ResumeContextProvider'
import Add from './components/Add'
import ExperienceForm from './components/ExperienceForm'
import ExperienceList from './components/ExperienceList'
import { ReactComponent as AddIcon } from '@/assets/imgs/home/add.svg'
import MuiDialog from '@/components/common/Dialog'
import { useGetResumeExperience } from '@/hooks/profile/useGetResumeExperience'
import { RootState } from '@/store'
import { experienceItems, IUpdatePersonalParams } from '@/api/profile/type'
import { usePersonalResume } from '@/hooks/profile/useUpdateBasic'
import { useWarnIfUnsavedChanges } from '@/hooks/profile/useWarnIfUnsavedChanges'

const add_text = {
  label: 'Add new experience',
  description: "Nothing to see for now. When you add new experience, they'll show up here.",
}

export type IResumeExperienceProps = {
  resumeProfileValues?: IUpdatePersonalParams
  firstEdit?: boolean
  resumeProfileDispatch?: (val: any) => void
}

const ResumeExperience: React.FC<IResumeExperienceProps> = ({
  resumeProfileValues,
  firstEdit,
  resumeProfileDispatch,
}) => {
  const { userId } = useSelector((state: RootState) => state.user)

  const { data, runAsync: runGetResumeExperience } = useGetResumeExperience()
  const { loading, runAsync: runPersonalResume } = usePersonalResume()

  const [list, setlist] = useState<experienceItems[]>([])
  const [formDirty, setFormDirty] = useState<boolean>(false)

  useEffect(() => {
    if (firstEdit) {
      setFormDirty(true)
    }
  }, [firstEdit])

  useWarnIfUnsavedChanges(formDirty)

  useEffect(() => {
    userId &&
      runGetResumeExperience({
        userId,
        limit: 100,
        offset: 0,
      })
  }, [runGetResumeExperience, userId])

  useEffect(() => {
    if (firstEdit) {
      setlist(resumeProfileValues?.experience)
    } else {
      setlist(data?.data?.list)
    }
  }, [data?.data?.list, firstEdit, resumeProfileValues?.experience])

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
      title: 'Add new experience',
      fullWidth: true,
      children: <ExperienceForm onAdd={addList} />,
    })
  }, [addList])

  const handleSubmit = useCallback(
    (flag) => {
      if (firstEdit) {
        if (list?.length === 0) {
          return toast.error('Please describe your experience')
        }
        setFormDirty(false)
        return resumeProfileDispatch({
          type: ResumeActionType.SetExperience,
          payload: {
            ...resumeProfileValues,
            experience: ['DIRECTLY'].includes(flag) ? [] : list,
          },
        })
      }
      runPersonalResume({ experience: ['DIRECTLY'].includes(flag) ? [] : list }).then(() => {
        setFormDirty(false)
      })
    },
    [list, runPersonalResume, firstEdit, resumeProfileValues, resumeProfileDispatch],
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
      <ExperienceList list={list} onEdit={editList} onDelete={deleteList} />
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

export default ResumeExperience

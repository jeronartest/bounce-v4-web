import React, { useCallback } from 'react'
import { Stack } from '@mui/system'
import { Typography } from '@mui/material'
import { show } from '@ebay/nice-modal-react'
import TeamForm from '../TeamForm'
import { ReactComponent as AddBtnSVG } from 'assets/imgs/profile/investments/add-btn.svg'
import MuiDialog from 'bounceComponents/common/Dialog'
import { ICompanyTeamListItems } from 'api/company/type'

export type IAddProps = {
  label: string
  description: string
  onAdd: (data: ICompanyTeamListItems) => void
}

const Add: React.FC<IAddProps> = ({ label, description, onAdd }) => {
  const handleAdd = useCallback(() => {
    show(MuiDialog, {
      title: 'Add new team member',
      fullWidth: true,
      children: <TeamForm onAdd={onAdd} />
    })
  }, [onAdd])

  return (
    <Stack
      sx={{ border: '1px dashed rgba(0, 0, 0, 0.27)', borderRadius: '20px', cursor: 'pointer' }}
      onClick={handleAdd}
    >
      <Stack alignItems="center" my={142}>
        <AddBtnSVG />
        <Typography mt={12} sx={{ fontSize: 16, lineHeight: '20px', textDecorationLine: 'underline' }}>
          {label}
        </Typography>
        <Typography
          mt={16}
          sx={{
            fontSize: 14,
            lineHeight: '20px',
            color: 'var(--ps-gray-900)',
            opacity: 0.5,
            maxWidth: 430,
            textAlign: 'center'
          }}
        >
          {description}
        </Typography>
      </Stack>
    </Stack>
  )
}

export default Add

// import { show } from '@ebay/nice-modal-react'
import { Button } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'
// import DialogTips from 'bounceComponents/common/DialogTips'

export interface IEditCancelConfirmation {
  routerLink?: string
  onResetForm?: () => void
}

const EditCancelConfirmation: React.FC<IEditCancelConfirmation> = ({ routerLink }) => {
  const navigate = useNavigate()
  const handleCancle = () => {
    navigate(routerLink || '')
    // show(DialogTips, {
    //   title: 'Leave the page',
    //   iconType: 'error',
    //   content: (
    //     <Typography variant="body1" sx={{ lineHeight: '30px' }}>
    //       The basic profile is not completed. Account with introduction perform 80% greater on Bounce.
    //     </Typography>
    //   ),
    //   cancelBtn: 'Cancel',
    //   againBtn: 'Still Leave',
    //   onAgain: () => {
    //     onResetForm?.()
    //     router.push(routerLink)
    //   },
    // })
  }

  return (
    <Button variant="outlined" sx={{ width: 140 }} onClick={handleCancle}>
      Cancel
    </Button>
  )
}

export default EditCancelConfirmation

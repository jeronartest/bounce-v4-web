import { Button, Pagination, Typography } from '@mui/material'
import { Box } from '@mui/system'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

import React from 'react'
import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { RootState } from '@/store'

export type ITotalPaginationBoxProps = {
  total: number
  children: React.ReactNode
  create?: boolean
  idea?: boolean
}

const TotalPaginationBox: React.FC<ITotalPaginationBoxProps> = ({ total, idea, children, create }) => {
  const router = useRouter()
  const { token } = useSelector((state: RootState) => state.user)

  const handleCreateBtnClick = () => {
    if (!token) {
      toast.error('Please login')
      router.push(`/login?path=/auction/create-auction-pool?redirect=/market/pools`)
    } else {
      router.push('/auction/create-auction-pool?redirect=/market/pools')
    }
  }
  return (
    <Box p={'50px 48px 59px'} sx={{ background: '#FFFFFF', borderRadius: 20 }}>
      <Box display={'flex'} justifyContent="space-between" mb={44} alignItems={'center'}>
        <Typography variant="h2" fontSize={24}>
          Total {total} results
        </Typography>
        {create && (
          <Button
            variant="contained"
            sx={{ width: 163 }}
            endIcon={<AddCircleOutlineIcon />}
            onClick={handleCreateBtnClick}
          >
            Create pool
          </Button>
        )}
        {idea && (
          <Button
            variant="contained"
            sx={{ width: 163 }}
            endIcon={<AddCircleOutlineIcon />}
            onClick={() => {
              if (!token) {
                toast.error('Please login')
                router.push('/login?path=/idea/create')
              } else {
                router.push('/idea/create')
              }
            }}
          >
            Propose idea
          </Button>
        )}
      </Box>
      {children}
    </Box>
  )
}

export default TotalPaginationBox

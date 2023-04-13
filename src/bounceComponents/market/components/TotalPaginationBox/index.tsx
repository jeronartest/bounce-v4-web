import { Button, Typography } from '@mui/material'
import { Box } from '@mui/system'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

import React, { useCallback } from 'react'
import { toast } from 'react-toastify'
import { routes } from 'constants/routes'
import { useUserInfo, useWeb3Login } from 'state/users/hooks'
import { useNavigate } from 'react-router-dom'
import { useActiveWeb3React } from 'hooks'
import { useWalletModalToggle } from 'state/application/hooks'

export type ITotalPaginationBoxProps = {
  total: number
  children: React.ReactNode
  create?: boolean
  idea?: boolean
}

const TotalPaginationBox: React.FC<ITotalPaginationBoxProps> = ({ total, idea, children, create }) => {
  const { token } = useUserInfo()
  const { account } = useActiveWeb3React()
  const toggleWallet = useWalletModalToggle()
  const navigate = useNavigate()
  const { run: web3Login } = useWeb3Login(`${routes.auction.createAuctionPool}?redirect=${routes.market.pools}`)

  const handleCreateBtnClick = useCallback(() => {
    if (!account) {
      toast.error('Please connect wallet first')
      toggleWallet()
      return
    }
    if (!token) {
      toast.error('Please login')
      web3Login()
      // navigate(`${routes.login}?path=${routes.auction.createAuctionPool}?redirect=${routes.market.pools}`)
    } else {
      navigate(`${routes.auction.createAuctionPool}?redirect=${routes.market.pools}`)
    }
  }, [account, navigate, toggleWallet, token, web3Login])

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
                navigate(`${routes.login}?path=${routes.idea.create}`)
              } else {
                navigate(routes.idea.create)
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

import { Box, Button, Menu, MenuItem } from '@mui/material'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from 'store'
import { ReactComponent as ArrowDownSVG } from 'assets/imgs/user/arrow_down.svg'
import { ReactComponent as ArrowUpSVG } from 'assets/imgs/user/arrow_up.svg'
import { useNavigate } from 'react-router-dom'

const CreateBtn: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const { token } = useSelector((state: RootState) => state.user)

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const CreateDialog = () => (
    <Menu
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleMenuClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      sx={{
        mt: 4,
        '& .MuiPopover-paper': {
          borderRadius: 20,
          padding: '10px 0px'
        },
        '& .MuiList-padding': {
          padding: '0px 0px 0px 0px',
          background: '#FFFFFF',
          boxShadow: 'none',
          borderRadius: 20
        },
        '& .MuiMenuItem-gutters': {
          padding: '10px 20px'
        }
      }}
    >
      <MenuItem
        onClick={() => {
          navigate(`/auction/create-auction-pool?redirect=${location.pathname}${location.search}`)
          setAnchorEl(null)
        }}
      >
        Create a pool
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate('/idea/create')
          setAnchorEl(null)
        }}
      >
        Create an idea
      </MenuItem>
    </Menu>
  )

  if (!token) {
    return <></>
  }

  return (
    <Box>
      <Button
        variant="outlined"
        size="small"
        sx={{ width: 124, height: 40, borderRadius: 20 }}
        onClick={handleMenuOpen}
        endIcon={anchorEl ? <ArrowUpSVG /> : <ArrowDownSVG />}
      >
        Create
      </Button>
      <CreateDialog />
    </Box>
  )
}

export default CreateBtn

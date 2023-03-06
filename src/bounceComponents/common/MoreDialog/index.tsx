import React, { useState } from 'react'
import { Box, IconButton, Menu, MenuItem } from '@mui/material'
import { ReactComponent as MoreSVG } from 'assets/imgs/profile/more.svg'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

export const MoreDialog: React.FC = () => {
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const userOpen = Boolean(anchorEl)
  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }
  const handleMorelick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  return (
    <Box>
      <IconButton
        sx={{
          border: '1px solid rgba(0, 0, 0, 0.27)',
          background: '#FFF',
          color: 'var(--ps-gray-900)',
          '&:hover': {
            background: 'var(--ps-gray-900)',
            color: '#FFF'
          }
        }}
        onClick={handleMorelick}
      >
        <MoreSVG />
      </IconButton>

      <Menu
        open={userOpen}
        anchorEl={anchorEl}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
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
        {/* <MenuItem
          onClick={() => {
            toast.warn('This feature is not available yet, please try later.')
            setAnchorEl(null)
          }}
        >
          Report this profile
        </MenuItem> */}
        <MenuItem
          onClick={() => {
            navigate(routes.verify)
            setAnchorEl(null)
          }}
        >
          Verify your company
        </MenuItem>
      </Menu>
    </Box>
  )
}

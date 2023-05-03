import { Box, useTheme } from '@mui/material'
import { routes } from 'constants/routes'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserInfo } from 'state/users/hooks'
import LeftMenu from './LeftMenu'

export default function AccountLayout({ children }: { children: JSX.Element | string }) {
  const { token } = useUserInfo()
  const theme = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate(routes.market.index)
    }
  }, [navigate, token])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr'
      }}
    >
      <LeftMenu />
      <Box
        sx={{
          minHeight: `calc(100vh - ${theme.height.header})`,
          backgroundColor: '#fff'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

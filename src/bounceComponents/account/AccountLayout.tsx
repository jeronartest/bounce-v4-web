import { Box, useTheme } from '@mui/material'
import { routes } from 'constants/routes'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserInfo } from 'state/users/hooks'
import LeftMenu from './LeftMenu'
import Divider from 'components/Divider'

export default function AccountLayout({ children, bgColor }: { children: JSX.Element | string; bgColor?: string }) {
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
        // borderTop: '1px solid var(--ps-text-5)',
        gridTemplateColumns: '240px 1fr'
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          top: theme => `${theme.height.header}`,
          left: 0,
          right: 0
        }}
      >
        <Divider />
      </Box>
      <LeftMenu />
      <Box
        sx={{
          minHeight: `calc(100vh - ${theme.height.header})`,
          backgroundColor: bgColor || '#fff'
        }}
      >
        {children}
      </Box>
    </Box>
  )
}

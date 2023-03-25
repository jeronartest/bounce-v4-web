import { Box } from '@mui/material'
import { routes } from 'constants/routes'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUserInfo } from 'state/users/hooks'
import LeftMenu from './LeftMenu'

export default function AccountLayout({ children }: { children: JSX.Element | string }) {
  const { userId } = useUserInfo()
  const navigate = useNavigate()

  useEffect(() => {
    if (!userId) {
      navigate(routes.market.index)
    }
  }, [navigate, userId])

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: '240px 1fr'
      }}
    >
      <LeftMenu />
      {children}
    </Box>
  )
}

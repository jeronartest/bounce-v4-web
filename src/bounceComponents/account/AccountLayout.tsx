import { Box } from '@mui/material'
import LeftMenu from './LeftMenu'

export default function AccountLayout({ children }: { children: JSX.Element | string }) {
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

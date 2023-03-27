import { Box, MenuItem, Stack, styled, Typography, useTheme } from '@mui/material'
import { ReactComponent as DashboardIcon } from 'assets/svg/account/dashboard.svg'
import { ReactComponent as JobsIcon } from 'assets/svg/account/jobs.svg'
import { ReactComponent as AccountIcon } from 'assets/svg/account/my-account.svg'
import { ReactComponent as AdsIcon } from 'assets/svg/account/my-ads.svg'
import { ReactComponent as ProfileIcon } from 'assets/svg/account/my-profile.svg'
import { ReactComponent as RealIcon } from 'assets/svg/account/my-real.svg'
import { ReactComponent as TokenIcon } from 'assets/svg/account/my-token.svg'
import { ReactComponent as SdkIcon } from 'assets/svg/account/sdk.svg'
import Tooltip from 'bounceComponents/common/Tooltip'
import { routes } from 'constants/routes'
import { useLocation, useNavigate } from 'react-router-dom'

const Links: {
  name: string
  svg: JSX.Element
  route?: string
  link?: string
  disabled?: boolean
}[] = [
  {
    name: 'Dashboard',
    svg: <DashboardIcon />,
    route: routes.account.dashboard
  },
  {
    name: 'My Profile',
    svg: <ProfileIcon />,
    route: routes.account.myProfile
  },
  {
    name: 'My Account',
    svg: <AccountIcon />,
    route: routes.account.myAccount
  },
  {
    name: 'My Token & NFT Auction',
    svg: <TokenIcon />,
    route: routes.account.tokenOrNFT
  },
  {
    name: 'My Real World Asset Auction',
    svg: <RealIcon />,
    route: routes.account.realAuction
  },
  {
    name: 'My Advertisement Auction',
    svg: <AdsIcon />,
    route: routes.account.adsAuction
  },
  {
    name: 'Developer & SDK',
    svg: <SdkIcon />,
    link: 'https://www.npmjs.com/package/bounce-sdk-beta'
  },
  {
    name: 'Jobs Network',
    svg: <JobsIcon />,
    link: 'https://jobs.bounce.finance/'
  }
]

const StyledMenuItem = styled(MenuItem)<{ selected?: boolean }>(({ selected }) => ({
  height: 60,
  borderRadius: '56px',
  backgroundColor: selected ? '#2B51DA !important' : 'transparent',
  color: selected ? '#fff' : 'rgba(23, 23, 23, 0.5);',
  '& svg': {
    flex: 'none'
  },
  '& svg path': {
    fill: selected ? '#fff' : '',
    fillOpacity: selected ? 1 : 0.5
  }
}))

export default function LeftMenu() {
  const theme = useTheme()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  return (
    <Box>
      <Box
        sx={{
          position: 'fixed',
          top: `${theme.height.header}`,
          left: 0,
          width: 240,
          bottom: 0,
          padding: '40px 20px',
          backgroundColor: '#fff',
          borderRight: '1px solid rgba(23, 23, 23, 0.1)',
          overflowY: 'auto'
        }}
      >
        <Stack spacing={8}>
          {Links.map(item => (
            <StyledMenuItem
              selected={!!(item.route && pathname.includes(item.route))}
              onClick={() => (item.route ? navigate(item.route) : item.link ? window.open(item.link) : {})}
              key={item.name}
            >
              {item.svg}
              {item.disabled ? (
                <Tooltip title="Coming soon">
                  <Typography ml={10} sx={{ whiteSpace: 'pre-wrap' }}>
                    {item.name}
                  </Typography>
                </Tooltip>
              ) : item.link ? (
                <Tooltip title={item.link}>
                  <Typography ml={10} sx={{ whiteSpace: 'pre-wrap' }}>
                    {item.name}
                  </Typography>
                </Tooltip>
              ) : (
                <Typography ml={10} sx={{ whiteSpace: 'pre-wrap' }}>
                  {item.name}
                </Typography>
              )}
            </StyledMenuItem>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

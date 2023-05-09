import { Box, MenuItem, Stack, styled, Typography, useTheme } from '@mui/material'
import { ReactComponent as DashboardIcon } from 'assets/svg/account/dashboard.svg'
import { ReactComponent as JobsIcon } from 'assets/svg/account/jobs.svg'
import { ReactComponent as AccountIcon } from 'assets/svg/account/my-account.svg'
import { ReactComponent as AdsIcon } from 'assets/svg/account/my-ads.svg'
import { ReactComponent as ProfileIcon } from 'assets/svg/account/my-profile.svg'
import { ReactComponent as RealIcon } from 'assets/svg/account/my-real.svg'
import { ReactComponent as TokenIcon } from 'assets/svg/account/my-token.svg'
import { ReactComponent as NFTIcon } from 'assets/svg/account/my-nft.svg'
import { ReactComponent as SdkIcon } from 'assets/svg/account/sdk.svg'
import { ReactComponent as CredentialsIcon } from 'assets/svg/account/my-credentials.svg'
import { ReactComponent as PrivateIcon } from 'assets/svg/account/my-private-launchpad.svg'
import Tooltip from 'bounceComponents/common/Tooltip'
import Divider from 'components/Divider'
import { routes } from 'constants/routes'
import { useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useUserInfo } from 'state/users/hooks'

const StyledMenuItem = styled(MenuItem)<{ selected?: boolean }>(({ selected }) => ({
  height: 52,
  borderRadius: '8px',
  backgroundColor: selected ? 'var(--ps-yellow-1)!important' : 'transparent',
  color: 'rgba(0, 0, 0, 0.87)',
  '& svg': {
    flex: 'none'
  }
}))

export default function LeftMenu() {
  const theme = useTheme()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const { userId, token } = useUserInfo()

  const Links: {
    name: string
    svg: JSX.Element
    route?: string
    link?: string
    _blank?: boolean
    disabled?: boolean
  }[][] = useMemo(
    () => [
      [
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
          name: 'My Credentials',
          svg: <CredentialsIcon />,
          route: routes.account.myCredentials
        }
      ],
      [
        {
          name: 'Token Auction',
          svg: <TokenIcon />,
          route: routes.account.tokenAuction
        },
        {
          name: 'NFT Auction',
          svg: <NFTIcon />,
          route: routes.account.nftAuction
        },
        {
          name: 'Real World Collectibles Auction',
          svg: <RealIcon />,
          route: routes.account.realAuction
        },
        {
          name: 'Advertisement Auction',
          svg: <AdsIcon />,
          route: routes.account.adsAuction
        },
        {
          name: 'Private Launchpad',
          svg: <PrivateIcon />,
          route: routes.account.myPrivateLaunchpad
        }
      ],
      [
        {
          name: 'Developer & SDK',
          svg: <SdkIcon />,
          _blank: true,
          link: 'https://www.npmjs.com/package/bounce-sdk-beta'
        },
        {
          name: 'Jobs Network',
          svg: <JobsIcon />,
          link: `https://jobs.bounce.finance/?token=${token}&userId=${userId}&userType=1`
        }
      ]
    ],
    [token, userId]
  )

  return (
    <Box>
      <Box
        sx={{
          position: 'fixed',
          top: `calc(${theme.height.header} + 1px)`,
          left: 0,
          width: 240,
          bottom: 0,
          padding: '16px 8px',
          backgroundColor: '#fff',
          borderRight: '1px solid var(--ps-text-5)',
          overflowY: 'auto'
        }}
      >
        <Stack spacing={8}>
          {Links.map((list, idx) => (
            <>
              {idx !== 0 && <Divider />}
              <Typography color={'var(--ps-text-2)'} variant="body2">
                {idx === 1 ? 'Auctions' : idx === 2 ? 'Tools' : ''}
              </Typography>
              <Stack spacing={8} key={idx}>
                {list.map(item => (
                  <StyledMenuItem
                    selected={!!(item.route && pathname.includes(item.route))}
                    onClick={() =>
                      item.route
                        ? navigate(item.route)
                        : item.link
                        ? item._blank
                          ? window.open(item.link)
                          : (location.href = item.link)
                        : {}
                    }
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
                      <Tooltip title={`Go to ${item.name}`}>
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
            </>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}

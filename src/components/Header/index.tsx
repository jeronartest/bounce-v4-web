import { useState, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Stack, styled as muiStyled, styled } from '@mui/material'
import { ExternalLink } from 'themes/components'
import Web3Status from './Web3Status'
import { HideOnMobile, ShowOnMobile } from 'themes/index'
import PlainSelect from 'components/Select/PlainSelect'
import Image from 'components/Image'
import logo from '../../assets/svg/logo.svg'
import { routes } from 'constants/routes'
import MobileMenu from './MobileMenu'
// import NetworkSelect from './NetworkSelect'
import Search from 'bounceComponents/common/Header/Search'
import CreateBtn from 'bounceComponents/common/Header/CreateBtn'
import { USER_TYPE } from 'api/user/type'
import DefaultAvatarSVG from 'assets/imgs/profile/yellow_avatar.svg'
import { useLogout, useUserInfo, useWeb3Login } from 'state/users/hooks'
import { LoadingButton } from '@mui/lab'
import { useActiveWeb3React } from 'hooks'

interface TabContent {
  title: string
  route?: string
  link?: string
  titleContent?: JSX.Element
}

interface Tab extends TabContent {
  subTab?: TabContent[]
}

export const Tabs: Tab[] = [
  {
    title: 'Token&NFT Auction',
    route: routes.market.index
  },
  {
    title: 'Real World Collectibles Auction',
    route: routes.realAuction.index
  },
  {
    title: 'Ads Auction',
    route: routes.adsAuction.index
  },

  { title: 'Token', link: 'https://token.bounce.finance/staking' }
]

const navLinkSX = ({ theme }: any) => ({
  textDecoration: 'none',
  fontSize: 16,
  fontWeight: 500,
  color: theme.palette.text.primary,
  opacity: 1,
  '&:hover': {
    opacity: 0.5
  }
})

const StyledNavLink = styled(Link)(navLinkSX)

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  position: 'fixed',
  height: theme.height.header,
  backgroundColor: theme.palette.background.paper,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  boxShadow: 'none',
  padding: '0 36px 0 36px!important',
  zIndex: theme.zIndex.drawer,
  borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
  '& .link': {
    textDecoration: 'none',
    fontSize: 16,
    color: theme.palette.text.primary,
    marginRight: 24,
    paddingBottom: '3px',
    borderBottom: '1px solid transparent',
    '&.active': {
      opacity: 1,
      borderColor: theme.palette.text.primary
    },
    '&:hover': {
      opacity: 0.5
    }
  },
  [theme.breakpoints.down('lg')]: {
    '& .link': { marginRight: 15 },
    padding: '0 24px 0 24!important'
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px!important'
  }
}))

const Filler = styled('div')(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    height: theme.height.header,
    display: 'block'
  },
  [theme.breakpoints.down('sm')]: {
    height: theme.height.mobileHeader,
    padding: '0 20px'
  }
}))

const MainLogo = styled(Link)(({ theme }) => ({
  '& img': {
    height: 29
  },
  '&:hover': {
    cursor: 'pointer'
  },
  [theme.breakpoints.down('sm')]: {
    '& img': { width: 100, height: 'auto' },
    marginBottom: -10
  }
}))

const LinksWrapper = muiStyled('div')(({ theme }) => ({
  marginLeft: 24,
  [theme.breakpoints.down('lg')]: {
    marginLeft: 10
  }
}))

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { account } = useActiveWeb3React()

  const handleMobileMenuDismiss = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  const navigate = useNavigate()

  const { userType, userInfo, companyInfo, token } = useUserInfo()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const userOpen = Boolean(anchorEl)
  const handleUserMenuClose = () => {
    setAnchorEl(null)
  }
  const { logout } = useLogout()
  const UserDialog = () => (
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
          navigate(routes.account.dashboard)
          setAnchorEl(null)
        }}
      >
        My Dashboard
      </MenuItem>
      <MenuItem
        onClick={() => {
          navigate(routes.account.myProfile)
          setAnchorEl(null)
        }}
      >
        My Profile
      </MenuItem>
      <MenuItem
        onClick={() => {
          logout()
          setAnchorEl(null)
        }}
      >
        Logout
      </MenuItem>
    </Menu>
  )
  const handleUserClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const { run: runLogin, loading: loginLoading } = useWeb3Login()

  return (
    <>
      <MobileMenu isOpen={mobileMenuOpen} onDismiss={handleMobileMenuDismiss} />
      <Filler />
      <StyledAppBar>
        <Box display="flex" alignItems="center">
          <MainLogo id={'logo'} to={'/'}>
            <Image src={logo} alt={'logo'} />
          </MainLogo>
          <HideOnMobile breakpoint="lg">
            <LinksWrapper>
              {Tabs.map(({ title, route, subTab, link, titleContent }, idx) =>
                subTab ? (
                  <Box
                    sx={{
                      marginRight: {
                        xs: 15
                      },
                      height: 'auto',
                      paddingBottom: '30px',
                      borderBottom: '2px solid transparent',
                      borderColor: theme =>
                        subTab.some(tab => tab.route && pathname.includes(tab.route))
                          ? theme.palette.text.primary
                          : 'transparnet',
                      display: 'inline'
                    }}
                    key={title + idx}
                  >
                    <PlainSelect
                      key={title + idx}
                      placeholder={title}
                      autoFocus={false}
                      width={title === 'Test' ? '70px' : undefined}
                      style={{
                        height: '16px'
                      }}
                    >
                      {subTab.map((sub, idx) =>
                        sub.link ? (
                          <MenuItem
                            key={sub.link + idx}
                            sx={{ backgroundColor: 'transparent!important', background: 'transparent!important' }}
                            selected={false}
                          >
                            <ExternalLink
                              href={sub.link}
                              className={'link'}
                              color="#00000050"
                              sx={{
                                '&:hover': {
                                  color: '#232323!important'
                                }
                              }}
                            >
                              {sub.titleContent ?? sub.title}
                            </ExternalLink>
                          </MenuItem>
                        ) : (
                          <MenuItem key={sub.title + idx}>
                            <StyledNavLink to={sub.route ?? ''}>{sub.titleContent ?? sub.title}</StyledNavLink>
                          </MenuItem>
                        )
                      )}
                    </PlainSelect>
                  </Box>
                ) : link ? (
                  <ExternalLink href={link} className={'link'} key={link + idx} style={{ fontSize: 16 }}>
                    {titleContent ?? title}
                  </ExternalLink>
                ) : (
                  <Link
                    key={title + idx}
                    id={`${route}-nav-link`}
                    to={route ?? ''}
                    className={
                      (route
                        ? pathname.includes(route)
                          ? 'active'
                          : pathname.includes('account')
                          ? route.includes('account')
                            ? 'active'
                            : ''
                          : ''
                        : '') + ' link'
                    }
                  >
                    {titleContent ?? title}
                  </Link>
                )
              )}
            </LinksWrapper>
          </HideOnMobile>
        </Box>

        <Stack direction={'row'} alignItems="center" spacing={15}>
          <Search />
          <CreateBtn />
          <Web3Status />

          {account && (
            <Stack direction="row" alignItems="center" spacing={20}>
              {token ? (
                <>
                  <div>
                    <Avatar
                      component={'button'}
                      id="userAvatar"
                      src={
                        (Number(userType) === USER_TYPE.USER
                          ? userInfo?.avatar?.fileUrl
                          : companyInfo?.avatar?.fileUrl) || DefaultAvatarSVG
                      }
                      sx={{
                        width: 52,
                        height: 52,
                        padding: 0,
                        cursor: 'pointer',
                        border: 0
                      }}
                      onClick={handleUserClick}
                    />
                    <UserDialog />
                  </div>
                </>
              ) : (
                <LoadingButton
                  variant="outlined"
                  loadingPosition="start"
                  loading={loginLoading}
                  size="small"
                  sx={{ width: 120, height: 40, borderRadius: 20 }}
                  onClick={() => {
                    if (location.pathname === routes.login) {
                      navigate(routes.login)
                    } else {
                      // navigate(`${routes.login}?path=${location.pathname}${location.search}`)
                      runLogin()
                    }
                  }}
                >
                  Login
                </LoadingButton>
              )}
            </Stack>
          )}
        </Stack>

        <Box display="none" alignItems="center" gap={{ xs: '6px', sm: '20px' }}>
          {/* <NetworkSelect />
          <Web3Status /> */}
          <ShowOnMobile breakpoint="md">
            <IconButton
              sx={{
                border: '1px solid rgba(0, 0, 0, 0.1)',
                height: { xs: 24, sm: 32 },
                width: { xs: 24, sm: 32 },
                mb: { xs: 0, sm: 15 },
                mt: { xs: 0, sm: 8 },
                padding: '4px',
                borderRadius: '8px'
              }}
              onClick={() => {
                setMobileMenuOpen(open => !open)
              }}
            >
              <svg width="14" height="8" viewBox="0 0 14 8" fill="none" stroke="#252525">
                <path d="M1 1H13" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M1 7H13" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </IconButton>
          </ShowOnMobile>
        </Box>
      </StyledAppBar>
    </>
  )
}

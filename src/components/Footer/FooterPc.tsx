import { Container, Link as ExternalLink, Typography, Box } from '@mui/material'
import React, { useMemo } from 'react'
import APIIcon from 'assets/imgs/common/Api.png'
import GithubIcon from 'assets/imgs/common/Github.png'
import MediumIcon from 'assets/imgs/common/Medium.png'
import TelegramIcon from 'assets/imgs/common/Telegram.png'
import TwitterIcon from 'assets/imgs/common/Twitter.png'
import FooterLogo from 'assets/imgs/common/LogoBlack.svg'
import { routes } from 'constants/routes'

export const FooterSocialLink: React.FC = () => {
  const Links = useMemo(
    () => [
      {
        title: 'Medium',
        icon: MediumIcon,
        href: 'https://medium.com/@bouncefinance'
      },
      {
        title: 'Twitter',
        icon: TwitterIcon,
        href: 'https://twitter.com/bounce_finance?s=21'
      },
      {
        title: 'Telegram',
        icon: TelegramIcon,
        href: 'https://t.me/bounce_finance'
      },
      {
        title: 'Github',
        icon: GithubIcon,
        href: 'https://github.com/bouncefinance'
      },
      {
        title: 'API',
        icon: APIIcon,
        href: 'https://docs.bounce.finance/'
      }
    ],
    []
  )
  return (
    <Box
      sx={{
        position: 'relative',
        width: 213,
        display: 'flex',
        flexFlow: 'column nowrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingBottom: 32
      }}
    >
      <ExternalLink href={routes.market.index} role="link" rel="noopener noreferrer" aria-disabled={true}>
        <img src={FooterLogo} style={{ display: 'block', width: 158, height: 32, marginBottom: 24 }} />
      </ExternalLink>
      <Box
        sx={{
          display: 'flex',
          flexFlow: 'row nowrap',
          justifyContent: 'flex-start',
          marginBottom: 60
        }}
      >
        {Links.map((item, index) => {
          return (
            <ExternalLink key={'link' + index} target="_blank" href={item.href}>
              <img src={item.icon} style={{ width: 36, height: 36, marginRight: 8, cursor: 'pointer' }} />
            </ExternalLink>
          )
        })}
      </Box>
      <Box
        sx={{
          position: 'relative',
          width: '100%'
        }}
      >
        <iframe
          src="/crypotoWidget.html"
          width="100%"
          style={{
            border: '0 none',
            position: 'absolute',
            top: 0,
            left: -42,
            width: 280
          }}
        ></iframe>
      </Box>
    </Box>
  )
}

interface FooterLinksProps {
  title: string
  links: {
    label: string
    isExternal: boolean // 是否是外链
    href: string
    isDisabled: boolean
    extraIcon: string | React.ReactElement
    className: string
  }[]
}

export const FooterLinks: React.FC<FooterLinksProps> = ({ title, links }) => {
  return (
    <div>
      <Typography
        variant="h5"
        sx={{
          fontFamily: `'Public Sans'`,
          fontSize: 12,
          marginBottom: 24
        }}
      >
        {title}
      </Typography>
      <ul
        style={{
          margin: 0,
          padding: 0
        }}
      >
        {links.map((item, index) => {
          return (
            <li
              key={index}
              style={{
                listStyle: 'none',
                marginBottom: 16
              }}
            >
              {item.isDisabled ? (
                <a
                  style={{
                    color: '#919191' + '!important',
                    fontFamily: `'Inter'`
                  }}
                >
                  {item.label}
                </a>
              ) : item.isExternal ? (
                <ExternalLink
                  // className={linkClass}
                  sx={{
                    color: '#000000',
                    padding: 0,
                    height: 18,
                    fontFamily: `'Inter'`,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                  href={item.href as string}
                  role="link"
                  rel="noopener noreferrer"
                  target="_blank"
                  aria-disabled={true}
                >
                  {item.label}
                </ExternalLink>
              ) : (
                <ExternalLink href={item.href}>
                  <a
                    style={{
                      color: '#000000',
                      padding: 0,
                      height: 18,
                      fontFamily: `'Inter'`
                    }}
                  >
                    {item.label}
                  </a>
                </ExternalLink>
              )}
              {item.extraIcon}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

const FooterPc: React.FC = () => {
  const ProductsLinks = useMemo(
    () => [
      {
        label: 'Auction Homepage',
        isExternal: true,
        href: 'https://www.bounce.finance/tokenAndnftAuction',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'Token&NFT auction',
        isExternal: true,
        href: 'https://www.bounce.finance/tokenAndnftAuction',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'Real-World Collectible Auction',
        isExternal: true,
        href: 'https://www.bounce.finance/realWorldCollectAuction',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'Ad Space Auction',
        isExternal: true,
        href: 'https://www.bounce.finance/adsAuction',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'SDKs&Plug-ins',
        isExternal: true,
        href: 'https://www.bounce.finance/sdkAndPlugins',
        isDisabled: false,
        extraIcon: '',
        className: ''
      }
    ],
    []
  )
  const SolutionsLinks = useMemo(
    () => [
      {
        label: 'Advertising',
        isExternal: true,
        href: 'https://www.bounce.finance/advertisementSolution',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'AI+Auction ',
        isExternal: true,
        href: 'https://www.bounce.finance/aiAuctionSolution',
        isDisabled: false,
        extraIcon: '',
        className: ''
      }
    ],
    []
  )
  const ResourcesLinks = useMemo(
    () => [
      {
        label: 'Document',
        isExternal: true,
        href: 'https://docs.bounce.finance/welcome-to-bounce-docs/welcome',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'Help Center',
        isExternal: true,
        href: 'https://www.bounce.finance/FAQ',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'Bounce Token',
        isExternal: true,
        href: 'https://www.bounce.finance/tools/token',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'Token Authentication',
        isExternal: true,
        href: '',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'SDKs&Plug-Ins',
        isExternal: true,
        href: 'https://www.bounce.finance/sdkAndPlugins',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'Community',
        isExternal: true,
        href: 'https://www.bounce.finance/joinCommunity',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'Become a Partner',
        isExternal: true,
        href: 'https://www.bounce.finance/joinCommunity',
        isDisabled: false,
        extraIcon: '',
        className: ''
      },
      {
        label: 'Contact Us',
        isExternal: true,
        href: 'https://docs.google.com/forms/d/1DJxbqqfv6MnN5-kOwDGU-_DGpXDxbJJkUT2UqKgvbUs/viewform?edit_requested=true',
        isDisabled: false,
        extraIcon: '',
        className: ''
      }
    ],
    []
  )
  return (
    <footer
      style={{
        position: 'relative',
        background: 'var(--ps-gray-20)',
        borderRadius: 30
      }}
    >
      <Container
        maxWidth="xl"
        disableGutters
        sx={{
          padding: 52
        }}
      >
        <Box
          sx={{
            position: 'relative',
            display: 'flex',
            flexFlow: 'row nowrap',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            paddingBottom: 32,
            marginBottom: 32,
            '&::after': {
              position: 'absolute',
              content: `''`,
              display: 'block',
              bottom: 0,
              left: 0,
              width: '100%',
              height: '1px',
              background: 'var(--ps-text-3)'
            }
          }}
        >
          <FooterSocialLink />
          <Box
            sx={{
              display: 'flex',
              flexFlow: 'row nowrap',
              justifyContent: 'flex-end',
              alignItems: 'flex-start'
            }}
            gap={120}
          >
            <FooterLinks title={'Products'} links={ProductsLinks} />
            <FooterLinks title={'Solutions'} links={SolutionsLinks} />
            <FooterLinks title={'Resources'} links={ResourcesLinks} />
          </Box>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexFlow: 'row nowrap',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            sx={{
              color: 'var(--ps-text-3)',
              opacity: '0.6'
            }}
          >{`©${new Date().getFullYear()} Bounce dao Ltd. All rights reserved.`}</Typography>
          <Box>
            <ExternalLink
              href={'https://www.bounce.finance/termsOfService'}
              role="link"
              rel="noopener noreferrer"
              target="_blank"
              sx={{
                color: 'var(--ps-text-3)',
                opacity: '0.6',
                marginRight: 40
              }}
            >
              Terms Of Service
            </ExternalLink>
            <ExternalLink
              href={'https://www.bounce.finance/privacyPolicy'}
              role="link"
              rel="noopener noreferrer"
              target="_blank"
              sx={{
                color: 'var(--ps-text-3)',
                opacity: '0.6'
              }}
            >
              Privacy Policy
            </ExternalLink>
          </Box>
        </Box>
      </Container>
    </footer>
  )
}

export default FooterPc

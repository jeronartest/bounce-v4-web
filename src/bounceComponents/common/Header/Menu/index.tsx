import { Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useCallback } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles'

const HeartMenu = () => {
  const router = useRouter()
  const menus = [
    {
      label: 'Auction',
      href: '/market'
    },
    {
      label: 'Company',
      href: '/company'
    },
    {
      label: 'Jobs',
      href: '/jobs'
    },
    {
      label: 'Token',
      href: process.env.REACT_APP_TOKEN_URL,
      target: '_blank'
    }
  ]

  const hasActive = useCallback(
    (path: string) => {
      return router?.pathname === path
    },
    [router?.pathname]
  )
  return (
    <Stack direction="row" spacing={60} alignItems="center">
      {menus.map(menu => (
        <Typography
          key={menu.label}
          sx={{ ...styles.menu, ...(hasActive(menu.href) ? styles.menuActive : ({} as any)) }}
        >
          {menu.target ? (
            <Link href={menu.href} target={menu.target}>
              {menu.label}
            </Link>
          ) : (
            <Link href={menu.href} legacyBehavior>
              {menu.label}
            </Link>
          )}
        </Typography>
      ))}
    </Stack>
  )
}

export default HeartMenu

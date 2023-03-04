import React, { ReactNode } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './styles'
import GoBack from '@/components/common/GoBack'

export const companyTabsList: ITabsListProps[] = [
  {
    labelKey: 'overview',
    label: 'Overview',
    href: '/company/edit/overview',
  },
  {
    labelKey: 'team',
    label: 'Team',
    href: '/company/edit/team',
  },
  {
    labelKey: 'tokens',
    label: 'Tokens',
    href: '/company/edit/tokens',
  },
  {
    labelKey: 'investors',
    label: 'Investors',
    href: '/company/edit/investors',
  },
  {
    labelKey: 'investments',
    label: 'Investments',
    href: '/company/edit/investments',
  },
]

export const profileTabsList: ITabsListProps[] = [
  {
    labelKey: 'overview',
    label: 'Overview',
    href: '/profile/edit/overview',
  },
  {
    labelKey: 'social',
    label: 'Social profile',
    href: '/profile/edit/social',
  },
  {
    labelKey: 'investments',
    label: 'Investments',
    href: '/profile/edit/investments',
  },
]

export const resumeTabsList: ITabsListProps[] = [
  {
    labelKey: 'job',
    label: 'Job Overview',
    href: '/profile/resume/job',
  },
  {
    labelKey: 'experience',
    label: 'Experience',
    href: '/profile/resume/experience',
  },
  {
    labelKey: 'education',
    label: 'Education',
    href: '/profile/resume/education',
  },
  {
    labelKey: 'preference',
    label: 'Preference',
    href: '/profile/resume/preference',
  },
  {
    labelKey: 'resume',
    label: 'Resume',
    href: '/profile/resume/resume',
  },
]

interface TabPanelProps {
  children?: React.ReactNode
  panelValue: number | string
  tabValue: number | string
}

export const TabPanel: React.FC<TabPanelProps> = (props) => {
  const { children, panelValue, tabValue } = props

  return <div hidden={panelValue !== tabValue}>{panelValue === tabValue && <Box>{children}</Box>}</div>
}

export interface ITabsListProps {
  labelKey: number | string
  label: string | ReactNode
  content?: string | ReactNode
  href?: string
}

interface ICompanyEditLayout {
  title: string | ReactNode
  tabsList: ITabsListProps[]
  goBack: () => void
  children?: React.ReactNode
}

const EditLayout: React.FC<ICompanyEditLayout> = ({ title, tabsList, goBack, children }) => {
  const router = useRouter()

  const hasActive = (path: string) => {
    return router.asPath.indexOf(path) > -1
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 40 }}>
      <GoBack title={title} goBack={goBack} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '320px auto', gridColumnGap: '20px', mt: 34 }}>
        <Stack spacing={8} sx={styles.menuBox}>
          {tabsList.map((item) => {
            return (
              <Link
                href={`${item.href}${router?.asPath?.split('?')?.[1] ? '?' + router?.asPath?.split('?')?.[1] : ''}`}
                legacyBehavior
                key={item.labelKey}
              >
                <Button
                  fullWidth
                  size="large"
                  variant={hasActive(item.href) ? 'contained' : 'text'}
                  sx={{ ...styles.menu, ...(hasActive(item.href) ? styles.menuActive : ({} as any)) }}
                >
                  <Typography variant="h4">{item.label}</Typography>
                </Button>
              </Link>
            )
          })}
        </Stack>

        <Box sx={{ background: '#FFFFFF', borderRadius: 20 }}>
          <Box sx={{ padding: '52px 100px 48px' }}>{children}</Box>
        </Box>
      </Box>
    </Container>
  )
}

export default EditLayout

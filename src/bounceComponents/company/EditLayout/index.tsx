import React, { ReactNode } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import styles from './styles'
import GoBack from 'bounceComponents/common/GoBack'
import { Link, useLocation } from 'react-router-dom'
import { routes } from 'constants/routes'

export const companyTabsList: ITabsListProps[] = [
  {
    labelKey: 'overview',
    label: 'Overview',
    href: routes.company.edit.overview
  },
  {
    labelKey: 'team',
    label: 'Team',
    href: routes.company.edit.team
  },
  {
    labelKey: 'tokens',
    label: 'Tokens',
    href: routes.company.edit.tokens
  },
  {
    labelKey: 'investors',
    label: 'Investors',
    href: routes.company.edit.investors
  },
  {
    labelKey: 'investments',
    label: 'Investments',
    href: routes.company.edit.investments
  }
]

export const profileTabsList: ITabsListProps[] = [
  {
    labelKey: 'overview',
    label: 'Overview',
    href: routes.profile.edit.overview
  },
  {
    labelKey: 'social',
    label: 'Social profile',
    href: routes.profile.edit.social
  },
  {
    labelKey: 'investments',
    label: 'Investments',
    href: routes.profile.edit.investments
  }
]

export const resumeTabsList: ITabsListProps[] = [
  {
    labelKey: 'job',
    label: 'Job Overview',
    href: routes.profile.resume.job
  },
  {
    labelKey: 'experience',
    label: 'Experience',
    href: routes.profile.resume.experience
  },
  {
    labelKey: 'education',
    label: 'Education',
    href: routes.profile.resume.education
  },
  {
    labelKey: 'preference',
    label: 'Preference',
    href: routes.profile.resume.preference
  },
  {
    labelKey: 'resume',
    label: 'Resume',
    href: routes.profile.resume.resume
  }
]

interface TabPanelProps {
  children?: React.ReactNode
  panelValue: number | string
  tabValue: number | string
}

export const TabPanel: React.FC<TabPanelProps> = props => {
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
  const { pathname, search } = useLocation()

  const hasActive = (path: string | undefined) => {
    if (!path) return false
    return pathname.indexOf(path) > -1
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 40 }}>
      <GoBack title={title} goBack={goBack} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '320px auto', gridColumnGap: '20px', mt: 34 }}>
        <Stack spacing={8} sx={styles.menuBox}>
          {tabsList.map(item => {
            return (
              <Link
                to={`${item.href}${search?.split('?')?.[1] ? '?' + search?.split('?')?.[1] : ''}`}
                key={item.labelKey}
              >
                <Button
                  fullWidth
                  size="large"
                  variant={hasActive(item?.href) ? 'contained' : 'text'}
                  sx={{ ...styles.menu, ...(hasActive(item?.href) ? styles.menuActive : ({} as any)) }}
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

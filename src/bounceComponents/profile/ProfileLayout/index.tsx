import React, { ReactNode } from 'react'
import { Box, Container, Tab, Tabs } from '@mui/material'
import styles from './styles'
import GoBack from '@/components/common/GoBack'

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

interface IProfileLayoutProps {
  title: string | ReactNode
  tabsList: ITabsListProps[]
  tabValue: number | string
  handleChange: (event: React.SyntheticEvent, newValue: string | number) => void
  goBack: () => void
}

const ProfileLayout: React.FC<IProfileLayoutProps> = ({ title, tabsList, tabValue, handleChange, goBack }) => {
  return (
    <Container maxWidth="lg" sx={{ mt: 40 }}>
      <GoBack title={title} goBack={goBack} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '320px auto', gridColumnGap: '20px', mt: 34 }}>
        <Box sx={styles.tabsBox}>
          <Tabs sx={styles.tabsRoot} value={tabValue} onChange={handleChange} orientation="vertical">
            {tabsList.map((item) => {
              return <Tab key={item.labelKey} value={item.labelKey} label={item.label} />
            })}
          </Tabs>
        </Box>

        <Box sx={{ background: '#FFFFFF', borderRadius: 20 }}>
          {tabsList.map((item) => {
            return (
              <TabPanel key={item.labelKey} tabValue={tabValue} panelValue={item.labelKey}>
                <Box sx={{ padding: '52px 100px 48px' }}>{item.content}</Box>
              </TabPanel>
            )
          })}
        </Box>
      </Box>
    </Container>
  )
}

export default ProfileLayout

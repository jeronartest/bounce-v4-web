import React from 'react'
import { Box, Grid, Typography } from '@mui/material'
// import { ITabsListProps } from '../../ProfileLayout'
// import styles from './styles'
import { IProfileUserInfo } from 'api/user/type'
import { getLabelById, getPrimaryRoleLabel } from 'utils'
import { useOptionDatas } from 'state/configOptions/hooks'

export const ExperienctAndSkill: React.FC<IPortfolioPreferenceProps> = ({ personalInfo }) => {
  const optionDatas = useOptionDatas()

  return (
    <Grid container sx={{ padding: '20px 16px', borderRadius: 20, background: 'var(--ps-gray-50)' }}>
      <Grid item xs={4}>
        <Typography variant="body1" sx={{ color: 'var(--ps-gray-700)' }}>
          Primary Role & Experience
        </Typography>
        <Typography>
          {getPrimaryRoleLabel(personalInfo?.primaryRole, optionDatas?.primaryRoleOpt) || '-'}
          {!!personalInfo?.years && (
            <span>,&nbsp;&nbsp;{getLabelById(personalInfo?.years, 'years', optionDatas?.experienceYearOpt)}</span>
          )}
        </Typography>
      </Grid>
      <Grid item xs={8}>
        <Typography variant="body1" sx={{ color: 'var(--ps-gray-700)' }}>
          Skills
        </Typography>
        <Typography>{personalInfo?.skills || '-'}</Typography>
      </Grid>
    </Grid>
  )
}

interface IPortfolioPreferenceProps {
  personalInfo: IProfileUserInfo
}

export const PortfolioPreference: React.FC<IPortfolioPreferenceProps> = ({ personalInfo }) => {
  const optionDatas = useOptionDatas()

  return (
    <Box px={48} pb={56}>
      <Typography variant="h2" sx={{ fontSize: 24, lineHeight: '32px', mt: 30, mb: 30 }}>
        Work Preference
      </Typography>
      <ExperienctAndSkill personalInfo={personalInfo} />
      <Grid container spacing={8} rowGap={32} mt={32}>
        <Grid item xs={12}>
          <Typography variant="body2" color="var(--ps-gray-700)">
            {`What's most important in the next job`}
          </Typography>
          <Typography variant="body1" mt={6}>
            {!personalInfo?.careJobs
              ? '-'
              : personalInfo?.careJobs?.map((item, index) => {
                  return (index !== 0 ? ', ' : '') + getLabelById(item, 'jobCare', optionDatas?.jobCareOpt)
                })}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body2" color="var(--ps-gray-700)">
            Current State
          </Typography>
          <Typography variant="body1" mt={6}>
            {personalInfo?.currentState || '-'}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body2" color="var(--ps-gray-700)">
            Job Types
          </Typography>
          <Typography variant="body1" mt={6}>
            {!personalInfo?.jobTypes
              ? '-'
              : personalInfo?.jobTypes?.map((item, index) => {
                  return (index !== 0 ? ', ' : '') + getLabelById(item, 'jobType', optionDatas?.jobTypeOpt)
                })}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body2" color="var(--ps-gray-700)">
            Open to work remotely
          </Typography>
          <Typography variant="body1" mt={6}>
            {personalInfo?.ifRemotely ? (personalInfo?.ifRemotely === 2 ? 'Yes' : 'No') : '-'}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body2" color="var(--ps-gray-700)">
            Desired Salary (Annual)
          </Typography>
          <Typography variant="body1" mt={6}>
            {personalInfo?.desiredSalary ? `$ ${personalInfo?.desiredSalary}` : '-'}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body2" color="var(--ps-gray-700)">
            Desired Company Size
          </Typography>
          <Typography variant="body1" mt={6}>
            {getLabelById(personalInfo?.desiredCompanySize, 'size', optionDatas?.companySizeOpt) || '-'}
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="body2" color="var(--ps-gray-700)">
            Desired Market
          </Typography>
          <Typography variant="body1" mt={6}>
            {!personalInfo?.desiredMarket
              ? '-'
              : personalInfo?.desiredMarket?.map((item, index) => {
                  return (index !== 0 ? ', ' : '') + getLabelById(item, 'marketType', optionDatas?.marketTypeOpt)
                })}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  )
}

interface IPortfolioBoxProps {
  personalInfo: IProfileUserInfo
}

const PortfolioBox: React.FC<IPortfolioBoxProps> = ({ personalInfo }) => {
  // const [tabValue, setTabValue] = useState<string>('portfolio')

  // const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  //   setTabValue(newValue)
  // }
  // const tabsList: ITabsListProps[] = useMemo(
  //   () => [
  //     {
  //       labelKey: 'portfolio',
  //       label: 'Portfolio',
  //       content: (
  //         <Box>
  //           <PortfolioPreference personalInfo={personalInfo} />
  //         </Box>
  //       )
  //     },
  //     {
  //       labelKey: 'job',
  //       label: 'Job watchlist',
  //       content: <div style={{ padding: '0 48px' }}>39475834</div>
  //     }
  //   ],
  //   [personalInfo]
  // )

  return (
    <Box>
      <PortfolioPreference personalInfo={personalInfo} />
      {/* <Tabs sx={{ ...styles.tabsRoot, padding: '0 48px' }} value={tabValue} onChange={handleChange}>
        {tabsList.map((item) => {
          return <Tab key={item.labelKey} value={item.labelKey} label={item.label} />
        })}
      </Tabs>
      {tabsList.map((item) => {
        return (
          <TabPanel key={item.labelKey} tabValue={tabValue} panelValue={item.labelKey}>
            <Box mt={38}>{item.content}</Box>
          </TabPanel>
        )
      })} */}
    </Box>
  )
}

export default PortfolioBox

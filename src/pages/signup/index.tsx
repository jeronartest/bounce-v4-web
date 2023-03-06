import { Container, Typography } from '@mui/material'
import React from 'react'
import { Stack } from '@mui/system'
import { ReactComponent as AccountSVG } from 'bounceComponents/signup/assets/account.svg'
import { ReactComponent as CompanttSVG } from 'bounceComponents/signup/assets/compant.svg'
import { ReactComponent as InvestorSVG } from 'bounceComponents/signup/assets/investor.svg'
import SignupLayout from 'bounceComponents/signup/SignupLayout'
import PaperBox from 'bounceComponents/signup/PaperBox'
import SelectCard from 'bounceComponents/signup/SelectCard'
import { useNavigate } from 'react-router-dom'
import { routes } from 'constants/routes'

const SignUp: React.FC = ({}) => {
  const navigate = useNavigate()
  return (
    <section>
      <SignupLayout>
        <Container maxWidth="xl">
          <PaperBox
            title="Welcome to Bounce Finance"
            subTitle="We’re glad your’re here. Select your path to get started."
            sx={{ p: 32, pb: 80 }}
          >
            <Stack direction={'row'} spacing={20} display={'flex'} px="115px" pt={'54px'} pb={'60px'}>
              <SelectCard
                icon={<AccountSVG />}
                title={'Individual Account'}
                path={routes.signup.account}
                description={'Individual Investor, DeFi User, Freelancer, Project Founder etc'}
                buttonText="Continue"
              />
              <SelectCard
                icon={<CompanttSVG />}
                title={'Company Account'}
                path={routes.signup.company}
                description={
                  'Serving all stages of commercial ventures, from early stage startups to more established businesses and projects.'
                }
                buttonText="Continue"
                blackButton={true}
              />
              <SelectCard
                icon={<InvestorSVG />}
                title={
                  <>
                    Institutional Investor <br />
                    (Invited Only)
                  </>
                }
                path={routes.signup.institutions}
                description={'Insurance Companies, Funds, Endowments, Commercial Trusts, Banks and more'}
                buttonText="Continue"
              />
            </Stack>
            <Stack spacing={8} textAlign="center">
              <Typography variant="body1" color="var(--ps-gray-600)">
                Does your account information already exist?
              </Typography>
              <Typography
                variant="body1"
                color="#2663FF"
                sx={{ cursor: 'pointer' }}
                onClick={() => navigate(routes.verify)}
              >
                Verify your account
              </Typography>
            </Stack>
          </PaperBox>
        </Container>
      </SignupLayout>
    </section>
  )
}

export default SignUp

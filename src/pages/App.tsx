import { Suspense, useEffect } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from '../components/Header'
import Polling from '../components/essential/Polling'
import Popups from '../components/essential/Popups'
import Web3ReactManager from '../components/essential/Web3ReactManager'
// import WarningModal from '../components/Modal/WarningModal'
// import ComingSoon from './ComingSoon'
import { ModalProvider } from 'context/ModalContext'
import { routes } from 'constants/routes'
// import Footer from 'components/Footer'
import { Questions } from 'bounceComponents/common/Questions'
import { Provider as NiceModalProvider } from '@ebay/nice-modal-react'
import { Mobile } from 'bounceComponents/common/Mobile'
import { ShowOnMobile } from 'themes/context'
import { ToastContainer } from 'react-toastify'
import { useGetOptionsData } from 'bounceHooks/useOptionsData'
import { AppWrapper, BodyWrapper, ContentWrapper } from './style'
import 'react-toastify/dist/ReactToastify.css'

import Companies from 'pages/companies'

import Company from 'pages/company'
import CompanyActivities from 'pages/company/activities'
import CompanyComments from 'pages/company/comments'
import CompanyEdit from 'pages/company/edit/index'
import CompanyEditInvestments from 'pages/company/edit/investments'
import CompanyEditInvestors from 'pages/company/edit/investors'
import CompanyEditOverview from 'pages/company/edit/overview'
import CompanyEditTeam from 'pages/company/edit/team'
import CompanyEditTokens from 'pages/company/edit/tokens'
import CompanyFunding from 'pages/company/funding'
import CompanyInvestors from 'pages/company/institutionInvestors'
import CompanyJobs from 'pages/company/jobs'
import CompanyStartupIdeas from 'pages/company/startupIdeas'
import CompanySummary from 'pages/company/summary'
import CompanyTeam from 'pages/company/team'
import CompanyTopCompanies from 'pages/company/topCompanies'

import IdeaCreate from 'pages/idea/create'
import IdeaDetail from 'pages/idea/detail'

import Investment from 'pages/investment'
import InvestmentPlatform from 'pages/investment/platform'

import Jobs from 'pages/jobs'

import Linkedin from 'pages/linkedin'

import Login from 'pages/login'

import Market from 'pages/market'
import MarketPools from 'pages/market/pools'

import AccountSettings from 'pages/profile/account/settings'
import ProfileActivities from 'pages/profile/activities'
import ProfileBasic from 'pages/profile/basic'
import ProfileEditInvestments from 'pages/profile/edit/investments'
import ProfileEditOverview from 'pages/profile/edit/overview'
import ProfileEditSocial from 'pages/profile/edit/social'
import ProfilePortfolio from 'pages/profile/portfolio'
import ProfileResume from 'pages/profile/resume'
import ProfileResumeEducation from 'pages/profile/resume/education'
import ProfileResumeExperience from 'pages/profile/resume/experience'
import ProfileResumeJob from 'pages/profile/resume/job'
import ProfileResumePreference from 'pages/profile/resume/preference'
import ProfileResumeResume from 'pages/profile/resume/resume'
import ProfileSummary from 'pages/profile/summary'

import Signup from 'pages/signup'
import SignupAccount from 'pages/signup/account'
import SignupCompany from 'pages/signup/company'
import SignupInstitutions from 'pages/signup/institutions'
import SignupThirdPartiesAccount from 'pages/signup/thirdPartiesAccount'
import SignupThirdPartiesCompany from 'pages/signup/thirdPartiesCompany'
import SignupThirdPartiesInstitutions from 'pages/signup/thirdPartiesInstitutions'

import Token from 'pages/token'
import Verify from 'pages/verify'

const GlobalHooks = () => {
  useGetOptionsData()
  return null
}

export default function App() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <Suspense fallback={null}>
      <ModalProvider>
        <NiceModalProvider>
          <AppWrapper id="app">
            <ContentWrapper>
              <GlobalHooks />
              <Header />
              <ToastContainer />
              <Questions />
              <ShowOnMobile breakpoint="md">
                <Mobile />
              </ShowOnMobile>
              <BodyWrapper id="body">
                <Popups />
                <Polling />
                {/* <WarningModal /> */}
                <Web3ReactManager>
                  <Routes>
                    <Route path={routes.companies} element={<Companies />} />

                    <Route path={routes.company.index} element={<Company />} />
                    <Route path={routes.company.activities} element={<CompanyActivities />} />
                    <Route path={routes.company.comments} element={<CompanyComments />} />
                    <Route path={routes.company.edit.index} element={<CompanyEdit />} />
                    <Route path={routes.company.edit.investments} element={<CompanyEditInvestments />} />
                    <Route path={routes.company.edit.investors} element={<CompanyEditInvestors />} />
                    <Route path={routes.company.edit.overview} element={<CompanyEditOverview />} />
                    <Route path={routes.company.edit.team} element={<CompanyEditTeam />} />
                    <Route path={routes.company.edit.tokens} element={<CompanyEditTokens />} />
                    <Route path={routes.company.funding} element={<CompanyFunding />} />
                    <Route path={routes.company.institutionInvestors} element={<CompanyInvestors />} />
                    <Route path={routes.company.jobs} element={<CompanyJobs />} />
                    <Route path={routes.company.startupIdeas} element={<CompanyStartupIdeas />} />
                    <Route path={routes.company.summary} element={<CompanySummary />} />
                    <Route path={routes.company.team} element={<CompanyTeam />} />
                    <Route path={routes.company.topCompanies} element={<CompanyTopCompanies />} />

                    <Route path={routes.idea.create} element={<IdeaCreate />} />
                    <Route path={routes.idea.detail} element={<IdeaDetail />} />

                    <Route path={routes.investment.index} element={<Investment />} />
                    <Route path={routes.investment.platform} element={<InvestmentPlatform />} />

                    <Route path={routes.jobs.index} element={<Jobs />} />

                    <Route path={routes.linkedin} element={<Linkedin />} />

                    <Route path={routes.login} element={<Login />} />

                    <Route path={routes.market.index} element={<Market />} />
                    <Route path={routes.market.pools} element={<MarketPools />} />

                    <Route path={routes.profile.account.settings} element={<AccountSettings />} />
                    <Route path={routes.profile.activities} element={<ProfileActivities />} />
                    <Route path={routes.profile.basic} element={<ProfileBasic />} />
                    <Route path={routes.profile.edit.investments} element={<ProfileEditInvestments />} />
                    <Route path={routes.profile.edit.overview} element={<ProfileEditOverview />} />
                    <Route path={routes.profile.edit.social} element={<ProfileEditSocial />} />
                    <Route path={routes.profile.portfolio} element={<ProfilePortfolio />} />
                    <Route path={routes.profile.resume.index} element={<ProfileResume />} />
                    <Route path={routes.profile.resume.education} element={<ProfileResumeEducation />} />
                    <Route path={routes.profile.resume.experience} element={<ProfileResumeExperience />} />
                    <Route path={routes.profile.resume.job} element={<ProfileResumeJob />} />
                    <Route path={routes.profile.resume.preference} element={<ProfileResumePreference />} />
                    <Route path={routes.profile.resume.resume} element={<ProfileResumeResume />} />
                    <Route path={routes.profile.summary} element={<ProfileSummary />} />

                    <Route path={routes.signup.index} element={<Signup />} />
                    <Route path={routes.signup.account} element={<SignupAccount />} />
                    <Route path={routes.signup.company} element={<SignupCompany />} />
                    <Route path={routes.signup.institutions} element={<SignupInstitutions />} />
                    <Route path={routes.signup.thirdPartiesAccount} element={<SignupThirdPartiesAccount />} />
                    <Route path={routes.signup.thirdPartiesCompany} element={<SignupThirdPartiesCompany />} />
                    <Route path={routes.signup.thirdPartiesInstitutions} element={<SignupThirdPartiesInstitutions />} />

                    <Route path={routes.token} element={<Token />} />
                    <Route path={routes.verify} element={<Verify />} />

                    {/* <Route path={routes.test2} element={<ComingSoon />} />
                      <Route path={routes.test3 + routes.test3Desc} element={<ComingSoon />} />
                    </Route> */}
                    <Route path="*" element={<Navigate to={routes.market.index} replace />} />
                  </Routes>
                </Web3ReactManager>
              </BodyWrapper>
              {/* <Footer /> */}
            </ContentWrapper>
          </AppWrapper>
        </NiceModalProvider>
      </ModalProvider>{' '}
    </Suspense>
  )
}

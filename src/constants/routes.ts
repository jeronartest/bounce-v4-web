export const routes = {
  auction: {
    createAuctionPool: '/auction/create-auction-pool',
    createAuctionPoolType: '/auction/create-auction-pool/:auctionType/:chainIdOrName',
    fixedPrice: '/auction/fixed-price/:chainShortName/:poolId'
  },
  companies: '/companies',
  company: {
    index: '/company',
    activities: '/company/activities',
    comments: '/company/comments',
    edit: {
      index: '/company/edit',
      investments: '/company/edit/investments',
      investors: '/company/edit/investors',
      overview: '/company/edit/overview',
      team: '/company/edit/team',
      tokens: '/company/edit/tokens'
    },
    funding: '/company/funding',
    institutionInvestors: '/company/institutionInvestors',
    jobs: '/company/jobs',
    startupIdeas: '/company/startupIdeas',
    summary: '/company/summary',
    team: '/company/team',
    topCompanies: '/company/topCompanies'
  },
  idea: {
    create: '/idea/create',
    detail: '/idea/detail'
  },
  jobs: {
    index: '/jobs'
  },
  linkedin: 'linkedin',
  login: '/login',
  investment: {
    index: '/investment',
    platform: '/investment/platform'
  },
  market: {
    index: '/market',
    pools: '/market/pools'
  },
  profile: {
    account: {
      settings: '/profile/account/settings'
    },
    activities: '/profile/activities',
    basic: '/profile/basic',
    edit: {
      investments: '/profile/edit/investments',
      overview: '/profile/edit/overview',
      social: '/profile/edit/social'
    },
    portfolio: '/profile/portfolio',
    resume: {
      index: '/profile/resume',
      education: '/profile/resume/education',
      experience: '/profile/resume/experience',
      job: '/profile/resume/job',
      preference: '/profile/resume/preference',
      resume: '/profile/resume/resume'
    },
    summary: '/profile/summary'
  },
  signup: {
    index: '/signup',
    account: '/signup/account',
    company: '/signup/company',
    institutions: '/signup/institutions',
    thirdPartiesAccount: '/signup/thirdPartiesAccount',
    thirdPartiesCompany: '/signup/thirdPartiesCompany',
    thirdPartiesInstitutions: '/signup/thirdPartiesInstitutions'
  },
  token: '/token',
  verify: '/verify'
}

export const routes = {
  auction: {
    createAuctionPool: '/auction/create-auction-pool',
    createAuctionPoolType: '/auction/create-auction-pool/:auctionType/:chainIdOrName/:tokenType',
    fixedPrice: '/auction/fixed-price/:chainShortName/:poolId'
  },
  login: '/login',
  market: {
    index: '/market',
    pools: '/market/pools'
  },
  realAuction: {
    index: '/real-auction'
  },
  adsAuction: {
    index: '/ads-auction'
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
    summary: '/profile/summary',
    summaryReal: '/profile/summary/real',
    summaryAds: '/profile/summary/ads'
  },
  signup: {
    account: '/signup/account',
    thirdPartiesAccount: '/signup/thirdPartiesAccount'
  },
  account: {
    dashboard: '/account/dashboard',
    myProfile: '/account/my_profile',
    myAccount: '/account/my_account',
    tokenOrNFT: '/account/token_nft'
  }
}

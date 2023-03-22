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
    summary: '/profile/summary'
  },
  signup: {
    account: '/signup/account',
    thirdPartiesAccount: '/signup/thirdPartiesAccount'
  }
}

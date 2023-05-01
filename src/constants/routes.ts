export const routes = {
  auction: {
    createAuctionPool: '/auction/create-auction-pool',
    createAuctionPoolType: '/auction/create-auction-pool/:auctionType/:chainIdOrName/:tokenType',
    fixedSwapNft: '/auction/fixed-swap-1155/:chainShortName/:poolId',
    fixedPrice: '/auction/fixed-price/:chainShortName/:poolId',
    englishAuction: '/auction/english-auction/:chainShortName/:poolId',
    randomSelection: '/auction/random-selection/:chainShortName/:poolId'
  },
  login: '/login',
  test: '/test',
  market: {
    index: '/market',
    pools: '/market/pools',
    nftPools: '/market/nft-pools'
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
    tokenOrNFT: '/account/token_nft',
    realAuction: '/account/real_auction',
    adsAuction: '/account/ads_auction'
  }
}

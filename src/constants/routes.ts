export const routes = {
  login: '/login',
  signup: '/signup',
  profile: {
    index: '/profile',
    basic: '/profile/basic',
    summary: '/profile/summary',
    account: {
      settings: '/profile/account/settings'
    },
    edit: {
      overview: '/profile/edit/overview'
    }
  },
  company: {
    index: '/company',
    basic: '/company/basic',
    summary: '/company/summary',
    edit: {
      overview: '/company/edit/overview'
    }
  },
  test1: '/test1',
  test2: '/test2',
  test3: '/test3',
  test3Desc: '/:id'
}

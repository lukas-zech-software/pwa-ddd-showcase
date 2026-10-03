export const CUSTOMER_COMMON_ROUTES = {
  index:   '/',
  error:   '/error',
  login:   '/login',
  account: '/account',
};

export const CUSTOMER_NEWS_ROUTES = {
  newsBasePath:     '/news',
  newsListViewPath: '/news/list',
  newsMapViewPath:  '/news/map',
  filterViewPath:   '/new/filter',
};

export const CUSTOMER_DEAL_ROUTES = {
  searchAppendix:   '?search=true',
  dealBasePath:     '/deal',
  dealMapViewPath:  '/deal/map',
  dealListViewPath: '/deal/list',
  // CORONA
  filterViewPath:   '/company/filter',
};

export const CUSTOMER_MARKET_ROUTES = {
  marketBasePath:     '/market',
  marketDetailsPath:  '/market/details',
  marketDetails:     '/market/:marketId/details',
  marketMapViewPath:  '/market/map',
  marketListViewPath: '/market/list',
  filterViewPath:     '/company/filter',
};

export const CUSTOMER_COMPANY_ROUTES = {
  dealDetails:         '/company/:companyId/deal/:dealId/details',
  newsDetails:         '/company/:companyId/news/:dealId/details',
  dealClaim:           '/company/:companyId/deal/:dealId/claim',
  companyDetails:      '/company/:companyId/details',
  dealDetailsPath:     '/deal/details',
  newsDetailsPath:     '/news/details',
  dealClaimPath:       '/deal/claim',
  companyBasePath:     '/company',
  companyDetailsPath:  '/company/[companyId]/details',
  companyListViewPath: '/company/list',
  companyMapViewPath:  '/company/map',
  filterViewPath:     '/company/filter',
};

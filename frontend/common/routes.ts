/* eslint-disable no-multi-spaces */
export enum DashboardRoutes {
  Home                  = '/',
  Dashboard             = '/:companyId',
  Deals                 = '/:companyId/deals/list/:newDealId?',
  EditDeal              = '/:companyId/deals/edit/:dealId',
  NewDeal               = '/:companyId/deals/new',
  TemplateDeal          = '/:companyId/deals/new/template',
  Restaurant            = '/:companyId/restaurant',
  Dishes            = '/:companyId/dishes',
  Corona                = '/:companyId/corona',
  Settings              = '/:companyId/settings',
  Welcome               = '/welcome',
  Login                 = '/login',
  Logout                 = '/logout',
  Registration          = '/register',
  ErrorEmailNotVerified = '/email-not-verified',
  AuthCallback          = '/auth_callback',
  EmailCallback         = '/verify_email',
  Contact               = '/contact',
  Feedback              = '/feedback',
}

export enum CommonRoutes {
  Error = '/error',
}

export const DEAL_ROUTES = {
  searchAppendix: '?search=true',
  dealsIndexPath: '/deal',
  listViewPath:   '/deal/list',
  mapViewPath:    '/deal/map',
  // CORONA
  filterViewPath: '/company/filter',
};

export const COMPANY_ROUTES = {
  dealDetails:        '/company/:companyId/deal/:dealId/details',
  companyDetails:     '/company/:companyId/details',
  dealDetailsPath:    '/deal/details',
  companyDetailsPath: '/company/details',
};

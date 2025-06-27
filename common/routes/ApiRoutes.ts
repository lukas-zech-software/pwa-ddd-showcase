import {
  ICompanyUrlContext,
  IDealUrlContext,
} from '../interfaces';

export const HEALT_BASE                  = '/healthz';
export const CACHE_BASE                  = '/cache/reset';
export const DEACTIVATE_GOOGLE_ANALYTICS = '/-/action/deactivateGoogleAnalytics';

export const COMPANY_BASE = '/company';

export const COMPANY_ROUTES = {
  all:           COMPANY_BASE + '/-/query/GetAll',
  own:           COMPANY_BASE + '/-/query/GetOwn',
  historyImages: COMPANY_BASE + '/:companyId/query/GetHistoryImages' as XRoute<ICompanyUrlContext>,
  stockImages:   COMPANY_BASE + '/-/query/GetStockImages',
  get:           COMPANY_BASE + '/:companyId/query/Get' as XRoute<ICompanyUrlContext>,
  dealAccount:   COMPANY_BASE + '/:companyId/query/DealAccount' as XRoute<ICompanyUrlContext>,

  register:            COMPANY_BASE + '/-/action/Register',
  approve:             COMPANY_BASE + '/:companyId/action/Approve' as XRoute<ICompanyUrlContext>,
  clone:               COMPANY_BASE + '/:companyId/action/Clone' as XRoute<ICompanyUrlContext>,
  delete:              COMPANY_BASE + '/:companyId/action/Delete' as XRoute<ICompanyUrlContext>,
  actAsOwner:          COMPANY_BASE + '/:companyId/action/ActAsOwner' as XRoute<ICompanyUrlContext>,
  stopActingAsOwner:   COMPANY_BASE + '/:companyId/action/stopActingAsOwner' as XRoute<ICompanyUrlContext>,
  testData:            COMPANY_BASE + '/:companyId/action/TestData' as XRoute<ICompanyUrlContext>,
  updateContact:       COMPANY_BASE + '/:companyId/action/UpdateContact' as XRoute<ICompanyUrlContext>,
  updateDetails:       COMPANY_BASE + '/:companyId/action/UpdateDetails' as XRoute<ICompanyUrlContext>,
  updateCorona:        COMPANY_BASE + '/:companyId/action/UpdateCorona' as XRoute<ICompanyUrlContext>,
  uploadImages:        COMPANY_BASE + '/:companyId/action/UploadImages' as XRoute<ICompanyUrlContext>,
  updateImages:        COMPANY_BASE + '/:companyId/action/UpdateImages' as XRoute<ICompanyUrlContext>,
  updateMenuDocument:  COMPANY_BASE + '/:companyId/action/UpdateMenuDocument' as XRoute<ICompanyUrlContext>,
  updateOptional:      COMPANY_BASE + '/:companyId/action/UpdateOptional' as XRoute<ICompanyUrlContext>,
  updateDishes:        COMPANY_BASE + '/:companyId/action/UpdateDishes' as XRoute<ICompanyUrlContext>,
  restoreMenuDocument: COMPANY_BASE + '/:companyId/action/RestoreMenuDocument' as XRoute<ICompanyUrlContext>,
  restoreLogo:         COMPANY_BASE + '/:companyId/action/RestoreLogo' as XRoute<ICompanyUrlContext>,
  restoreImage:        COMPANY_BASE + '/:companyId/action/RestoreImage' as XRoute<ICompanyUrlContext>,
  resetDealAccount:    COMPANY_BASE + '/:companyId/action/ResetDealAccount' as XRoute<ICompanyUrlContext>,
};

export const USER_BASE = '/user';

export const USER_ROUTES = {
  own:                     USER_BASE + '/-/query/Own',
  login:                   USER_BASE + '/-/action/Login',
  update:                  USER_BASE + '/-/action/Update',
  resendVerificationEmail: USER_BASE + '/-/action/ResendVerificationEmail',
};

export const HUB_USER_ROUTES = {
  getAll:      USER_BASE + '/-/query/GetAll',
  restaurants: USER_BASE + '/:userAuthId/query/GetRestaurantsForOwner',
  update:      USER_BASE + '/:userId/action/Update',
  delete:      USER_BASE + '/:userId/action/Delete',
};

export const DEAL_BASE = COMPANY_BASE + '/:companyId/deal';

export const DEAL_ROUTES = {
  getAll: DEAL_BASE + '/-/query/GetAllDeals',
  getId:  DEAL_BASE + '/-/query/GetId',
  get:    DEAL_BASE + '/:dealId/query/Get' as XRoute<IDealUrlContext>,

  create:       DEAL_BASE + '/-/action/CreateNewDeal',
  bulkPublish:  DEAL_BASE + '/-/action/BulkPublish',
  delete:       DEAL_BASE + '/:dealId/action/Delete' as XRoute<IDealUrlContext>,
  cancel:       DEAL_BASE + '/:dealId/action/Cancel' as XRoute<IDealUrlContext>,
  publish:      DEAL_BASE + '/:dealId/action/Publish' as XRoute<IDealUrlContext>,
  update:       DEAL_BASE + '/:dealId/action/Update' as XRoute<IDealUrlContext>,
  updateImage:  DEAL_BASE + '/:dealId/action/UpdateImage' as XRoute<IDealUrlContext>,
  restoreImage: DEAL_BASE + '/:dealId/action/RestoreImage' as XRoute<IDealUrlContext>,
};

export const HUB_DEAL_ROUTES = {
  getAllForCurrentMonth: '/query/GetAllDealsForCurrentMonth',
};

export const CUSTOMER_DEAL_ROUTES = {
  getForId:                   DEAL_BASE + '/:dealId/query/Get',
  getForFilter:               '/query/getForFilter',
  getForFilterMinimal:        '/query/getForFilterMinimal',
  getTop:                     '/query/getTop',
  getThisWeeksDealsByCompany: '/query/getThisWeeksDealsByCompany',
  getCompany:                 '/query/getCompany/:companyId',
};

export const HUB_DEAL_ACCOUNT_ROUTES = {
  getAll:         COMPANY_BASE + '/-/query/GetAllDealAccounts',
  setDealAccount: COMPANY_BASE + '/:companyId/action/SetDealAccount' as XRoute<ICompanyUrlContext>,
};

export const MARKET_BASE = '/market';

export const CUSTOMER_MARKET_ROUTES = {
  getForId:     MARKET_BASE + '/:marketId/query/Get',
  getForFilter: MARKET_BASE + '/query/getForFilter',
};

export const CUSTOMER_CACHE_ROUTES = {
  clearAll:     CACHE_BASE + '/all',
  clearCompany: CACHE_BASE + '/company/:companyId',
};

export const CONTACT_ROUTES = {
  sendSupportEmail:  '/contact/support',
  sendFeedbackEmail: '/contact/feedback',
};

export type XRoute<T> = string & { routeParameters?: T };

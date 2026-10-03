export const keys = {
  // CONFIG
  IsProduction:                  Symbol('IS_PRODUCTION'),
  GoogleCloudProjectId:          Symbol('GOOGLE_CLOUD_PROJECT_ID'),
  GoogleCloudAppCredentialsPath: Symbol('GOOGLE_CLOUD_API_KEY_PATH'),
  ApiType:                       Symbol('API_TYPE'),
  ApiPort:                       Symbol('GOOGLE_CLOUD_API_KEY_PATH'),
  BaseUrl:                       Symbol('BASE_URL'),
  ApplicationRoot:               Symbol('APPLICATION_ROOT'),

  // StartUp Function
  InitFn: Symbol('InitFn'),

  // CONTROLLER
  Controller: Symbol('CONTROLLER'),

  // CONTAINER
  Container: Symbol('CONTAINER'),

  // ENTITIES
  IMail: Symbol('IMail'),

  // SERVICES
  ICustomerSearchService: Symbol('ICustomerSearchService'),
  IUserAccountService:    Symbol('IUserAccountService'),
  IDealService:           Symbol('IDealService'),

  // INFRASTRUCTURE
  IGeoCodingService:       Symbol('IGeoCodingService'),
  IImageConvertService:    Symbol('IImageConvertService'),
  ICloudStorageService:    Symbol('ICloudStorageService'),
  ICacheBreakService:      Symbol('ICacheBreakService'),
  ICacheService:           Symbol('ICacheService'),
  IGeoCodeCacheService:    Symbol('IGeoCodeCacheService'),
  IHashCacheService:       Symbol('IHashCacheService'),
  IAuthenticationService:  Symbol('IAuthenticationService'),
  IAuth0ManagementService: Symbol('IAuth0ManagementService'),
  IMailChimpFacade:        Symbol('IMailChimpFacade'),
  IJwtTokenService:        Symbol('IJwtTokenService'),
  IDealAccountService:     Symbol('IDealAccountService'),
  ISitemapService:         Symbol('ISitemapService'),
  ITaskService:            Symbol('ITaskService'),

  // FACADES
  ICompanyFacade:     Symbol('ICompanyFacade'),
  IMarketFacade:     Symbol('IMarketFacade'),
  IUserFacade:        Symbol('IUserFacade'),
  IDealFacade:        Symbol('IDealFacade'),
  IDealAccountFacade: Symbol('IDealAccountFacade'),

  // FACTORIES
  ICompanyFactory:     Symbol('ICompanyFactory'),
  IUserFactory:        Symbol('IUserFactory'),
  IDealFactory:        Symbol('IDealFactory'),
  IDealAccountFactory: Symbol('IDealAccountFactory'),
  IMailFactory:        Symbol('IMailFactory'),

  // REPOSITORIES
  ICompanyRepository:     Symbol('ICompanyRepository'),
  IUserRepository:        Symbol('IUserRepository'),
  IDealRepository:        Symbol('IDealRepository'),
  IDealAccountRepository: Symbol('IDealAccountRepository'),
};

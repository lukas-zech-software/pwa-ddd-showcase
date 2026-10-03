import { TimeInMs }                   from '@my-old-startup/common/datetime';
import {
  Container,
  ContainerModule,
  interfaces,
}                                     from 'inversify';
import { TestDb }                     from '../../test/data/db/TestDb';
import { TestQuery }                  from '../../test/data/db/TestQuery';
import {
  AuthenticationService,
  IAuthenticationService,
}                                     from '../api/authentication/AuthenticationService';
import {
  IJwtTokenService,
  JwtTokenService,
}                                     from '../api/authentication/JwtTokenService';
import { CompanyController }          from '../api/controller/CompanyController';
import { CacheController }            from '../api/controller/customer/CacheController';
import { CustomerCompanyController }  from '../api/controller/customer/CustomerCompanyController';
import { CustomerDealController }     from '../api/controller/customer/CustomerDealController';
import { CustomerMarketController }   from '../api/controller/customer/CustomerMarketController';
// eslint-disable-next-line @typescript-eslint/tslint/config
import { DashboardContactController } from '../api/controller/dashboard/DashboardContactController';
import { DashboardDealController }    from '../api/controller/dashboard/DashboardDealController';
import { DealAccountController }      from '../api/controller/DealAccountController';
import { HubAdminController }         from '../api/controller/hub/HubAdminController';
import { HubCompanyController }       from '../api/controller/hub/HubCompanyController';
import { HubDealAccountController }   from '../api/controller/hub/HubDealAccountController';
import { HubDealController }          from '../api/controller/hub/HubDealController';
import { HubUserController }          from '../api/controller/hub/HubUserController';
import { UserController }             from '../api/controller/UserController';
import { InstallRoutes }              from '../api/routing/installRoutes';
import { RouteHandler }               from '../api/routing/routeHandler';
import {
  CacheBreakService,
  ICacheBreakService,
}                                     from '../cache/CacheBreakService';
import { FakeCacheService }           from '../cache/FakeCacheService';
import { ICacheService }              from '../cache/ICacheService';
import { MemoryCacheService }         from '../cache/MemoryCacheService';
import { noop }                       from '../common/constants';
import { CompanyFacade }              from '../datastore/CompanyFacade';
import { DealAccountFacade }          from '../datastore/DealAccountFacade';
import { DealFacade }                 from '../datastore/DealFacade';
import { ICompanyFacade }             from '../datastore/ICompanyFacade';
import { IDealAccountFacade }         from '../datastore/IDealAccountFacade';
import { IDealFacade }                from '../datastore/IDealFacade';
import { IMarketFacade }              from '../datastore/IMarketFacade';
import { IUserFacade }                from '../datastore/IUserFacade';
import { MarketFacade }               from '../datastore/MarketFacade';
import { UserFacade }                 from '../datastore/UserFacade';
import { Company }                    from '../ddd/entities/Company';
import { Deal }                       from '../ddd/entities/Deal';
import { DealAccount }                from '../ddd/entities/DealAccount';
import { Mail }                       from '../ddd/entities/Mail';
import { User }                       from '../ddd/entities/User';
import { CompanyFactory }             from '../ddd/factories/CompanyFactory';
import { DealAccountFactory }         from '../ddd/factories/DealAccountFactory';
import { DealFactory }                from '../ddd/factories/DealFactory';
import { MailFactory }                from '../ddd/factories/MailFactory';
import { UserFactory }                from '../ddd/factories/UserFactory';
import { CompanyRepository }          from '../ddd/repository/CompanyRepository';
import { DealAccountRepository }      from '../ddd/repository/DealAccountRepository';
import { DealRepository }             from '../ddd/repository/DealRepository';
import { UserRepository }             from '../ddd/repository/UserRepository';
import { CustomerSearchService }      from '../ddd/services/CustomerSearchService';
import { DealAccountService }         from '../ddd/services/DealAccountService';
import { DealService }                from '../ddd/services/DealService';
import { IDealAccountService }        from '../ddd/services/IDealAccountService';
import { IDealService }               from '../ddd/services/IDealService';
import { IUserAccountService }        from '../ddd/services/IUserAccountService';
import { UserAccountService }         from '../ddd/services/UserAccountService';
import { ApiType }                    from '../enum/ApiType';
import {
  CloudStorageService,
  ICloudStorageService,
}                                     from '../infrastructure/cloud/CloudStorageService';
import {
  Auth0ManagementService,
  IAuth0ManagementService,
}                                     from '../infrastructure/external/Auth0ManagementService';
import {
  IMailChimpFacade,
  MailChimpFacade,
}                                     from '../infrastructure/external/MailChimpFacade';
import {
  GeoCodingService,
  IGeoCodingService,
}                                     from '../infrastructure/geoLocation/GeoCodingService';
import {
  IImageConvertService,
  ImageConvertService,
}                                     from '../infrastructure/image/ImageConvertService';
import {
  ISitemapService,
  SitemapService,
}                                     from '../infrastructure/meta/SitemapService';
import {
  ITaskService,
  TaskService,
}                                     from '../infrastructure/task/TaskService';
import { getEnvironmentVariable }     from '../utils/environmentVariables';
import { keys }                       from './inversify.keys';

export const container = new Container();

const hubApiConfigModule = new ContainerModule(
  (bind: interfaces.Bind, unbind, isBound, rebind): void => {
    bind(keys.Controller)
      .to(CompanyController)
      .inSingletonScope();
    bind(keys.Controller)
      .to(HubCompanyController)
      .inSingletonScope();
    bind(keys.Controller)
      .to(HubUserController)
      .inSingletonScope();
    bind(keys.Controller)
      .to(HubDealController)
      .inSingletonScope();
    bind(keys.Controller)
      .to(HubDealAccountController)
      .inSingletonScope();
    bind(keys.Controller)
      .to(HubAdminController)
      .inSingletonScope();

    bind(keys.ISitemapService)
      .to(SitemapService)
      .inSingletonScope();

    bind(keys.ITaskService)
      .to(TaskService)
      .inSingletonScope();

    rebind(keys.InitFn).toFunction(() => {
      container.get<ISitemapService>(keys.ISitemapService).init();
      container.get<ITaskService>(keys.ITaskService).init();
    });

    // comment in to run queries
    bind(TestDb).toSelf();
    bind(TestQuery).toSelf();
  },
);

const dashboardApiConfigModule = new ContainerModule(
  (): void => {
    container
      .bind(keys.Controller)
      .to(CompanyController)
      .inSingletonScope();
    container
      .bind(keys.Controller)
      .to(DashboardDealController)
      .inSingletonScope();
    container
      .bind(keys.Controller)
      .to(DashboardContactController)
      .inSingletonScope();
    container
      .bind(keys.Controller)
      .to(DealAccountController)
      .inSingletonScope();
    container
      .bind(keys.ITaskService)
      .to(TaskService)
      .inSingletonScope();

    container.rebind(keys.InitFn).toFunction(() => {
      container.get<ITaskService>(keys.ITaskService).init();
    });

  },
);

const customerApiConfigModule = new ContainerModule((
                                                      bind: interfaces.Bind, unbind, isBound, rebind,
                                                    ): void => {
  container
    .bind(keys.Controller)
    .to(CustomerCompanyController)
    .inSingletonScope();
  container
    .bind(keys.Controller)
    .to(CustomerDealController)
    .inSingletonScope();
  container
    .bind(keys.Controller)
    .to(CustomerMarketController)
    .inSingletonScope();
  container
    .bind(keys.Controller)
    .to(CacheController)
    .inSingletonScope();
/*
  // Activate cache for customer app
  rebind<ICacheService<any>>(keys.ICacheService)
    .to(MemoryCacheService)
    .inSingletonScope();

  const cacheService = container.get<ICacheService<any>>(keys.ICacheService);
  setInterval(() => {
    cacheService.clearAll().catch((error) => {
      console.error('Error while cleaning cache', error);
    });
  }, TimeInMs.ONE_MINUTE * 5);
*/
});

const environmentConfigModule = new ContainerModule((bind: interfaces.Bind): void => {
  bind(keys.IsProduction).toConstantValue(
    getEnvironmentVariable('NODE_ENV') === 'production',
  );
  bind(keys.GoogleCloudProjectId).toConstantValue(
    getEnvironmentVariable('GOOGLE_CLOUD_PROJECT_ID'),
  );
  bind(keys.GoogleCloudAppCredentialsPath).toConstantValue(
    getEnvironmentVariable('GOOGLE_APPLICATION_CREDENTIALS'),
  );
  bind(keys.ApiType).toConstantValue(getEnvironmentVariable('API_TYPE'));
  bind(keys.ApiPort).toConstantValue(getEnvironmentVariable('API_PORT'));
  bind(keys.BaseUrl).toConstantValue(getEnvironmentVariable('BASE_URL'));
});

export function setup(applicationRoot: string): Container {
  container.bind(keys.Container).toConstantValue(container);

  container.bind(keys.InitFn).toFunction(noop);

  container.bind(keys.ApplicationRoot).toConstantValue(applicationRoot);
  container.load(environmentConfigModule);
  const apiMode = container.get<ApiType>(keys.ApiType);
  // eslint-disable-next-line no-console
  console.log('Starting API in mode: %o', ApiType[apiMode], apiMode);

  // comment in to run queries
  //container.bind(TestDb).toSelf();
  //container.bind(TestQuery).toSelf();

  container.bind(keys.Controller)
    .to(UserController)
    .inSingletonScope();

  container
    .bind<IUserFacade>(keys.IUserFacade)
    .to(UserFacade)
    .inSingletonScope();
  container
    .bind(keys.IUserRepository)
    .to(UserRepository)
    .inSingletonScope();
  container
    .bind(keys.IUserFactory)
    .to(UserFactory)
    .inSingletonScope();
  container
    .bind<User>(User)
    .toSelf()
    .inTransientScope();

  container
    .bind<IMarketFacade>(keys.IMarketFacade)
    .to(MarketFacade)
    .inSingletonScope();

  container
    .bind<ICompanyFacade>(keys.ICompanyFacade)
    .to(CompanyFacade)
    .inSingletonScope();
  container
    .bind(keys.ICompanyRepository)
    .to(CompanyRepository)
    .inSingletonScope();
  container
    .bind(keys.ICompanyFactory)
    .to(CompanyFactory)
    .inSingletonScope();
  container
    .bind<Company>(Company)
    .toSelf()
    .inTransientScope();

  container
    .bind(keys.IDealRepository)
    .to(DealRepository)
    .inSingletonScope();
  container
    .bind(keys.IDealFactory)
    .to(DealFactory)
    .inSingletonScope();
  container
    .bind<Deal>(Deal)
    .toSelf()
    .inTransientScope();
  container
    .bind<IDealFacade>(keys.IDealFacade)
    .to(DealFacade)
    .inSingletonScope();

  container
    .bind<IDealAccountFacade>(keys.IDealAccountFacade)
    .to(DealAccountFacade)
    .inSingletonScope();
  container
    .bind(keys.IDealAccountRepository)
    .to(DealAccountRepository)
    .inSingletonScope();
  container
    .bind<DealAccountRepository>(DealAccountRepository)
    .to(DealAccountRepository)
    .inSingletonScope();
  container
    .bind(keys.IDealAccountFactory)
    .to(DealAccountFactory)
    .inSingletonScope();
  container
    .bind<DealAccount>(DealAccount)
    .toSelf()
    .inTransientScope();
  container
    .bind<DealAccountFacade>(DealAccountFacade)
    .toSelf()
    .inTransientScope();

  container
    .bind(keys.IMailFactory)
    .to(MailFactory)
    .inSingletonScope();
  container
    .bind<Mail>(keys.IMail)
    .to(Mail)
    .inTransientScope();

  // Services
  container
    .bind<IUserAccountService>(keys.IUserAccountService)
    .to(UserAccountService)
    .inSingletonScope();
  container
    .bind<CustomerSearchService>(keys.ICustomerSearchService)
    .to(CustomerSearchService)
    .inSingletonScope();
  container
    .bind<IDealAccountService>(keys.IDealAccountService)
    .to(DealAccountService)
    .inTransientScope();
  container
    .bind<IDealService>(keys.IDealService)
    .to(DealService)
    .inTransientScope();

  // Infrastructure
  container
    .bind<IImageConvertService>(keys.IImageConvertService)
    .to(ImageConvertService)
    .inSingletonScope();
  container
    .bind<ICloudStorageService>(keys.ICloudStorageService)
    .to(CloudStorageService)
    .inSingletonScope();
  container
    .bind<ICacheBreakService>(keys.ICacheBreakService)
    .to(CacheBreakService)
    .inSingletonScope();
  container
    .bind<ICacheService<any>>(keys.ICacheService)
    .to(FakeCacheService)
    .inSingletonScope();
  container
    .bind<ICacheService<any>>(keys.IGeoCodeCacheService)
    .to(MemoryCacheService)
    .inSingletonScope();
  container
    .bind<ICacheService<any>>(keys.IHashCacheService)
    .to(MemoryCacheService)
    .inSingletonScope();
  container
    .bind<IGeoCodingService>(keys.IGeoCodingService)
    .to(GeoCodingService)
    .inSingletonScope();
  container
    .bind<IJwtTokenService>(keys.IJwtTokenService)
    .to(JwtTokenService)
    .inSingletonScope();
  container
    .bind<IAuthenticationService>(keys.IAuthenticationService)
    .to(AuthenticationService)
    .inSingletonScope();
  container
    .bind<IAuth0ManagementService>(keys.IAuth0ManagementService)
    .to(Auth0ManagementService)
    .inSingletonScope();
  container
    .bind<IMailChimpFacade>(keys.IMailChimpFacade)
    .to(MailChimpFacade)
    .inSingletonScope();

  container
    .bind(InstallRoutes)
    .toSelf()
    .inSingletonScope();
  container
    .bind(RouteHandler)
    .toSelf()
    .inSingletonScope();

  if (apiMode === ApiType.HUB) {
    container.load(hubApiConfigModule);
  }

  if (apiMode === ApiType.DASHBOARD) {
    container.load(dashboardApiConfigModule);
  }

  if (apiMode === ApiType.CUSTOMER) {
    container.load(customerApiConfigModule);
  }

  return container;
}

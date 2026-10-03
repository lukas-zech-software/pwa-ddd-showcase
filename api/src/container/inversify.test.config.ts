import { Auth0ManagementServiceMock } from '../../test/mocks/Auth0ManagementServiceMock';
import { FactoryMock }                from '../../test/mocks/BaseFactoryMock';
import { CompanyFacadeMock }          from '../../test/mocks/CompanyFacadeMock';
import { CompanyRepositoryMock }      from '../../test/mocks/CompanyRepositoryMock';
import { DealAccountFacadeMock }      from '../../test/mocks/DealAccountFacadeMock';
import { DealAccountRepositoryMock }  from '../../test/mocks/DealAccountRepositoryMock';
import { DealAccountServiceMock }     from '../../test/mocks/DealAccountServiceMock';
import { DealFacadeMock }             from '../../test/mocks/DealFacadeMock';
import { DealServiceMock }            from '../../test/mocks/DealServiceMock';
import { GeoCodingServiceMock }       from '../../test/mocks/GeoCodingServiceMock';
import { MailChimpFacadeMock }        from '../../test/mocks/MailChimpFacadeMock';
import { MailMock }                   from '../../test/mocks/MailMock';
import { UserAccountServiceMock }     from '../../test/mocks/UserAccountServiceMock';
import { UserFacadeMock }             from '../../test/mocks/UserFacadeMock';
import { FakeCacheService }           from '../cache/FakeCacheService';
import { ICacheService }              from '../cache/ICacheService';
import { ICompanyFacade }             from '../datastore/ICompanyFacade';
import { IDealAccountFacade }         from '../datastore/IDealAccountFacade';
import { IDealFacade }                from '../datastore/IDealFacade';
import { IUserFacade }                from '../datastore/IUserFacade';
import { Company }                    from '../ddd/entities/Company';
import { IDealAccountRepository }     from '../ddd/repository/IDealAccountRepository';
import { IRepository }                from '../ddd/repository/IRepository';
import { IDealAccountService }        from '../ddd/services/IDealAccountService';
import { IDealService }               from '../ddd/services/IDealService';
import { IUserAccountService }        from '../ddd/services/IUserAccountService';
import { IAuth0ManagementService }    from '../infrastructure/external/Auth0ManagementService';
import { IMailChimpFacade }           from '../infrastructure/external/MailChimpFacade';
import { IGeoCodingService }          from '../infrastructure/geoLocation/GeoCodingService';
import { container }                  from './inversify.config';
import { keys }                       from './inversify.keys';

export function testSetup(): void {
  container
    .rebind<IUserFacade>(keys.IUserFacade)
    .toConstantValue(new UserFacadeMock());

  container
    .rebind<ICompanyFacade>(keys.ICompanyFacade)
    .toConstantValue(new CompanyFacadeMock());

  container
    .rebind<IDealFacade>(keys.IDealFacade)
    .toConstantValue(new DealFacadeMock());

  container
    .rebind<IDealAccountFacade>(keys.IDealAccountFacade)
    .toConstantValue(new DealAccountFacadeMock());

  // Repos
  container
    .rebind<IDealAccountRepository>(keys.IDealAccountRepository)
    .toConstantValue(new DealAccountRepositoryMock());
  container
    .rebind<IRepository<Company>>(keys.ICompanyRepository)
    .toConstantValue(new CompanyRepositoryMock());

  container.rebind(keys.IMailFactory).toConstantValue(new FactoryMock());
  container.rebind(keys.IMail).toConstantValue(new MailMock());

  // Services
  container
    .rebind<IUserAccountService>(keys.IUserAccountService)
    .toConstantValue(new UserAccountServiceMock());
  container
    .rebind<ICacheService<any>>(keys.ICacheService)
    .toConstantValue(new FakeCacheService());
  container
    .rebind<IGeoCodingService>(keys.IGeoCodingService)
    .toConstantValue(new GeoCodingServiceMock());
  container
    .rebind<IAuth0ManagementService>(keys.IAuth0ManagementService)
    .toConstantValue(new Auth0ManagementServiceMock());
  container
    .rebind<IMailChimpFacade>(keys.IMailChimpFacade)
    .toConstantValue(new MailChimpFacadeMock());
  container
    .rebind<IDealAccountService>(keys.IDealAccountService)
    .toConstantValue(new DealAccountServiceMock());
  container
    .rebind<IDealService>(keys.IDealService)
    .toConstantValue(new DealServiceMock());
}

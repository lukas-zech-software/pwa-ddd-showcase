import {
  IApiCompany,
  IApiCompanyContact,
  IApiCompanyCorona,
  IApiCompanyDetails,
  IApiCompanyDishes,
  IApiCompanyImages,
  IApiCompanyOptionalInfo,
  IApiRegistrationInfo,
  ICompanyUrlContext,
}                                                   from '@my-old-startup/common/interfaces';
import {
  inject,
  injectable,
}                                                   from 'inversify';
import { ErrorCode }                                from '../../../../common/error/ErrorCode';
import { COMPANY_ROUTES }                           from '../../../../common/routes/ApiRoutes';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_LOGO,
}                                                   from '../../../../common/routes/default_urls';
import {
  ApiCompanyContact,
  ApiCompanyCorona,
  ApiCompanyDetails,
  ApiCompanyImages,
  ApiRegistrationInfo,
}                                                   from '../../../../common/validation';
import { CompanyAdapter }                           from '../../adapter/CompanyAdapter';
import { UserAdapter }                              from '../../adapter/UserAdapter';
import { ApiError }                                 from '../../common/ApiError';
import { keys }                                     from '../../container/inversify.keys';
import { CompanyFactory }                           from '../../ddd/factories/CompanyFactory';
import { CompanyRepository }                        from '../../ddd/repository/CompanyRepository';
import { AccessLevel }                              from '../../enum/AccessLevel';
import { ICloudStorageService }                     from '../../infrastructure/cloud/CloudStorageService';
import { throwIfCurrentUserDoesNotBelongToCompany } from '../../utils/EntityUtils';
import { IAuthInfo }                                from '../interfaces/ISessionData';
import {
  ControllerResult,
  Get,
  IWebRouteHandlerInput,
  Post,
  Upload,
}                                                   from '../routing/webRouteDecorator';

export type ICompanyContract = {
  get(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
  ): ControllerResult<IApiCompany>;

  register(
    input: IWebRouteHandlerInput<IApiRegistrationInfo, ICompanyUrlContext>,
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    ...params: any[],
  ): ControllerResult<void>;
};

@injectable()
export class CompanyController implements ICompanyContract {
  @inject(keys.ICompanyRepository)
  private companyRepository: CompanyRepository;

  @inject(keys.ICompanyFactory)
  private companyFactory: CompanyFactory;

  @inject(keys.ICloudStorageService)
  private cloudStorageService: ICloudStorageService;

  @Get(COMPANY_ROUTES.get, AccessLevel.USER)
  public async get(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
  ): ControllerResult<IApiCompany> {
    const company = await this.companyRepository.findById(input.url.companyId);

    return {
      body: CompanyAdapter.entityToApi(company),
    };
  }

  @Get(COMPANY_ROUTES.own, AccessLevel.USER)
  public async getForOwner(
    input: IWebRouteHandlerInput,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiCompany[]> {
    const companies = await this.companyRepository.findByOwner(
      authInfo.authUser.authId,
    );

    return {
      body: companies.map((c) => CompanyAdapter.entityToApi(c)),
    };
  }

  @Post(COMPANY_ROUTES.register, AccessLevel.USER, {
    bodyModel: ApiRegistrationInfo,
  })
  public async register(
    input: IWebRouteHandlerInput<IApiRegistrationInfo, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const userContact = UserAdapter.apiContactToEntity(input.body.user);

    const company = await this.companyFactory.create();

    const companyContact = CompanyAdapter.apiContactToEntity(input.body.companyContact);
    await company.register(
      companyContact,
      authInfo.authUser.authId,
      userContact,
      input.body.companyContact.hasSubscribedToNewsletter,
    );

    if (input.body.companyDetails) {
      const companyDetails = CompanyAdapter.apiDetailsToEntity(input.body.companyDetails);
      company.setData(companyDetails);
    }

    if (input.body.companyCorona) {
      const companyCorona = CompanyAdapter.apiCoronaToEntity(input.body.companyCorona);
      company.setData(companyCorona);
    }
    return company.update();
  }

  @Post(COMPANY_ROUTES.updateContact, AccessLevel.COMPANY, {
    bodyModel: ApiCompanyContact,
  })
  public async updateContact(
    input: IWebRouteHandlerInput<IApiCompanyContact, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);
    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    if (
      company.isApproved === true &&
      authInfo.authUser.accessLevel !== AccessLevel.BACKOFFICE
    ) {
      // TODO: This is a BusinessError and should be thrown in the model
      throw new ApiError(
        'Approved company may not be updated',
        ErrorCode.WEB_SERVER_INSUFFICIENT_PERMISSIONS,
      );
    }

    company.setData(CompanyAdapter.apiContactToEntity(input.body));

    await company.updateGeoHash();
    await company.update();
  }

  @Post(COMPANY_ROUTES.updateDetails, AccessLevel.COMPANY, {
    bodyModel: ApiCompanyDetails,
  })
  public async updateDetails(
    input: IWebRouteHandlerInput<IApiCompanyDetails, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);

    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    company.setData(CompanyAdapter.apiDetailsToEntity(input.body));

    await company.update();
  }
  @Post(COMPANY_ROUTES.updateCorona, AccessLevel.COMPANY, {
    bodyModel: ApiCompanyCorona,
  })
  public async updateCorona(
    input: IWebRouteHandlerInput<IApiCompanyCorona, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);

    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    company.setData(CompanyAdapter.apiCoronaToEntity(input.body));

    if (company.openRestrictions && company.openRestrictions.reservationsLink) {
      company.reservationsLink = company.openRestrictions.reservationsLink;
    }

    await company.update();
  }


  @Post(COMPANY_ROUTES.updateImages, AccessLevel.COMPANY, {
    bodyModel: ApiCompanyImages,
  })
  public async updateImages(
    input: IWebRouteHandlerInput<IApiCompanyImages, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);

    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    company.setData(CompanyAdapter.apiImagesToEntity(input.body));

    await company.update();
  }

  @Post(COMPANY_ROUTES.restoreMenuDocument, AccessLevel.COMPANY)
  public async restoreMenuDocument(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);

    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    company.menuDocument = undefined;

    await company.update();
  }

  @Post(COMPANY_ROUTES.restoreLogo, AccessLevel.COMPANY)
  public async restoreLogo(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);

    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    company.logo = DEFAULT_LOGO;

    await company.update();
  }

  @Post(COMPANY_ROUTES.restoreImage, AccessLevel.COMPANY)
  public async restoreBackground(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);

    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    company.background = DEFAULT_BACKGROUND;

    await company.update();
  }

  @Upload(
    COMPANY_ROUTES.uploadImages,
    AccessLevel.COMPANY,
    {},
    { uploadOptions: { uploadFormFields: ['background', 'logo'] } },
  )
  public async uploadImages(
    input: IWebRouteHandlerInput<IApiCompanyImages, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiCompanyImages> {
    const company = await this.companyRepository.findById(input.url.companyId);

    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    try {
      for (const file of input.files) {
        if (file.name === 'logo') {
          await company.updateLogo(file.path);
        }
        if (file.name === 'background') {
          await company.updateBackground(file.path);
        }
      }

      await company.update();

      return {
        body:{
          background:company.background,
          logo:company.logo,
          menuDocument:company.menuDocument,
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Could not update company images: [%o]', error);
      return {
        status: 500,
      };
    }
  }

  @Upload(
    COMPANY_ROUTES.updateMenuDocument,
    AccessLevel.COMPANY,
    {},
    { uploadOptions: { uploadFormFields: ['menuDocument'] } },
  )
  public async updateMenuDocument(
    input: IWebRouteHandlerInput<{ fileType: string }, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<void> {
    const company = await this.companyRepository.findById(input.url.companyId);

    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    try {
      const doc = input.files[0];
      await company.updateMenuDocument(doc.path, input.body.fileType);

      await company.update();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Could not update company images: [%o]', error);
      return {
        status: 500,
      };
    }
  }

  @Post(COMPANY_ROUTES.updateOptional, AccessLevel.COMPANY)
  public async updateOptionalInfo(
    input: IWebRouteHandlerInput<IApiCompanyOptionalInfo, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiCompany> {
    const company = await this.companyRepository.findById(input.url.companyId);

    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    company.setData(CompanyAdapter.apiOptionalToEntity(input.body));

    await company.update();

    return {
      body: CompanyAdapter.entityToApi(company),
    };
  }

  @Post(COMPANY_ROUTES.updateDishes, AccessLevel.COMPANY)
  public async updateDishes(
    input: IWebRouteHandlerInput<IApiCompanyDishes, ICompanyUrlContext>,
    authInfo: IAuthInfo,
  ): ControllerResult<IApiCompany> {
    const company = await this.companyRepository.findById(input.url.companyId);

    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    company.updateDishes(input.body.dishes);

    await company.update();

    return {
      body: CompanyAdapter.entityToApi(company),
    };
  }

  @Get(COMPANY_ROUTES.historyImages, AccessLevel.COMPANY)
  public async getHistoryImages(
    input: IWebRouteHandlerInput<void, ICompanyUrlContext>, authInfo: IAuthInfo,
  ): ControllerResult<string[]> {
    const company = await this.companyRepository.findById(input.url.companyId);

    throwIfCurrentUserDoesNotBelongToCompany(authInfo, company);

    const myImagesPath = `company/${company.id}/images`;
    const myImages = await this.cloudStorageService.getFilenamesInFolder(myImagesPath,true);

    return {
      body: myImages,
    };
  }

  @Get(COMPANY_ROUTES.stockImages, AccessLevel.USER)
  public async getStockImages(): ControllerResult<string[]> {
    const stockImagesPath = 'company/0/deals';
    const stockImages     = await this.cloudStorageService.getFilenamesInFolder(
      stockImagesPath,
    );
    return {
      body: stockImages,
    };
  }
}

import {
  CompanyType,
  DealTags,
}                                  from '@my-old-startup/common/enums';
import {
  COMPANY_BACKGROUND_CONFIG,
  COMPANY_LOGO_CONFIG,
  Dish,
  OpeningHoursWeek,
  OpenRestrictions,
}                                  from '@my-old-startup/common/interfaces';
import { urlSafe }                 from '@my-old-startup/common/utils/UrlUtils';
import { injectable }              from 'inversify';
import * as mailgun                from 'mailgun-js';
import { ErrorCode }               from '../../../../common/error/ErrorCode';
import {
  DEFAULT_BACKGROUND,
  DEFAULT_LOGO,
}                                  from '../../../../common/routes/default_urls';
import { ICacheBreakService }      from '../../cache/CacheBreakService';
import { ICacheService }           from '../../cache/ICacheService';
import { ApiError }                from '../../common/ApiError';
import { keys }                    from '../../container/inversify.keys';
import { ICompanyFacade }          from '../../datastore/ICompanyFacade';
import { IUserFacade }             from '../../datastore/IUserFacade';
import { ICloudStorageService }    from '../../infrastructure/cloud/CloudStorageService';
import { IAuth0ManagementService } from '../../infrastructure/external/Auth0ManagementService';
import { IMailChimpFacade }        from '../../infrastructure/external/MailChimpFacade';
import { IGeoCodingService }       from '../../infrastructure/geoLocation/GeoCodingService';
import { IImageConvertService }    from '../../infrastructure/image/ImageConvertService';
import { BusinessError }           from '../common/BusinessError';
import { BusinessErrorCode }       from '../common/BusinessErrorCode';
import { DealFactory }             from '../factories/DealFactory';
import { MailFactory }             from '../factories/MailFactory';
import {
  ICompany,
  ICompanyContact,
  ICompanyCorona,
  ICompanyDetails,
  ICompanyImages,
  ICompanyInstance,
  ICompanyOptionalInfo,
  IDeal,
  IPublicCompany,
  IUserContact,
}                                  from '../interfaces';
import { IDealRepository }         from '../repository/IDealRepository';
import { IDealAccountService }     from '../services/IDealAccountService';
import { IUserAccountService }     from '../services/IUserAccountService';
import { injectNotEnumerable }     from '../utils/objectUtils';
import { Deal }                    from './Deal';

// BUSINESS LOGIC HERE

@injectable()
export class Company implements ICompanyInstance {
  public id: string;
  public created: number;
  public updated: number;
  public address: string;
  public city: string;
  public description: string;
  public facebook?: string;
  public instagram?: string;
  public twitter?: string;
  public reservationsLink?: string;
  public email: string;
  public type: CompanyType;
  public geoHash: string;
  public background: string;
  public logo: string;
  public hasAcceptedTerms: boolean;
  public hasSubscribedToNewsletter: boolean;
  public isApproved: boolean;
  public isBlocked: boolean;
  public isFirstLogin: boolean;
  public lat: number;
  public lng: number;
  public openingHours: OpeningHoursWeek;
  public prefersReservations: boolean;
  public tags?: DealTags[];
  public telephone: string;
  public secondaryTelephone: string | undefined;
  public secondaryTelephoneReason: string | undefined;
  public title: string;
  public website: string;
  public menuDocument: string | undefined;
  public zipCode: string;
  public dishes: Dish[] | undefined;
  public readonly owners: string[];

  //CORONA
  offersReopen: boolean;
  reopenDescription?: string | undefined;
  offersDelivery: boolean;
  deliveryDescription?: string | undefined;
  offersTakeAway: boolean;
  takeAwayDescription?: string | undefined;
  offersCoupons: boolean;
  couponsDescription?: string | undefined;
  acceptsDonations: boolean;
  donationsDescription?: string | undefined;
  openRestrictions?: OpenRestrictions;
  //CORONA

  @injectNotEnumerable(keys.BaseUrl) private baseUrl: string;
  @injectNotEnumerable(keys.ICompanyFacade)
  private companyFacade: ICompanyFacade;
  @injectNotEnumerable(keys.ICacheBreakService)
  private cacheBreakService: ICacheBreakService;
  @injectNotEnumerable(keys.ICacheService)
  private cacheService: ICacheService<any>;
  @injectNotEnumerable(keys.IMailFactory) private mailFactory: MailFactory;
  @injectNotEnumerable(keys.IDealRepository)
  private dealRepository: IDealRepository;
  @injectNotEnumerable(keys.IDealFactory) private dealFactory: DealFactory;
  @injectNotEnumerable(keys.IUserFacade) private userFacade: IUserFacade;

  @injectNotEnumerable(keys.IGeoCodingService)
  private geoCodingService: IGeoCodingService;
  @injectNotEnumerable(keys.IImageConvertService)
  private imageConvertService: IImageConvertService;
  @injectNotEnumerable(keys.ICloudStorageService)
  private cloudStorageService: ICloudStorageService;
  @injectNotEnumerable(keys.IAuth0ManagementService)
  private auth0ManagementService: IAuth0ManagementService;
  @injectNotEnumerable(keys.IMailChimpFacade)
  private mailChimpFacade: IMailChimpFacade;
  @injectNotEnumerable(keys.IUserAccountService)
  private userAccountService: IUserAccountService;
  @injectNotEnumerable(keys.IDealAccountService)
  private dealAccountService: IDealAccountService;

  private constructor() {
    // defaults
    this.updated                   = Date.now();
    this.created                   = Date.now();
    this.isApproved                = false;
    this.isBlocked                 = false;
    this.hasAcceptedTerms          = false;
    this.hasSubscribedToNewsletter = false;
    this.isFirstLogin              = true;
    this.owners                    = [];
    this.prefersReservations       = false;

    this.logo       = DEFAULT_LOGO;
    this.background = DEFAULT_BACKGROUND;
  }

  private async getCompanyApplicationAttachments(): Promise<Array<mailgun.IAttachmentOptions>> {

    let cached = await this.cacheService.get(
      'PDF_ATTACHMENTS',
      'COMPANY_FILES_',
    );

    if (cached === undefined) {
      const agbBuffer         = await this.cloudStorageService.getPdf('AGB.pdf'),
            datenschutzBuffer = await this.cloudStorageService.getPdf('Datenschutz.pdf');

      cached = [
        {
          filename:    'AGB.pdf',
          contentType: 'application/pdf',
          data:        agbBuffer,
        },
        {
          filename:    'Datenschutz.pdf',
          contentType: 'application/pdf',
          data:        datenschutzBuffer,
        },
      ];

      await this.cacheService.set('PDF_ATTACHMENTS', cached, 'COMPANY_FILES_');
    }

    return cached;
  }

  /**
   * Register this company to be approved
   *
   * @param inputCompany The registration data for the company
   * @param authUserId The user who registers this company
   * @param userContact The contact info provided in the registration form
   * @param hasSubscribedToNewsletter boolean Flag wether the user wants to signup for the news letter or not
   */
  public async register(
    inputCompany: ICompanyContact,
    authUserId: string,
    userContact: IUserContact,
    hasSubscribedToNewsletter: boolean,
  ): Promise<void> {
    // fixme: this test only new instance
    if (this.isApproved === true) {
      throw new BusinessError(
        'Company is already approved and cannot register again',
        BusinessErrorCode.COMPANY_ALREADY_APPROVED,
      );
    }

    if (this.isBlocked === true) {
      throw new BusinessError(
        'Company is blocked and cannot register again',
        BusinessErrorCode.COMPANY_BLOCKED,
      );
    }

    this.setData(inputCompany);

    const possibleDoublet = await this.companyFacade.tryFindDoublets(this);
    if (possibleDoublet !== undefined) {
      throw new ApiError(
        'Company already exists',
        ErrorCode.WEB_SERVER_DUPLICATE_COMPANY,
      );
    }

    const updatedUser = await this.userAccountService.updateContactData(
      authUserId,
      userContact,
    );

    await this.updateGeoHash();

    this.addOwner(authUserId);

    await this.auth0ManagementService.updateCompanyUser(authUserId);

    if (hasSubscribedToNewsletter) {
      this.mailChimpFacade.register(userContact).catch((e) => {
        // Error in MailChimp should not block our signup
        // eslint-disable-next-line no-console
        console.error(e);
      });
      this.hasSubscribedToNewsletter = true;
    }

    await this.create();

    const registrationMail = await this.mailFactory.create(
      {
        template: 'register/company_application',
        from:     'anmeldung@my-old-startups-domain.de',
        to:       updatedUser.contactEmail,
        data:     { company: this },
      },
    );
    await registrationMail.send();

    const registrationHubMail = await this.mailFactory.create(
      {
        template: 'hub/company_application',
        from:     'partner@my-old-startups-domain.de',
        to:       'anmeldung@my-old-startups-domain.de',
        data:     { company: this },
      },
    );
    await registrationHubMail.send();

    // CORONA
    void this.approve();
  }

  /**
   * Set contact, details, images or all properties provided on this instance
   *
   * @param {ICompanyContact} company
   * @return {Company}
   */
  public setData(company: ICompanyDetails): Company;
  public setData(company: ICompanyContact): Company;
  public setData(company: ICompanyOptionalInfo): Company;
  public setData(company: ICompanyImages): Company;
  public setData(company: ICompanyCorona): Company;
  public setData(company: ICompany): Company {
    Object.assign(this, company);

    return this;
  }

  /**
   * Get and update the geoHash for the current address of the company
   * @return {Promise<void>}
   */
  public async updateGeoHash(): Promise<void> {
    const {
            geoHash,
            coordinates,
            city,
          } = await this.geoCodingService.getLocationForAddress(
      this.address,
      this.zipCode,
    );

    if (city === undefined || coordinates === undefined) {
      throw new Error('No coordinates returned: ' + JSON.stringify(location));
    }

    this.city    = city;
    this.geoHash = geoHash;
    this.lat     = coordinates.lat;
    this.lng     = coordinates.lng;
  }

  /**
   * Upload a pdf for the menu and set the generated url
   * @param path The path to the temporary uploaded file
   * @param type
   */
  public async updateMenuDocument(path: string, type: string): Promise<void> {
    let newFileName = `/company/${this.id}/Menu_${urlSafe(
      this.title,
    )}_${Date.now()}`;

    if (type.includes('pdf')) {
      newFileName += '.pdf';
      await this.cloudStorageService.storeFile(
        newFileName,
        path,
        'application/pdf',
      );
    } else {
      const menuStream = this.imageConvertService.toPng(path);
      newFileName += '.png';
      await this.cloudStorageService.storeFileStream(
        newFileName,
        menuStream,
        'image/png',
      );
    }
    this.menuDocument = newFileName;
  }

  public updateDishes(dishes: Array<Dish> | undefined): void {
    this.dishes = dishes;
  }

  /**
   * Upload and reformat the new images,
   * set the generated url and save the entity
   * @param path The path to the temporary uploaded file
   */
  public async updateLogo(path: string): Promise<void> {
    const logoStream = await this.imageConvertService.resizeImage(
      path,
      COMPANY_LOGO_CONFIG,
    );

    const newFileName = `/company/${this.id}/images/logo_${Date.now()}.jpg`;

    await this.cloudStorageService.storeFileStream(
      newFileName,
      logoStream,
      'image/jpeg',
    );

    this.logo = newFileName;
  }

  public async updateBackground(path: string): Promise<void> {
    const backgroundStream = await this.imageConvertService.resizeImage(
      path,
      COMPANY_BACKGROUND_CONFIG,
    );

    const newFileName = `/company/${this.id}/images/background_${Date.now()}.jpg`;

    await this.cloudStorageService.storeFileStream(
      newFileName,
      backgroundStream,
      'image/jpeg',
    );

    this.background = newFileName;
  }

  /**
   * Create a new company the current state of the instance
   * @return {Promise<void>}
   */
  public async create(): Promise<void> {
    const newCompany = await this.companyFacade.create(this);
    this.setData(newCompany);
  }

  /**
   * Update the current state of the company
   * @return {Promise<void>}
   */
  public async update(): Promise<void> {
    const updatedCompany = await this.companyFacade.update(this);
    this.cacheBreakService.clearCompany(this.id).catch((e) => {
      console.error('Error while clearing cache for company', this.id, e);
    });
    this.setData(updatedCompany);
  }

  /**
   * Delete the company
   * @return {Promise<void>}
   */
  public async delete(): Promise<void> {
    return this.companyFacade.remove(this.id);
  }

  /**
   * Approve the company
   * @return {Promise<void>}
   */
  public async approve(): Promise<void> {
    if (this.isApproved === true) {
      throw new BusinessError(
        'Company is already approved and cannot register again',
        BusinessErrorCode.COMPANY_ALREADY_APPROVED,
      );
    }

    this.isApproved = true;

    await this.update();

    const owner      = this.owners[0];
    const user       = await this.userFacade.getByAuthId(owner);
    let contactEmail = user.contactEmail;

    if (contactEmail === undefined || contactEmail === '') {
      // eslint-disable-next-line no-console
      console.warn(
        `unable to find contact email for ${owner} in the database, falling back to the Company's public email address`,
      );
      contactEmail = this.email;
    }

    const approvedMail = await this.mailFactory.create(
      {
        template: 'register/company_approved',
        to:       contactEmail,
        from:     'anmeldung@my-old-startups-domain.de',
        // FIXME:
        data:     { loginUrl: this.baseUrl.replace('hub.', 'dashboard.') },
      },
    );

    try {
      let attachments = await this.getCompanyApplicationAttachments();
      approvedMail.addAttachment(attachments[0]);
      approvedMail.addAttachment(attachments[1]);
    } catch (error) {
      console.error('Could not get approval attachments. Sending Mail without.', null, error);
    }

    await approvedMail.send();

    // When a company is approved, create a Deal Account so they can start publishing deals
    await this.dealAccountService.setDealsRemaining(this.id);
  }

  /**
   * Block the company
   * @return {Promise<void>}
   */
  public async block(): Promise<void> {
    this.isBlocked = true;
    await this.update();
  }

  /**
   * UnBlock the company
   * @return {Promise<void>}
   */
  public async unblock(): Promise<void> {
    this.isBlocked = false;
    await this.update();
  }

  /**
   * Add a company to this user is the owner of
   * @param {string} userAuthId
   * @return {Promise<void>}
   */
  public addOwner(userAuthId: string): void {
    const userAlreadyOwnsCompany = this.owners.some((x) => x === userAuthId);

    if (userAlreadyOwnsCompany) {
      throw new ApiError(
        'User already owns company',
        ErrorCode.WEB_SERVER_INVALID_USER_INPUT,
      );
    }

    this.owners.push(userAuthId);
  }

  public async removeOwner(userAuthId: string, force?: boolean): Promise<void> {
    if (this.owners.length === 1 && !force) {
      throw new ApiError(
        'Company must have at least one owner',
        ErrorCode.WEB_SERVER_INVALID_USER_INPUT,
      );
    }

    // If the user is the last owner of this company, delete this company as well
    if (force && this.owners.length === 1) {
      return this.delete();
    }

    const index = this.owners.findIndex((x) => x === userAuthId);

    if (index === -1) {
      throw new ApiError(
        'User is not owner of company',
        ErrorCode.WEB_SERVER_INVALID_USER_INPUT,
      );
    }

    this.owners.splice(index, 1);
  }

  public async addDeal(input: Partial<IDeal>): Promise<Deal> {
    const deal = await this.dealFactory.create();

    deal.setData(input);

    if (deal.location) {
      const result = await this.geoCodingService.getHashesForRadiusAroundCoordinates(deal.location, 0);
      deal.geoHash = result.hashes ? result.hashes[Math.ceil(result.hashes.length / 2) - 1] : '';
    }

    return deal.create(this.id);
  }

  public async getDeal(dealId: string): Promise<Deal> {
    return this.dealRepository.findById(dealId, this.id);
  }

  public async removeDeal(deal: Deal): Promise<void> {
    return this.dealRepository.remove(deal.id, this.id);
  }

  public getDeals(): Promise<Deal[]> {
    return this.dealRepository.getForCompany(this.id);
  }

  public static getCouponCode(company: IPublicCompany): string {
    return company.id.substring(0, 5).toUpperCase();
  }
}

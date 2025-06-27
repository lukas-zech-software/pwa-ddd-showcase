import {
  DayOfWeek,
  DealSpecialType,
  DealTags,
  DealType,
  isSpecialType,
} from '@my-old-startup/common/enums';
import {
  DEAL_IMAGE_CONFIG,
  DealImageUrl,
  GeoPoint,
  Monetary,
  Timestamp,
}                               from '@my-old-startup/common/interfaces';
import { injectable }           from 'inversify';
import { ErrorCode }            from '../../../../common/error/ErrorCode';
import { ApiError }             from '../../common/ApiError';
import { keys }                 from '../../container/inversify.keys';
import { ICompanyFacade }       from '../../datastore/ICompanyFacade';
import { IDealFacade }          from '../../datastore/IDealFacade';
import { ICloudStorageService } from '../../infrastructure/cloud/CloudStorageService';
import { IImageConvertService } from '../../infrastructure/image/ImageConvertService';
import { ITaskService }         from '../../infrastructure/task/TaskService';
import {
  IDeal,
  IDealInstance,
}                               from '../interfaces';
import { IDealAccountService }  from '../services/IDealAccountService';
import { injectNotEnumerable }  from '../utils/objectUtils';

/**
 * A deal may not be valid for longer than 24 hours
 */
const MAX_DEAL_TIME_LENGTH = 1000 * 60 * 60 * 24;

@injectable()
export class Deal implements IDealInstance {
  public id: string;
  public created: number;
  public updated: number;
  public published: number | null;
  public type: DealType;
  public specialType?: DealSpecialType;
  public isPublished: boolean | null;
  public isSpecial: boolean;
  public lastGenerated: number | undefined;
  public isStatic: boolean | undefined;
  public staticDays: DayOfWeek[] | undefined;
  public skipHolidays: boolean | undefined;
  public companyId: string;
  public description: string;
  public discountValue: Monetary;
  public image: DealImageUrl;
  public minimumPersonCount: number;
  public reservationRequired: boolean;
  public originalValue: Monetary;
  public title: string;
  public tags: DealTags[];
  public location?: GeoPoint;
  public address?: string;
  public geoHash?: string;
  public validFrom: Timestamp;
  public validTo: Timestamp;
  @injectNotEnumerable(keys.IDealFacade) private dealFacade: IDealFacade;
  @injectNotEnumerable(keys.ICompanyFacade)
  private companyFacade: ICompanyFacade;
  @injectNotEnumerable(keys.IDealAccountService)
  private dealAccountService: IDealAccountService;
  @injectNotEnumerable(keys.IImageConvertService)
  private imageConvertService: IImageConvertService;
  @injectNotEnumerable(keys.ICloudStorageService)
  private cloudStorageService: ICloudStorageService;
  @injectNotEnumerable(keys.ITaskService)
  private taskService: ITaskService;

  private constructor() {
    this.updated             = Date.now();
    this.created             = Date.now();
    this.published           = null;
    this.reservationRequired = false;
  }

  /**
   * Create a new deal for company
   *
   * @return {Promise<Deal>}
   */
  public async create(companyId: string): Promise<Deal> {
    this.throwIfDealTimeExceedsThreshold();

    this.companyId = companyId;
    const created  = await this.dealFacade.create(this, companyId);

    return created as Deal;
  }

  public setData(deal: Partial<IDeal>): Deal {
    Object.assign(this, deal);

    this.isSpecial = isSpecialType(deal.type||0);

    return this;
  }

  /**
   * Upload and reformat the new image,
   * set the generated url and save the entity
   * @param path The path to the temporary uploaded file
   * @param companyId
   */
  public async updateImage(path: string, companyId: string): Promise<void> {
    const image = await this.imageConvertService.resizeImage(
      path,
      DEAL_IMAGE_CONFIG,
    );

    if (image === undefined) {
      this.image = path;
      return;
    }

    const newFileName = `/company/${companyId}/images/deal_${Date.now()}.jpg`;

    await this.cloudStorageService.storeFileStream(
      newFileName,
      image,
      'image/jpeg',
    );

    this.image = newFileName;
  }

  /**
   * Update the current state of the deal
   * @return {Promise<void>}
   */
  public async update(inputDeal?: Partial<IDeal>): Promise<void> {
    this.throwIfPublished();
    this.throwIfDealTimeExceedsThreshold();

    if (inputDeal) {
      Object.assign(this, inputDeal);
    }

    await this.dealFacade.update(this, this.companyId);
  }

  public async publish(): Promise<void> {
    this.throwIfPublished();
    this.throwIfDealTimeExceedsThreshold();
    this.throwIfImageIsStillDefault();

    this.published   = Date.now();
    this.isPublished = true;

    await this.dealFacade.update(this, this.companyId);
    await this.dealAccountService.useDeal(this.id, this.companyId);

    if (this.isStatic === true) {
      await this.taskService.run();
    }
  }

  public async delete(): Promise<void> {
    await this.dealFacade.remove(this.id, this.companyId);
  }

  /**
   * If the deals was already published it may not be edited anymore
   */
  private throwIfPublished(): void | never {
    if (this.published !== null) {
      throw new ApiError(
        'Deal already published',
        ErrorCode.WEB_SERVER_INVALID_USER_INPUT,
      );
    }
  }

  private throwIfDealTimeExceedsThreshold(): void | never {
    if (this.validTo - this.validFrom > MAX_DEAL_TIME_LENGTH) {
      throw new ApiError(
        'Deal time too long',
        ErrorCode.WEB_SERVER_INVALID_USER_INPUT,
      );
    }
  }

  private throwIfImageIsStillDefault(): void | never {
    if (this.image.match(/default_deal\.png/)) {
      throw new ApiError(
        'Deal image must be set',
        ErrorCode.WEB_SERVER_INVALID_USER_INPUT,
      );
    }
  }
}

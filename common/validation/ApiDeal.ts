// eslint-disable-next-line max-classes-per-file
import {
  ToInt,
  ToString,
}                   from 'class-sanitizer';
import { Type }     from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDefined,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
  validateSync,
}                   from 'class-validator';
import { locale }   from '../common/locales';
import { TimeInMs } from '../datetime';
import {
  DayOfWeek,
  DealSpecialType,
  DealTags,
  DealTagsDish,
  DealTagsDrinks,
  DealTagsRegion,
  DealTagsType,
  DealType,
  EnumUtils,
}                   from '../enums';

import {
  GeoPoint,
  IApiDeal,
  IApiDealDate,
  IApiDealDescription,
  IApiDealDetails,
  IApiDealLocation,
  IApiDealValue,
  IBulkApiDeal,
  Monetary,
  Timestamp,
} from '../interfaces';
import {
  IsGeoPoint,
  IsGreaterThan,
  IsGreaterThanOrEqualTo,
  IsLessThan,
  IsLessThanOrEqualTo,
  IsMaxDifference,
  IsMinDifference,
  IsNotAfter6amWhenDealSpansOvernight,
} from './customDecorators';

export const MIN_DEAL_DURATION = TimeInMs.ONE_MINUTE * 30;
export const EMPTY_DEAL_ID     = '';

/**
 * The validation class for deal value data
 */
export class ApiDealValue implements IApiDealValue {

  /** @inheritDoc */
  @ToInt()
  @IsNumber(undefined, { message: locale.validationErrors.apiDeal.value.originalValue.isNumber })
  @IsGreaterThanOrEqualTo({ otherPropertyName: 'discountValue' },
                          { message: locale.validationErrors.apiDeal.value.originalValue.isGreaterThan })
  @Min(1, { message: locale.validationErrors.apiDeal.value.originalValue.isGreaterThan })
  public originalValue: Monetary = 0;

  /** @inheritDoc */
  @ToInt()
  @IsNumber(undefined, { message: locale.validationErrors.apiDeal.value.discountValue.isNumber })
  @IsLessThanOrEqualTo({ otherPropertyName: 'originalValue' },
                       { message: locale.validationErrors.apiDeal.value.discountValue.isLessThan })
  @Min(0, { message: locale.validationErrors.apiDeal.value.discountValue.isLessThan })
  public discountValue: Monetary = 0;
}

export class ApiDealDescription implements IApiDealDescription {
  @IsDefined({ message: locale.validationErrors.apiDeal.description.description.isDefined })
  @MinLength(10, { message: locale.validationErrors.apiDeal.description.description.minLength })
  @MaxLength(600, { message: locale.validationErrors.apiDeal.description.description.maxLength })
  public description = '';

  @IsDefined({ message: locale.validationErrors.apiDeal.description.title.isDefined })
  @MinLength(10, { message: locale.validationErrors.apiDeal.description.title.minLength })
  @MaxLength(55, { message: locale.validationErrors.apiDeal.description.title.maxLength })
  public title = '';
}

export class ApiDealDetails implements IApiDealDetails {
  @IsDefined({ message: locale.validationErrors.apiDeal.details.tags.isDefined })
  @IsArray({ message: locale.validationErrors.apiDeal.details.tags.isArray })
  @ArrayMinSize(1, { message: locale.validationErrors.apiDeal.details.tags.arrayMinSize })
  @ArrayMaxSize(5, { message: locale.validationErrors.apiDeal.details.tags.arrayMaxSize })
  @IsIn(
    [
      ...Object.values(DealTagsRegion),
      ...Object.values(DealTagsDish),
      ...Object.values(DealTagsType),
      ...Object.values(DealTagsDrinks),
    ],
    {
      each:    true,
      message: locale.validationErrors.apiDeal.details.tags.isIn,
    })
  public tags: DealTags[] = [];

  /** @inheritDoc */
  @ToInt()
  @ToString()
  @IsNumber(undefined, { message: locale.validationErrors.apiDeal.details.minimumPersonCount.isNumber })
  public minimumPersonCount = 0;

  @IsBoolean()
  public reservationRequired = false;
}

export class ApiDealDate implements IApiDealDate {
  /** @inheritDoc */
  @ToInt()
  @ToString()
  @IsNumber(undefined, { message: locale.validationErrors.apiDeal.date.validFrom.isNumber })
  @IsLessThan({ lessThanPropertyName: 'validTo' },
              { message: locale.validationErrors.apiDeal.date.validFrom.isLessThan })
  public validFrom: Timestamp = 0;

  /** @inheritDoc */
  @ToInt()
  @ToString()
  @IsNumber(undefined, { message: locale.validationErrors.apiDeal.date.validTo.isNumber })
  @IsNotAfter6amWhenDealSpansOvernight(undefined,
                                       { message: locale.validationErrors.apiDeal.date.validTo.overnightDealMax })
  @IsGreaterThan(
    { greaterThanPropertyName: 'validFrom' },
    { message: locale.validationErrors.apiDeal.date.validTo.isGreaterThan })
  @IsMaxDifference(
    {
      property:   'validFrom',
      difference: TimeInMs.ONE_DAY,
    },
    { message: locale.validationErrors.apiDeal.date.validTo.isMaxDifference })
  @IsMinDifference(
    {
      property:   'validFrom',
      difference: MIN_DEAL_DURATION,
    },
    { message: locale.validationErrors.apiDeal.date.validTo.isMinDifference })
  public validTo: Timestamp = 0;
}

export class ApiDealLocation implements IApiDealLocation {
  @IsDefined()
  @IsGeoPoint()
  public location: GeoPoint;

  @IsDefined()
  @IsString()
  public address: string;
}

/**
 * The validation class for deal
 */
export class ApiDeal implements IApiDeal {
  public id = EMPTY_DEAL_ID;

  public published: number | null            = null;
  public isStatic: boolean | undefined       = undefined;
  public staticDays: DayOfWeek[] | undefined = undefined;
  public skipHolidays: boolean | undefined   = undefined;

  @IsDefined()
  @IsString()
  public image: string;

  @IsDefined()
  @IsIn(EnumUtils.getValues(DealType))
  public type: DealType;

  @IsOptional()
  @IsIn(EnumUtils.getValues(DealSpecialType))
  public specialType?: DealSpecialType;

  @IsDefined()
  @ValidateNested()
  @Type(() => ApiDealValue)
  public value: ApiDealValue;

  @IsDefined()
  @ValidateNested()
  @Type(() => ApiDealDescription)
  public description: ApiDealDescription;

  @IsDefined()
  @ValidateNested()
  @Type(() => ApiDealDetails)
  public details: ApiDealDetails;

  @IsDefined()
  @ValidateNested()
  @Type(() => ApiDealDate)
  public date: ApiDealDate;

  @IsOptional()
  @ValidateNested()
  @Type(() => ApiDealLocation)
  public location?: ApiDealLocation;

  constructor(type: DealType,
              image: string,
              value: IApiDealValue,
              details: IApiDealDetails,
              date: IApiDealDate,
              description: IApiDealDescription,
              location?: IApiDealLocation,
  ) {
    this.image       = image;
    this.type        = type;
    this.value       = value;
    this.details     = details;
    this.date        = date;
    this.description = description;
    this.location    = location;
  }

  public get canBePublished(): boolean {
    const validationErrors = validateSync(this);

    return !!(
      validationErrors.length === 0
      && this.published === null
      && this.image !== ''
      && !this.image.match(/default_deal\.png/)
    );
  }
}

export class BulkApiDeal implements IBulkApiDeal {
  @IsDefined()
  @ValidateNested({ each: true })
  @Type(() => ApiDeal)
  public deals: [];
}

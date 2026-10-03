// eslint-disable-next-line max-classes-per-file
import { ToInt }        from 'class-sanitizer';
import { Type }         from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsDefined,
  IsEmail,
  IsNumber,
  IsOptional,
  Matches,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
}                       from 'class-validator';
import { locale }       from '../common/locales';
import {
  CompanyType,
  DealTags,
}                       from '../enums';
import {
  Dish,
  IApiCompany,
  IApiCompanyContactWithCity,
  IApiCompanyCorona,
  IApiCompanyDetails,
  IApiCompanyDishes,
  IApiCompanyImages,
  IApiCompanyLocation,
  IApiCompanyStatus,
  Monetary,
  OpeningHoursWeek,
  OpenRestrictions,
}                       from '../interfaces';
import { ApiDealValue } from './ApiDeal';

/**
 * The validation class for company contact data
 */
export class ApiCompanyContact implements IApiCompanyContactWithCity {

  /** @inheritDoc */
  @MinLength(2, { message: locale.validationErrors.apiCompany.contact.title.minLength })
  @MaxLength(100, { message: locale.validationErrors.apiCompany.contact.title.maxLength })
  public title = '';

  @MinLength(3, { message: locale.validationErrors.apiCompany.contact.address.minLength })
  // should contain digit for street no.
  @Matches(/\d/, { message: locale.validationErrors.apiCompany.contact.address.matches })
  public address = '';

  //@MinLength(5, { message: locale.validationErrors.apiCompany.contact.zipCode.minLength })
  //@Matches(/^[\d]+$/, { message: locale.validationErrors.apiCompany.contact.zipCode.matches })
  public zipCode = '';

  public city = '';

  @IsOptional()
  @MinLength(3, { message: locale.validationErrors.apiCompany.contact.telephone.minLength })
  public telephone: string | undefined = undefined;

  @IsOptional()
  @MinLength(3, { message: locale.validationErrors.apiCompany.contact.telephone.minLength })
  public secondaryTelephone: string | undefined;

  @IsOptional()
  @MinLength(2, { message: locale.validationErrors.apiCompany.contact.secondaryTelephoneReason.minLength })
  @MaxLength(20, { message: locale.validationErrors.apiCompany.contact.secondaryTelephoneReason.maxLength })
  public secondaryTelephoneReason: string | undefined;

  @IsOptional()
  @IsEmail(undefined, { message: locale.validationErrors.apiCompany.contact.email.isEmail })
  @MaxLength(120, { message: locale.validationErrors.apiCompany.contact.email.maxLength })
  public email: string | undefined = undefined;

  @IsBoolean({ message: locale.validationErrors.apiCompany.contact.hasAcceptedTerms.isBoolean })
  @Equals(true, { message: locale.validationErrors.apiCompany.contact.hasAcceptedTerms.equals })
  public hasAcceptedTerms = false;

  @IsOptional()
  @IsBoolean()
  public hasSubscribedToNewsletter = false;

  @IsDefined({ message: locale.validationErrors.apiCompany.contact.companyType.isDefined })
  public type: CompanyType;

  @IsOptional()
  //@MaxLength(120, { message: locale.validationErrors.apiCompany.contact.website.maxLength })
  //@IsUrl(undefined, { message: locale.validationErrors.apiCompany.contact.website.isUrl })
  public website: string | undefined = undefined;
}

export class ApiCompanyDetails implements IApiCompanyDetails {
  // CORONA
  // @MinLength(70, { message: locale.validationErrors.apiCompany.details.description.minLength })
  //@MaxLength(5000, { message: locale.validationErrors.apiCompany.details.description.maxLength })
  public description: string | undefined;

  public openingHours: OpeningHoursWeek | undefined;

  @IsBoolean()
  public prefersReservations: boolean;

  @IsOptional()
  public tags?: DealTags[];

  @IsOptional()
  public facebook?: string;

  @IsOptional()
  public instagram?: string;

  @IsOptional()
  public twitter?: string;
}

export class DishValidation implements Dish {
  @MinLength(2, { message: locale.validationErrors.apiCompany.dishes.title.minLength })
  @MaxLength(75, { message: locale.validationErrors.apiCompany.dishes.title.maxLength })
  public title: string;

  @MinLength(20, { message: locale.validationErrors.apiCompany.dishes.description.minLength })
  @MaxLength(150, { message: locale.validationErrors.apiCompany.dishes.description.maxLength })
  // matches only 2 lines
  @Matches(/^(?:[^\r\n]*(?:\r\n?|\n)){0,1}[^\r\n]*$/, { message: locale.validationErrors.apiCompany.dishes.description.maxLine })
  public description: string;

  /** @inheritDoc */
  @ToInt()
  @IsNumber(undefined, { message: locale.validationErrors.apiDeal.value.discountValue.isNumber })
  @Min(1, { message: locale.validationErrors.apiDeal.value.discountValue.isNumber })
  public price: Monetary = 0;
}

export class ApiCompanyDishes implements IApiCompanyDishes {
  @IsOptional()
  @ValidateNested()
  @Type(() => DishValidation)
  dishes: Array<Dish>;
}

export class ApiCompanyImages implements IApiCompanyImages {
  /** @inheritDoc */
  @MinLength(2, { message: locale.validationErrors.apiCompany.contact.title.minLength })
  @MaxLength(100, { message: locale.validationErrors.apiCompany.contact.title.maxLength })
  public title = '';

  @IsOptional()
  @IsDefined({ message: locale.validationErrors.apiCompany.images.logo.isDefined })
  public logo: string | undefined;

  @IsOptional()
  public menuDocument: string | undefined = undefined;
}

export class ApiCompanyCorona implements IApiCompanyCorona {
  public offersReopen: boolean;
  public offersDelivery: boolean;
  public offersTakeAway: boolean;
  public offersCoupons: boolean;
  public acceptsDonations: boolean;

  public openRestrictions?: OpenRestrictions;

  //@ValidateIf(x => x.offersDelivery)
  // CORONA
  //@MinLength(10, { message: locale.validationErrors.apiCompany.details.description.minLength })
  //@MaxLength(5000, { message: locale.validationErrors.apiCompany.details.description.maxLength })
  public reopenDescription: string | undefined;

  public deliveryDescription: string | undefined;

  //@ValidateIf(x => x.offersTakeAway)
  // CORONA
  //@MinLength(10, { message: locale.validationErrors.apiCompany.details.description.minLength })
  //@MaxLength(5000, { message: locale.validationErrors.apiCompany.details.description.maxLength })
  public takeAwayDescription: string | undefined;

  //@ValidateIf(x => x.offersCoupons)
  // CORONA
  //@MinLength(10, { message: locale.validationErrors.apiCompany.details.description.minLength })
  //@MaxLength(5000, { message: locale.validationErrors.apiCompany.details.description.maxLength })
  public couponsDescription: string | undefined;

  @IsOptional()
  //@ValidateIf(x => x.offersCoupons)
  //@MaxLength(120, { message: locale.validationErrors.apiCompany.contact.website.maxLength })
  //@IsUrl(undefined, { message: locale.validationErrors.apiCompany.contact.website.isUrl })
  public couponsLink?: string | undefined;

  //@ValidateIf(x => x.acceptsDonations)
  // CORONA
  //@MinLength(10, { message: locale.validationErrors.apiCompany.details.description.minLength })
  //@MaxLength(5000, { message: locale.validationErrors.apiCompany.details.description.maxLength })
  public donationsDescription?: string | undefined;

  @IsOptional()
  //@ValidateIf(x => x.offersCoupons)
  //@MaxLength(120, { message: locale.validationErrors.apiCompany.contact.website.maxLength })
  //@IsUrl({ require_protocol: false }, { message: locale.validationErrors.apiCompany.contact.website.isUrl })
  donationsLink?: string | undefined;

}

/**
 * The validation class for company
 */
export class ApiCompany implements IApiCompany {
  public id         = '';
  public couponCode = '';

  @IsDefined()
  @Type(() => ApiCompanyContact)
  @ValidateNested()
  public contact: IApiCompanyContactWithCity = new ApiCompanyContact();

  @Type(() => ApiCompanyDetails)
  @ValidateNested()
  public details: IApiCompanyDetails = {
    description:         undefined,
    openingHours:        undefined,
    prefersReservations: false,
  };

  @Type(() => ApiCompanyImages)
  @ValidateNested()
  public images: IApiCompanyImages = {
    background:   undefined,
    logo:         undefined,
    menuDocument: undefined,
  };

  @Type(() => ApiCompanyCorona)
  @ValidateNested()
  public corona: IApiCompanyCorona = {
    //CORONA
    offersReopen:         false,
    reopenDescription:    undefined,
    offersDelivery:       false,
    deliveryDescription:  undefined,
    offersTakeAway:       false,
    takeAwayDescription:  undefined,
    offersCoupons:        false,
    couponsDescription:   undefined,
    acceptsDonations:     false,
    donationsDescription: undefined,
    //CORONA

  };

  public location: IApiCompanyLocation = {
    lat: 0,
    lng: 0,
  };

  public status: IApiCompanyStatus = {
    isApproved:   false,
    isBlocked:    false,
    isFirstLogin: false,
  };
}

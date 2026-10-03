import {
  IApiCompany,
  IApiCompanyContact,
  IApiCompanyCorona,
  IApiCompanyDetails,
  IApiCompanyImages,
  IApiCompanyMinimal,
  IApiCompanyMinimalTransport,
  IApiCompanyOptionalInfo,
  IHubApiCompany,
  IPublicApiCompany,
  OpenRestrictions,
}                  from '@my-old-startup/common/interfaces';
import { Company } from '../ddd/entities/Company';
import {
  ICompany,
  ICompanyContact,
  ICompanyCorona,
  ICompanyDetails,
  ICompanyImages,
  ICompanyOptionalInfo,
  IPublicCompany,
}                  from '../ddd/interfaces';

export class CompanyAdapter {
  public static entityToMinimalApi(company: IPublicCompany): IApiCompanyMinimal {
    return {
      id:      company.id,
      contact: {
        type:     company.type,
        title:     company.title,
        address:   company.address,
        city:      company.city,
        zipCode:   company.zipCode,
        telephone: company.telephone,
        secondaryTelephone: company.secondaryTelephone,
        secondaryTelephoneReason: company.secondaryTelephoneReason,
      },

      images: {
        logo: company.logo,
        background: company.background,
      },

      location: {
        lat: company.lat,
        lng: company.lng,
      },

      corona: {
        //CORONA
        offersReopen:     company.offersReopen,
        openRestrictions: company.openRestrictions,
        offersDelivery:   company.offersDelivery,
        offersTakeAway:   company.offersTakeAway,
        offersCoupons:    company.offersCoupons,
        acceptsDonations: company.acceptsDonations,
        //CORONA
      },
    };
  };

  public static entityToTransportApi(company: IPublicCompany&{distance?:number}): IApiCompanyMinimalTransport {
    const openRestrictions: OpenRestrictions = company.openRestrictions || {};
    return {
      distance:   company.distance,
      id:         company.id,
      type:       company.type,
      title:      company.title,
      address:    company.address,
      city:       company.city,
      zip:        company.zipCode,
      tel:        company.telephone,
      tel2:       company.secondaryTelephone,
      tel2Reason: company.secondaryTelephoneReason,

      logo:       company.logo,
      background: company.background,

      lat: company.lat,
      lng: company.lng,

      corona:           [
        //CORONA
        company.offersReopen,
        company.offersDelivery,
        company.offersTakeAway,
        company.offersCoupons,
        company.acceptsDonations,
        //CORONA
      ],
      openRestrictions: [
        openRestrictions.indoor,
        openRestrictions.outdoor,
        openRestrictions.reservationNecessary,
        openRestrictions.phoneReservations,
        openRestrictions.maxPersonCount,
        openRestrictions.maxStayTime,
        openRestrictions.reservationsLink,
      ],
    };
  }

  public static entityToPublicApi(company: IPublicCompany): IPublicApiCompany {
    return {
      id:      company.id,
      dishes:  company.dishes,
      details: {
        description:         company.description,
        openingHours:        company.openingHours,
        prefersReservations: company.prefersReservations,
        reservationsLink:    company.reservationsLink,
        tags:                company.tags,
        facebook:            company.facebook,
        instagram:           company.instagram,
        twitter:             company.twitter,
      },

      status: {
        isFirstLogin: company.isFirstLogin,
      },

      contact: {
        title:                    company.title,
        address:                  company.address,
        zipCode:                  company.zipCode,
        city:                     company.city,
        telephone:                company.telephone,
        secondaryTelephone:       company.secondaryTelephone,
        secondaryTelephoneReason: company.secondaryTelephoneReason,
        email:                    company.email,
        type:                     company.type,
        website:                  company.website,
      },

      location: {
        lat: company.lat,
        lng: company.lng,
      },

      images: {
        background:   company.background,
        logo:         company.logo,
        menuDocument: company.menuDocument,
      },

      corona: {
        //CORONA
        offersReopen:         company.offersReopen,
        reopenDescription:    company.reopenDescription,
        offersDelivery:       company.offersDelivery,
        deliveryDescription:  company.deliveryDescription,
        offersTakeAway:       company.offersTakeAway,
        takeAwayDescription:  company.takeAwayDescription,
        offersCoupons:        company.offersCoupons,
        couponsDescription:   company.couponsDescription,
        couponsLink:          company.couponsLink,
        acceptsDonations:     company.acceptsDonations,
        donationsDescription: company.donationsDescription,
        donationsLink:        company.donationsLink,
        //CORONA
      },
    };
  }
  public static entityToApi(company: IPublicCompany): IApiCompany {
    return {
      id:         company.id,
      couponCode: Company.getCouponCode(company),
      dishes:     company.dishes,
      details:    {
        description:         company.description,
        openingHours:        company.openingHours,
        prefersReservations: company.prefersReservations,
        tags:                company.tags,
        facebook:            company.facebook,
        instagram:           company.instagram,
        twitter:             company.twitter,
        reservationsLink:    company.reservationsLink,
      },

      status: {
        isApproved:   company.isApproved,
        isBlocked:    company.isBlocked,
        isFirstLogin: company.isFirstLogin,
      },

      contact: {
        title:                    company.title,
        address:                  company.address,
        zipCode:                  company.zipCode,
        city:                     company.city,
        telephone:                company.telephone,
        secondaryTelephone:       company.secondaryTelephone,
        secondaryTelephoneReason: company.secondaryTelephoneReason,
        email:                    company.email,
        hasAcceptedTerms:          company.hasAcceptedTerms,
        type:                     company.type,
        website:                  company.website,
        // this is only sent upon registration
        hasSubscribedToNewsletter: null as any,
      },

      location: {
        lat: company.lat,
        lng: company.lng,
      },

      images: {
        background:   company.background,
        logo:         company.logo,
        menuDocument: company.menuDocument,
      },

      corona: {
        //CORONA
        offersReopen:         company.offersReopen,
        reopenDescription:    company.reopenDescription,
        openRestrictions:     company.openRestrictions,
        offersDelivery:       company.offersDelivery,
        deliveryDescription:  company.deliveryDescription,
        offersTakeAway:       company.offersTakeAway,
        takeAwayDescription:  company.takeAwayDescription,
        offersCoupons:        company.offersCoupons,
        couponsDescription:   company.couponsDescription,
        couponsLink:          company.couponsLink,
        acceptsDonations:     company.acceptsDonations,
        donationsDescription: company.donationsDescription,
        donationsLink:        company.donationsLink,
        //CORONA
      },
    };
  }

  public static entityToHubApi(
    company: ICompany,
    userAuthId: string,
  ): IHubApiCompany {
    return {
      ...CompanyAdapter.entityToApi(company),
      created:         company.created,
      updated:         company.updated,
      geoHash:         company.geoHash,
      owners:          company.owners,
      isActingAsOwner: company.owners.some((x) => x === userAuthId),
    };
  }

  public static apiContactToEntity(
    companyContact: IApiCompanyContact,
  ): ICompanyContact {
    return {
      title:                    companyContact.title,
      address:                  companyContact.address,
      zipCode:                  companyContact.zipCode,
      telephone:                companyContact.telephone,
      secondaryTelephone:       companyContact.secondaryTelephone,
      secondaryTelephoneReason: companyContact.secondaryTelephoneReason,
      email:                    companyContact.email,
      hasAcceptedTerms:         companyContact.hasAcceptedTerms,
      type:                     companyContact.type,
      website:                  companyContact.website,
    };
  }

  public static apiDetailsToEntity(
    companyDetails: IApiCompanyDetails,
  ): ICompanyDetails {
    return {
      description:         companyDetails.description,
      openingHours:        companyDetails.openingHours,
      prefersReservations: companyDetails.prefersReservations,
      tags:                companyDetails.tags,
      reservationsLink:    companyDetails.reservationsLink,
      facebook:            companyDetails.facebook,
      instagram:           companyDetails.instagram,
      twitter:             companyDetails.twitter,
    };
  }

  public static apiCoronaToEntity(
    companyDetails: IApiCompanyCorona,
  ): ICompanyCorona & {reservationsLink?:string}{
    return {
      offersReopen:         companyDetails.offersReopen,
      reopenDescription:    companyDetails.reopenDescription,
      openRestrictions:     companyDetails.openRestrictions,
      offersDelivery:       companyDetails.offersDelivery,
      deliveryDescription:  companyDetails.deliveryDescription,
      offersTakeAway:       companyDetails.offersTakeAway,
      takeAwayDescription:  companyDetails.takeAwayDescription,
      offersCoupons:        companyDetails.offersCoupons,
      couponsDescription:   companyDetails.couponsDescription,
      couponsLink:          companyDetails.couponsLink,
      acceptsDonations:     companyDetails.acceptsDonations,
      donationsDescription: companyDetails.donationsDescription,
      donationsLink:        companyDetails.donationsLink,
    };
  }

  public static apiImagesToEntity(
    companyImages: IApiCompanyImages,
  ): ICompanyImages {
    let images: ICompanyImages = {};

    if (companyImages.logo) {
      images.logo = companyImages.logo;
    }

    if (companyImages.background) {
      images.background = companyImages.background;
    }

    if (companyImages.menuDocument) {
      images.menuDocument = companyImages.menuDocument;
    }

    return images;
  }

  public static apiOptionalToEntity(
    companyOptional: IApiCompanyOptionalInfo,
  ): ICompanyOptionalInfo {
    return Object.assign({}, companyOptional);
  }
}

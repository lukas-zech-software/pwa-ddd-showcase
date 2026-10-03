import { IApiMarket } from '@my-old-startup/common/interfaces/IApiMarket';
import { IMarket }    from '../ddd/interfaces/IMarket';

export class MarketAdapter {
  public static entityToApi(market: IMarket): IApiMarket {
    return {
      id:           market.id,
      isStatic:     market.isStatic,
      staticDays:   market.staticDays,
      skipHolidays: market.skipHolidays,
      type:         market.type,
      companyIds:   market.companyIds,
      title:        market.title,
      description:  market.description,
      image:        market.image,
      tags:         market.tags,
      location:     market.location,
      address:      market.address,
      validFrom:    market.validFrom,
      validTo:      market.validTo,
    };
  }
}

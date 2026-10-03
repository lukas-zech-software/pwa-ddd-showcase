import { CollectionReference } from '@google-cloud/firestore';
import { TimeInMs }            from '@my-old-startup/common/datetime';
import {
  inject,
  injectable,
}                              from 'inversify';
import * as moment             from 'moment';
import { ICacheService }       from '../cache/ICacheService';
import { keys }                from '../container/inversify.keys';
import { IMarket }             from '../ddd/interfaces/IMarket';
import { IGeoCodingService }   from '../infrastructure/geoLocation/GeoCodingService';
import { BaseFacade }          from './BaseFacade';
import { IMarketFacade }       from './IMarketFacade';
import QuerySnapshot = FirebaseFirestore.QuerySnapshot;

function getDataFromSnapshot<T>(snapshot: QuerySnapshot): T[] {
  const results: T[] = [];
  snapshot.forEach(x => results.push(x.data() as T));

  return results;
}

@injectable()
export class MarketFacade extends BaseFacade<IMarket> implements IMarketFacade {
  constructor(
    @inject(keys.IGeoCodingService) private geoCodingService: IGeoCodingService,
    @inject(keys.IsProduction) isProduction: boolean,
    @inject(keys.GoogleCloudProjectId) googleCloudProjectId: string,
    @inject(keys.ICacheService) cacheService: ICacheService<IMarket>,
  ) {
    super(isProduction, googleCloudProjectId, cacheService);
  }

  public async getByDateRange(): Promise<IMarket[]> {
    const dynamicQuerySnapshot = await this.getCollection()
      .where('validFrom', '>=', +moment().startOf('day'))
      .where('validFrom', '<=', Date.now() + TimeInMs.ONE_DAY * 14)
      .orderBy('validFrom', 'desc')
      .get();

    const results = getDataFromSnapshot<IMarket>(dynamicQuerySnapshot);

    return results.filter(x => !x.isStatic);
  }

  public getCachePrefix(marketId: string): string {
    return `markets_${marketId}_`;
  }

  protected getCollection(): CollectionReference {
    return this.db
      .collection('markets');
  }
}

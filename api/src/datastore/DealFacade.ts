import { CollectionReference } from '@google-cloud/firestore';
import { TimeInMs }            from '@my-old-startup/common/datetime';
import {
  inject,
  injectable,
}                              from 'inversify';
import { ICacheService }       from '../cache/ICacheService';
import { keys }                from '../container/inversify.keys';
import { IDeal }               from '../ddd/interfaces';
import { IGeoCodingService }   from '../infrastructure/geoLocation/GeoCodingService';
import { BaseFacade }          from './BaseFacade';
import { IDealFacade }         from './IDealFacade';
import QuerySnapshot = FirebaseFirestore.QuerySnapshot;

function getDataFromSnapshot<T>(snapshot: QuerySnapshot): T[] {
  const results: T[] = [];
  snapshot.forEach(x => results.push(x.data() as T));

  return results;
}

@injectable()
export class DealFacade extends BaseFacade<IDeal> implements IDealFacade {
  constructor(
    @inject(keys.IGeoCodingService) private geoCodingService: IGeoCodingService,
    @inject(keys.IsProduction) isProduction: boolean,
    @inject(keys.GoogleCloudProjectId) googleCloudProjectId: string,
    @inject(keys.ICacheService) cacheService: ICacheService<IDeal>,
  ) {
    super(isProduction, googleCloudProjectId, cacheService);
  }

  public async getForCompany(companyId: string): Promise<IDeal[]> {
    return this.getAll(companyId);
  }

  public async getStatic(
    companyId: string,
  ): Promise<IDeal[]> {
    const staticQuerySnapshot = await this.getCollection(companyId)
      .where('isPublished', '==', true)
      .where('isStatic', '==', true)
      .get();

    return getDataFromSnapshot<IDeal>(staticQuerySnapshot);
  }


  public async getByDateRange(
    companyId: string,
    validFrom: number,
    validTo: number,
  ): Promise<IDeal[]> {
    const dynamicQuerySnapshot = await this.getCollection(companyId)
      .where('isPublished', '==', true)
      .where('isSpecial', '==', false)
      .where('validFrom', '>=', validFrom)
      .where('validFrom', '<=', validTo)
      .orderBy('validFrom')
      .get();

    const results = await getDataFromSnapshot<IDeal>(dynamicQuerySnapshot);

    const newsQuerySnapshot = await this.getCollection(companyId)
      .where('isPublished', '==', true)
      .where('isSpecial', '==', true)
      .where('validFrom', '<=', Date.now() + TimeInMs.ONE_DAY * 3)
      .where('validFrom', '>=', Date.now() - TimeInMs.ONE_DAY * 30)
      .orderBy('validFrom', 'desc')
      .get();

    const newsresults = await getDataFromSnapshot<IDeal>(newsQuerySnapshot);

    return [...results, ...newsresults].filter(x => !x.isStatic);
  }

  public getCachePrefix(companyId: string): string {
    return `companies_${companyId}_deals_`;
  }

  protected getCollection(companyId: string): CollectionReference {
    return this.db
      .collection('companies')
      .doc(companyId)
      .collection('deals');
  }
}

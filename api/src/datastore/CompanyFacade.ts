import { CollectionReference } from '@google-cloud/firestore';
import { CompanyType }         from '@my-old-startup/common/enums';
import { ErrorCode }           from '@my-old-startup/common/error/ErrorCode';
import { CompanyFilter }       from '@my-old-startup/common/interfaces';
import { calculateDistance }   from '@my-old-startup/common/utils/geoUtils';
import {
  inject,
  injectable,
}                              from 'inversify';
import { IGeoSearchResult }    from '../api/interfaces/geo';
import { ICacheService }       from '../cache/ICacheService';
import { ApiError }            from '../common/ApiError';
import { keys }                from '../container/inversify.keys';
import {
  ICompany,
  IDeal,
  ISearchResult,
}                              from '../ddd/interfaces';
import {
  IGeoCodingService,
  IGeoHashResult,
}                              from '../infrastructure/geoLocation/GeoCodingService';
import {
  BaseFacade,
  IQueryFilter,
}                              from './BaseFacade';
import { ICompanyFacade }      from './ICompanyFacade';

const DEFAULT_RADIUS = 5;

@injectable()
export class CompanyFacade extends BaseFacade<ICompany>
  implements ICompanyFacade {
  constructor(
    @inject(keys.IGeoCodingService) private geoCodingService: IGeoCodingService,
    @inject(keys.IsProduction) isProduction: boolean,
    @inject(keys.GoogleCloudProjectId) googleCloudProjectId: string,
    @inject(keys.ICacheService) cacheService: ICacheService<ICompany>,
  ) {
    super(isProduction, googleCloudProjectId, cacheService);
  }

  public async create(data: ICompany): Promise<ICompany> {
    return super.create(data);
  }

  public async geoSearchByAddress(
    filter: CompanyFilter,
  ): Promise<IGeoSearchResult<ICompany>> {
    let filterText = filter.address;
    if(filterText===undefined||filterText.length===0||filterText==='undefined'){
      filterText = 'Köln';
    }

    const result = await this.geoCodingService.getHashesForRadiusAroundAddress(
      filterText,
      DEFAULT_RADIUS,
    );
    return this.queryGeoHash(result);
  }

  public async geoSearchByCoordinates(
    filter: CompanyFilter,
  ): Promise<IGeoSearchResult<ICompany>> {
    const coordinates = filter.coordinates;

    if (coordinates === undefined) {
      throw new ApiError('No coordinates provided', ErrorCode.WEB_SERVER_INVALID_REQUEST_DATA);
    }
    const result = await this.geoCodingService.getHashesForRadiusAroundCoordinates(
      coordinates,
      DEFAULT_RADIUS,
    );
    return this.queryGeoHash(result);
  }

  public async geoSearchByAreaBounds(
    filter: CompanyFilter,
  ): Promise<IGeoSearchResult<ICompany>> {
    if (filter.bounds === undefined) {
      throw new ApiError('No bounds provided', ErrorCode.WEB_SERVER_INVALID_REQUEST_DATA);
    }

    const result = await this.geoCodingService.getHashesForAreaBounds(
      filter.bounds,
    );
    return this.queryGeoHash(result);
  }

  public async geoSearchFoodTruckDeals(
    filter: CompanyFilter,
    validFrom: number,
    validTo: number,
  ): Promise<ISearchResult[]> {
    if (filter.coordinates === undefined) {
      throw new ApiError('No coorinates provided', ErrorCode.WEB_SERVER_INVALID_REQUEST_DATA);
    }

    const result                   = await this.geoCodingService.getHashesForRadiusAroundCoordinates(
      filter.coordinates,
       DEFAULT_RADIUS,
    ),
          promises: Promise<any>[] = [];

    let allSearchresults: ISearchResult[] = [];

    result.hashes.forEach(hash => {
      const queryPromise = this.getDealsByGeoHash(hash, filter, validFrom, validTo).then(
        (searchresults: ISearchResult[]) => allSearchresults = [...allSearchresults, ...searchresults],
      );
      promises.push(queryPromise);
    });

    await Promise.all(promises);

    return allSearchresults;
  }

  public async getAllForUser(ownerAuthId: string): Promise<ICompany[]> {
    return this.runCachedQuery([{
      key:      'owners',
      operator: 'array-contains',
      value:    ownerAuthId as any,
    }]);
  }

  public async getByMail(email: string): Promise<ICompany> {
    const result = await this.runCachedQuery([{
      key:      'email',
      operator: '==',
      value:    email,
    }]);

    return result[0];
  }

  public async getBytype(type: CompanyType): Promise<ICompany> {
    const result = await this.runCachedQuery([{
      key:      'type',
      operator: '==',
      value:    type,
    }]);

    return result[0];
  }

  public async tryFindDoublets(
    company: ICompany,
  ): Promise<ICompany | undefined> {
    const results = await this.runCachedQuery(
      [
        {
          key:      'address',
          operator: '==',
          value:    company.address,
        },
        {
          key:      'zipCode',
          operator: '==',
          value:    company.zipCode,
        },
        {
          key:      'title',
          operator: '==',
          value:    company.title,
        },
      ],
    );

    return results[0];
  }

  public async getDealsByGeoHash(
    geoHash: string,
    filter: CompanyFilter,
    validFrom: number,
    validTo: number): Promise<ISearchResult[]> {
    const resultsMap: Map<string, ISearchResult> = new Map();
    const cacheKey                               = geoHash;
    const cached                                   = await this.cacheService.get(
      cacheKey + new Date().toDateString(),
      'geo_deals_',
      // TODO: Move to own facade?
    ) as any;

    if (cached) {
      return cached;
    }

    const querySnapshot = await this.db
      .collectionGroup('deals')
      .where('geoHash', '==', geoHash)
      .where('isPublished', '==', true)
      .where('validFrom', '>=', validFrom)
      .where('validFrom', '<=', validTo)
      .orderBy('validFrom')
      .get();

    const data = querySnapshot.docs.map<IDeal>(x => x.data() as IDeal);
    const now  = Date.now();

    for (const deal of data) {
      // manually filter outdated deals
      if (deal.validTo < now) {
        continue;
      }

      const result = resultsMap.get(deal.companyId);

      if (result === undefined) {
        resultsMap.set(deal.companyId, {
          company:  await this.get(deal.companyId),
          deals:    [deal],
          // TODO: is the filter/deal possibly undefined? Should we change the method signature?
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          distance: calculateDistance(filter.coordinates!, deal.location!),
        });
      } else {
        result.deals.push(deal);
      }
    }

    const results = Array.from(resultsMap.values());
    await this.cacheService.set(
      cacheKey + new Date().toDateString(),
      results as any,
      'geo_deals_',
    );

    return results;
  }

  public getCachePrefix(): string {
    return `companies_`;
  }

  protected getCollection(): CollectionReference {
    return this.db.collection('companies');
  }

  private async queryGeoHash(
    result: IGeoHashResult,
  ): Promise<IGeoSearchResult<ICompany>> {
    const promises: Promise<void>[]              = [],
          geoResults: IGeoSearchResult<ICompany> = {
            companies: [],
            location:  result.location,
          };

    if (result.hashes.length > 500) {
      result.all = true;
    }
    //TODO: FIXME: CORONA
    if (result.all === true) {
      geoResults.all       = true;
      geoResults.companies = await this.getAll();
      return geoResults;
    }

    function getQueryFilter(
      hash: string,
    ): IQueryFilter<ICompany, keyof ICompany>[] {
      // noinspection UnnecessaryLocalVariableJS
      const queryFilter: IQueryFilter<ICompany, keyof ICompany>[] = [
        {
          key:      'geoHash',
          operator: '==',
          value:    hash,
        },
      ];

      // Add new filters here

      return queryFilter;
    }

    result.hashes.forEach(hash => {
      const queryPromise = this.runCachedQuery(getQueryFilter(hash)).then(
        companies => void geoResults.companies.push(...companies),
      );

      promises.push(queryPromise);
    });

    await Promise.all(promises);

    return geoResults;
  }
}

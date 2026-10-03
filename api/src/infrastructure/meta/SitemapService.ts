import { TimeInMs }             from '@my-old-startup/common/datetime';
import { inject, injectable }   from 'inversify';
import { keys }                 from '../../container/inversify.keys';
import { ICompanyFacade }       from '../../datastore/ICompanyFacade';
import { ICloudStorageService } from '../cloud/CloudStorageService';
import { getSitemapRoot }       from './sitemap.templates';

export type ISitemapService = {
  init(): void;
};

/**
 * Service for creating meta data like sitemap.xml
 */
@injectable()
export class SitemapService implements ISitemapService {
  constructor(@inject(keys.IsProduction) private isProduction: boolean,
              @inject(keys.ICloudStorageService) private cloudStorageService: ICloudStorageService,
              @inject(keys.ICompanyFacade) private companyFacade: ICompanyFacade) {
  }

  public init(): void {
    if (!this.isProduction) {
      return;
    }

    void this.generate();

    setInterval(
      () => {
        void this.generate();
      },
      TimeInMs.ONE_DAY,
    );
  }

  private async generate(): Promise<void> {
    try {
      let activeCompanies = await this.companyFacade.getAll();
      activeCompanies     = activeCompanies.filter(({ id }) =>
        // manually filter text restaurant
        // TODO: Remove once test env is ready
        id !== '9MGGkQgOmhNVtCQ1obnZ' && id !== 'D2hO6oBvJzEGGMwrTTDE',
      );

      const sitemap = getSitemapRoot('https://app.my-old-startups-domain.de', activeCompanies);

      await this.cloudStorageService.storeSitemap(sitemap);

      // eslint-disable-next-line no-console
      console.log('Sitemap.xml uploaded, generated [%o] company entries', activeCompanies.length);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to generate sitemap', null, error);
    }
  }
}

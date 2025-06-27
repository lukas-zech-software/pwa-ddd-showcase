import { BulkDealError } from '@my-old-startup/common/interfaces/BulkDealError';
import { injectable }    from 'inversify';
import { IDealService }  from '../../src/ddd/services/IDealService';
import { AutoSpy }       from '../utils/autoSpy';

@AutoSpy()
@injectable()
export class DealServiceMock implements IDealService {
  public async bulkPublish(): Promise<BulkDealError[]> {
    throw new Error('DealServiceMock.bulkPublish()');
  }
}

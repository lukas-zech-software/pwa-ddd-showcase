import { TimeInMs }        from '@my-old-startup/common/datetime';
import {
  inject,
  injectable,
}                          from 'inversify';
import * as moment         from 'moment';
import { keys }            from '../../container/inversify.keys';
import { ICompanyFacade }  from '../../datastore/ICompanyFacade';
import { IDealFacade }     from '../../datastore/IDealFacade';
import { DealFactory }     from '../../ddd/factories/DealFactory';
import {
  ICompany,
  IDeal,
}                          from '../../ddd/interfaces';
import { IDealRepository } from '../../ddd/repository/IDealRepository';

export type ITaskService = {
  init(): void;
  run(): Promise<void>;
};
// TODO: make dynamic
const HOLIDAYS_NRW_2019 = [
  '2020-01-01',
  '2020-04-10',
  '2020-04-13',
  '2020-05-01',
  '2020-05-21',
  '2020-06-01',
  '2020-06-11',
  '2020-10-03',
  '2020-11-01',
  '2020-25-25',
  '2020-26-26',
];

/**
 * Service for running background tasks
 */
@injectable()
export class TaskService implements ITaskService {
  constructor(@inject(keys.IsProduction) private isProduction: boolean,
              @inject(keys.ICompanyFacade) private companyFacade: ICompanyFacade,
              @inject(keys.IDealFacade) private dealFacade: IDealFacade,
              @inject(keys.IDealRepository) private dealRepository: IDealRepository,
              @inject(keys.IDealFactory) private dealFactory: DealFactory) {
  }

  public init(): void {
    void this.runTasks();

    setInterval(() => {
      void this.runTasks();
    }, TimeInMs.ONE_DAY);
  }

  public run(): Promise<void> {
    return this.runTasks();
  }

  private async runTasks(): Promise<void> {
    try {
      await this.generateStaticDeals();
      console.log('Tasks finished');
    } catch (error) {
      console.error('Could not complete all tasks', error);
    }
  }

  private async generateStaticDeals(): Promise<void> {
    const companies = await this.companyFacade.getAll();

    for (let company of companies) {
      const staticDeals = await this.dealFacade.getStatic(company.id);

      if (staticDeals.length === 0) {
        continue;
      }

      await this.createDealsForThisAndNextWeek(staticDeals, company, 0);
      await this.createDealsForThisAndNextWeek(staticDeals, company, 7);
      await this.createDealsForThisAndNextWeek(staticDeals, company, 14);
    }
  }

  private async createDealsForThisAndNextWeek(staticDeals: IDeal[], company: ICompany, dayOfWeekOffset: number) {

    for (let deal of staticDeals) {
      const startOfWeek = moment().hours(0).minutes(0).seconds(0).milliseconds(0).day(dayOfWeekOffset);

      // if already generated for this week skip it
      if (deal.lastGenerated !== undefined && deal.lastGenerated >= +startOfWeek.format('x')) {
        continue;
      }

      for (let staticDay of deal.staticDays || []) {

        const from = moment(deal.validFrom).year(startOfWeek.year()).month(startOfWeek.month()).date(startOfWeek.date()).day(staticDay);
        const to   = moment(deal.validTo).year(startOfWeek.year()).month(startOfWeek.month()).date(startOfWeek.date()).day(staticDay);

        let skip = false;
        for (let holiday of HOLIDAYS_NRW_2019) {
          const holidayMoment = moment(holiday);
          if (from.dayOfYear() === holidayMoment.dayOfYear()) {
            skip = true;
            console.log('Skipping holiday on', holiday);
            break;
          }
        }

        if (skip || from.isBefore(moment())) {
          continue;
        }

        const newDeal: IDeal = Object.assign({}, deal, {
          validFrom:  +from.format('x'),
          validTo:    +to.format('x'),
          isStatic:   false,
          staticDays: undefined,
        });

        const created = await this.dealFactory.create();
        created.setData(newDeal);

        await created.create(company.id);
      }

      deal.lastGenerated = +startOfWeek.format('x');
      await this.dealFacade.update(deal, company.id);
    }
  }
}

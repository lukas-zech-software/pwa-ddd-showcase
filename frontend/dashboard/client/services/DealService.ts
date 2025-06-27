import {
  IApiDeal,
  Timestamp,
}                               from '@my-old-startup/common/interfaces';
import { globalMessageService } from '@my-old-startup/frontend-common/services/GlobalMessageService';
import * as moment              from 'moment';
import { locale }               from '../common/locales';
import { dashboardDealFacade }  from '../facade/DashboardDealFacade';
import { dealAccountStore }     from '../stores/DealAccountStore';
import { dealStore }            from '../stores/DealStore';

/**
 * Service that stores static function to handle deals on the current company
 */
export class DealService {
  public static async create(
    deal: IApiDeal, companyId: string,
  ): Promise<IApiDeal | undefined> {
    const created = await dashboardDealFacade.create(deal, companyId);

    if (created !== undefined) {
      dealStore.addDeal(created);
    }

    return created;
  }

  public static async bulkPublish(
    deal: IApiDeal,
    companyId: string,
    timestamps: Timestamp[],
  ): Promise<void> {
    const deals = timestamps.map((timestamp) => {
      const time        = moment(timestamp);
      const updatedFrom = moment(deal.date.validFrom);
      const updatedTo   = moment(deal.date.validTo);

      // overnight deals have a day difference between from and to
      const dayDifference = updatedTo.get('date') - updatedFrom.get('date');

      updatedFrom.set('date', time.get('date'));
      updatedTo.set('date', time.get('date') + dayDifference);
      updatedFrom.set('month', time.get('month'));
      updatedTo.set('month', time.get('month'));
      updatedFrom.set('year', time.get('year'));
      updatedTo.set('year', time.get('year'));

      deal.date.validFrom = updatedFrom.valueOf();
      deal.date.validTo   = updatedTo.valueOf();

      return {
        ...deal,
        date: { ...deal.date },
      };
    });

    const errors = await dashboardDealFacade.bulkPublish(deals, companyId);
    await dealAccountStore.refresh();

    if (errors && errors.length !== 0) {
      const errorMessages = errors.map(({ deal, error }) => (
        locale.dashboard.dealsPage.messages.dealsBulkPublishFailedEach(deal.date.validFrom, error)),
      );

      globalMessageService.pushMessage(
        {
          message: [locale.dashboard.dealsPage.messages.dealsBulkPublishFailed(errors.length), ...errorMessages].join(
            '<br>'),
          variant: 'error',
        },
      );
    } else {
      globalMessageService.pushMessage(
        {
          message: locale.dashboard.dealsPage.messages.dealsBulkPublishSuccess(deals.length),
          variant: 'success',
        },
      );
    }
  }

  public static async update(
    deal: IApiDeal, companyId: string,
  ): Promise<IApiDeal | undefined> {
    const updated = await dashboardDealFacade.updateDeal(deal, companyId);

    if (updated !== undefined) {
      dealStore.addDeal(updated);
    }

    return updated;
  }

  public static async delete(deal: IApiDeal, companyId: string): Promise<void> {
    await dashboardDealFacade.delete(
      {
        dealId: deal.id,
        companyId,
      },
    );

    dealStore.deleteDeal(deal);
  }

  public static async resetImage(
    deal: IApiDeal, companyId: string,
  ): Promise<IApiDeal | undefined> {
    const updated = await dashboardDealFacade.restoreImage(companyId, deal.id);

    if (updated !== undefined) {
      dealStore.addDeal(updated);
    }

    return updated;
  }
}

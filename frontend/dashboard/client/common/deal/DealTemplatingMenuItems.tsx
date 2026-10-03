import {
  MenuItem,
  withStyles,
  WithStyles,
}                                from '@material-ui/core';
import { IApiDeal }              from '@my-old-startup/common/interfaces';
import { DashboardRoutes }       from '@my-old-startup/frontend-common/routes';
import { globalMessageService }  from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { toJS }                  from 'mobx';
import * as React                from 'react';
import { createDealWizardStore } from '../../pages/dashboard/deals/wizard/CreateDealWizardStore';
import { routeService }          from '../../services/CdbRouteService';
import { locale }                from '../locales';

type Props = WithStyles<{}> & {
  deal: IApiDeal;
  companyId: string;
};

class _DealTemplatingMenuItems extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    return (
      <MenuItem key={0} onClick={() => this.useDealAsTemplate()}>
        {locale.dashboard.dealsPage.table.buttons.useTemplate}
      </MenuItem>
    );
  }

  private useDealAsTemplate(): void {
    const { companyId, deal } = this.props;

    createDealWizardStore.setTemplate(deal);

    globalMessageService.pushMessage({
                                       message: locale.dashboard.dealsPage.messages.newTemplate(deal.description.title),
                                       variant: 'success',
                                     });

    // send the conditions as data with the route change
    routeService.routeTo(DashboardRoutes.TemplateDeal, { companyId }, false, toJS(deal.description));
  }
}

export const DealTemplatingMenuItems = withStyles({})(_DealTemplatingMenuItems);

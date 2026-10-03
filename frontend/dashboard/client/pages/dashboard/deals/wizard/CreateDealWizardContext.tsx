import { Loading }               from '@my-old-startup/frontend-common/components';
import { DashboardRoutes }       from '@my-old-startup/frontend-common/routes';
import { requestService }        from '@my-old-startup/frontend-common/services/RequestService';
import * as React                from 'react';
import { IApiDeal }              from '../../../../../../../common/interfaces';
import { DEAL_ROUTES }           from '../../../../../../../common/routes/ApiRoutes';
import { WizardMode }            from '../../../../common/types';
import { routeService }          from '../../../../services/CdbRouteService';
import { companyStore }          from '../../../../stores/CompanyStore';
import { CreateDealWizardBase }  from './CreateDealWizardBase';
import { createDealWizardStore } from './CreateDealWizardStore';


type Props = {
  mode: WizardMode;
};

export class CreateDealWizardContext extends React.Component<Props, { init: boolean }> {
  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      init: false,
    };
  }

  public async componentDidMount(): Promise<void> {
    if (this.props.mode === WizardMode.CREATE) {
      createDealWizardStore.reset();
    }

    if (this.props.mode === WizardMode.EDIT) {
      const currentParams = routeService.getParameterValues(DashboardRoutes.EditDeal);

      const editDeal = await this.fetchDeal(currentParams.dealId, companyStore.currentCompany!.id);
      if (editDeal) {
        createDealWizardStore.setEditDeal(editDeal);
      }
    }

    this.setState({ init: true });
  }

  public render(): React.ReactNode {
    if (this.state.init === false) {
      return <Loading/>;
    }

    return <CreateDealWizardBase mode={this.props.mode}/>;
  }

  private async fetchDeal(dealId: string, companyId: string): Promise<IApiDeal | undefined> {
    const route = routeService.getRoute(DEAL_ROUTES.get, {
      companyId,
      dealId,
    });

    return requestService.getFromApi<IApiDeal>(route);
  }
}

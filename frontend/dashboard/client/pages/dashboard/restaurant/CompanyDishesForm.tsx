import { Grid }                   from '@material-ui/core';
import { Loading }                from '@my-old-startup/frontend-common/components';
import { DashboardRoutes }        from '@my-old-startup/frontend-common/routes';
import { globalMessageService }   from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { observer }               from 'mobx-react';
import * as React                 from 'react';
import { IApiCompany }            from '../../../../../../common/interfaces';
import { locale }                 from '../../../common/locales';
import { dashboardCompanyFacade } from '../../../facade/DashboardCompanyFacade';
import { companyStore }           from '../../../stores/CompanyStore';
import { CompanyDishesCard }      from './CompanyDishesCard';
import { CompanyMenuCard }        from './CompanyMenuCard';
import { FastNavigationButtons }  from './FastNavigationButtons';

@observer
export class CompanyDishForm extends React.Component {
  public render(): JSX.Element {
    const currentCompany = companyStore.currentCompany;

    if (currentCompany === undefined) {
      return <Loading/>;
    }

    return (
      <Grid container alignItems="stretch" spacing={2}>
        <Grid item md={12}>
          <FastNavigationButtons company={currentCompany} route={DashboardRoutes.Dishes}/>
        </Grid>
        <Grid item xs={6}>
          <CompanyDishesCard/>
        </Grid>
        <Grid item xs={6}>
          <CompanyMenuCard company={currentCompany} onImageChange={() => {
            void this.saveImages(currentCompany);
          }}/>
        </Grid>
      </Grid>
    );
  }

  private async saveImages({ images, id }: IApiCompany): Promise<void> {
    await dashboardCompanyFacade.updateImages(images, id);

    globalMessageService.pushMessage(
      {
        message: locale.forms.apiCompanyImages.saveMessage,
        variant: 'success',
      },
    );
  }
}


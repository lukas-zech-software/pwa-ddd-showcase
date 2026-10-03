import {
  createStyles,
  Grid,
  Theme,
  withStyles,
  WithStyles,
}                                     from '@material-ui/core';
import { Loading }                    from '@my-old-startup/frontend-common/components';
import { DashboardRoutes }            from '@my-old-startup/frontend-common/routes';
import { observer }                   from 'mobx-react';
import * as React                     from 'react';
import { locale }                     from '../../../common/locales';
import { companyStore }               from '../../../stores/CompanyStore';
import { CompanyDetailsCardCorona }   from './CompanyDetailsCardCorona';
import { CoronaBaseForm }             from './CoronaBaseForm';
import { CoronaCouponsDetailsCard }   from './CoronaCouponDetailsCard';
import { CoronaDeliveryDetailsCard }  from './CoronaDeliveryDetailsCard';
import { CoronaDonationsDetailsCard } from './CoronaDonationsDetailsCard';
import { CoronaReopenDetailsCard }    from './CoronaReopenDetailsCard';
import { CoronaTakeAwayDetailsCard }  from './CoronaTakeAwayDetailsCard';
import { FastNavigationButtons }      from './FastNavigationButtons';

const styles = (theme: Theme) => createStyles(
  {
    button:   {
      margin: theme.spacing(1),
    },
    leftIcon: {
      marginRight: theme.spacing(1),
    },
  },
);

type Props = WithStyles<typeof styles>;

@observer
class _CoronaForm extends React.Component<Props> {

  public render(): JSX.Element {
    const { classes }    = this.props;
    const currentCompany = companyStore.currentCompany;

    if (currentCompany === undefined) {
      return <Loading/>;
    }

    return (
      <Grid container alignItems="stretch" spacing={2}>

        <Grid item md={12}>
          <FastNavigationButtons company={currentCompany} route={DashboardRoutes.Corona}/>
        </Grid>

        <Grid item md={12} lg={6}>
          <CoronaBaseForm header={'1. ' + locale.forms.corona.reopen.header} subKey="reopen">
            <CoronaReopenDetailsCard/>
          </CoronaBaseForm>
        </Grid>

        <Grid item md={12} lg={6}>
          <CoronaBaseForm header={'2. ' + locale.forms.corona.delivery.header} subKey="delivery">
            <CoronaDeliveryDetailsCard/>
          </CoronaBaseForm>
        </Grid>

        <Grid item md={12} lg={6}>
          <CoronaBaseForm header={'3. ' + locale.forms.corona.takeAway.header} subKey="takeAway">
            <CoronaTakeAwayDetailsCard/>
          </CoronaBaseForm>
        </Grid>

        <Grid item md={12} lg={6}>
          <CoronaBaseForm header={'4. ' + locale.forms.corona.coupons.header} subKey="coupons">
            <CoronaCouponsDetailsCard/>
          </CoronaBaseForm>
        </Grid>

        <Grid item md={12} lg={6}>
          <CoronaBaseForm header={'5. ' + locale.forms.corona.donations.header} subKey="donations">
            <CoronaDonationsDetailsCard/>
          </CoronaBaseForm>
        </Grid>

        <Grid item md={12} lg={6}>
          <CompanyDetailsCardCorona/>
        </Grid>
      </Grid>
    );
  }
}

export const CoronaForm = withStyles(styles)(_CoronaForm);

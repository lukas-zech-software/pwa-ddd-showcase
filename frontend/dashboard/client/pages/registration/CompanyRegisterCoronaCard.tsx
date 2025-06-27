import {
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                     from '@material-ui/core';
import { Loading }                    from '@my-old-startup/frontend-common/components';
import { observer }                   from 'mobx-react';
import * as React                     from 'react';
import { locale }                     from '../../common/locales';
import { BaseCompanyFormCard }        from '../../form/BaseCompanyFormCard';
import { companyStore }               from '../../stores/CompanyStore';
import { CoronaCouponsDetailsCard }   from '../dashboard/restaurant/CoronaCouponDetailsCard';
import { CoronaDeliveryDetailsCard }  from '../dashboard/restaurant/CoronaDeliveryDetailsCard';
import { CoronaDonationsDetailsCard } from '../dashboard/restaurant/CoronaDonationsDetailsCard';
import { CoronaReopenDetailsCard }    from '../dashboard/restaurant/CoronaReopenDetailsCard';
import { CoronaTakeAwayDetailsCard }  from '../dashboard/restaurant/CoronaTakeAwayDetailsCard';

const styles = (theme: Theme) => createStyles({
                                                checkboxLine: {
                                                  padding: '0 !important',

                                                },
                                                checkboxForm: {
                                                  margin:     0,
                                                  marginLeft: theme.spacing(1),
                                                },
                                                card:         {
                                                  margin: theme.spacing(0),
                                                },
                                              });

type Props = {} & WithStyles<typeof styles>;

@observer
class _CompanyRegisterCoronaCard extends React.Component<Props> {
  public render(): JSX.Element {
    const { classes } = this.props;
    const company     = companyStore.currentCompany;

    if (company === undefined) {
      return <Loading/>;
    }

    return (
      <BaseCompanyFormCard
        subForm
        className={classes.card}
        header={locale.forms.corona.header}
        subheader={locale.forms.corona.subheader}
        submit={() => void 0}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" component={'p' as any}>
              1. {locale.forms.corona.reopen.header}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <CoronaReopenDetailsCard/>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" component={'p' as any}>
              2. {locale.forms.corona.delivery.header}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <CoronaDeliveryDetailsCard/>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" component={'p' as any}>
              3. {locale.forms.corona.takeAway.header}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <CoronaTakeAwayDetailsCard/>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" component={'p' as any}>
              4. {locale.forms.corona.coupons.header}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <CoronaCouponsDetailsCard/>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="h6" component={'p' as any}>
              5. {locale.forms.corona.donations.header}
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <CoronaDonationsDetailsCard/>
          </Grid>

        </Grid>
      </BaseCompanyFormCard>
    );
  }
}

export const CompanyRegisterCoronaCard = withStyles(styles)(_CompanyRegisterCoronaCard);

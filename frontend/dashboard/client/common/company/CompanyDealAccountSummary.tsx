import {
  createStyles,
  Fab,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                      from '@material-ui/core';
import { Add }                         from '@material-ui/icons';
import { DashboardRoutes }             from '@my-old-startup/frontend-common/routes';
import { observer }                    from 'mobx-react';
import * as React                      from 'react';
import { routeService }                from '../../services/CdbRouteService';
import { dashboardAnalyticsService }   from '../../services/dashboardAnalyticsService';
import { companyStore }                from '../../stores/CompanyStore';
import { DealAccountChip }             from '../deal/DealAccountChip';
import { AddNewDealLabel }             from '../GAEvent';
import { locale }                      from '../locales';
import { PublishedDealsRemainingChip } from '../PublishedDealsRemainingChip';

const styles = (theme: Theme) => createStyles(
  {
    container:     {
      padding: theme.spacing(1),
    },
    chipContainer: {
      marginTop:      theme.spacing(1),
      display:        'flex',
      flexWrap:       'wrap',
      justifyContent: 'flex-start',
      width:          '100%',
    },
    button:        {
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
        marginTop:  theme.spacing(1),
      },
    },
    chip:          {
      margin: theme.spacing(0.5),
    },
    fab:           {
      [theme.breakpoints.down('xs')]: {
        marginLeft: theme.spacing(1),
      },
      marginLeft:                     theme.spacing(2),
      height:                         theme.spacing(4),
      width:                          180,
      fontSize:                       13,
      top:                            theme.spacing(0.5),
      // eslint-disable-next-line @typescript-eslint/tslint/config
      backgroundImage:                `linear-gradient(to bottom right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    },
    extendedIcon:  {
      height:   theme.spacing(3),
      width:    theme.spacing(3),
      position: 'relative',
      ...locale.dashboard.cards.companyInfo.createNewDealChip.style(),
    },

  },
);

type Props = WithStyles<typeof styles> & {};

type State = {};

@observer
class _CompanyDealAccountSummary extends React.Component<Props, State> {
  public render(): React.ReactNode {
    const { classes } = this.props;
    const company     = companyStore.currentCompany;

    if (company === undefined) {
      return null;
    }

    return (
      <div className={classes.container}>
        <Typography variant="body2" dangerouslySetInnerHTML={{ __html: locale.dashboard.dealAccountInfo() }}/>
        <div className={classes.chipContainer}>
          <DealAccountChip/>
          <PublishedDealsRemainingChip company={company}
                                       onClick={() => routeService.routeTo(
                                         DashboardRoutes.Deals,
                                         { companyId: company.id },
                                       )}
          />
          <Fab variant="extended" color="primary" aria-label="Create new" className={classes.fab}
               onClick={() => {
                 dashboardAnalyticsService.trackEvent(
                   {
                     category: 'dashboard',
                     action:   'add-new-deal',
                     label:    AddNewDealLabel.NewDealFab,
                   },
                 );
                 routeService.routeTo(DashboardRoutes.NewDeal, { companyId: company.id });
               }}>
            <Add className={classes.extendedIcon}/>
            {locale.dashboard.cards.companyInfo.createNewDealChip.label}
          </Fab>
        </div>
      </div>
    );
  }
}

export const CompanyDealAccountSummary = withStyles(styles)(_CompanyDealAccountSummary);

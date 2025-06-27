import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
}                                    from '@material-ui/core';
import { DashboardRoutes }           from '@my-old-startup/frontend-common/routes';
import { observer }                  from 'mobx-react';
import * as React                    from 'react';
import { RouteComponentProps }       from 'react-router';
import { AddNewDealLabel }           from '../../../common/GAEvent';
import { locale }                    from '../../../common/locales';
import { routeService }              from '../../../services/CdbRouteService';
import { dashboardAnalyticsService } from '../../../services/dashboardAnalyticsService';
import { companyStore }              from '../../../stores/CompanyStore';
import { DealsTableTabs }            from './DealsTableTabs';
import { RecentDealTable }           from './RecentDealTable';

const styles = (theme: Theme) => createStyles(
  {
    createButton: {
      marginTop:    theme.spacing(2),
      marginRight:  theme.spacing(2),
      marginBottom: 0,
    },
  },
);

type Props = WithStyles<typeof styles> & RouteComponentProps<{ newDealId?: string }>;

/**
 * Card which displays tables for the deals archive (all past deals); drafts; and active, upcoming deals
 */
@observer
class _DealsTableCard extends React.Component<Props> {
  public render(): React.ReactNode {
    const { classes }    = this.props;
    const currentCompany = companyStore.currentCompany;

    if (currentCompany === undefined) {
      return (<CircularProgress/>);
    }

    const newDealId = this.props.match.params.newDealId;

    return (
      <Card>
        <CardHeader action={
          <Button variant="contained"
                  color="primary"
                  onClick={() => {
                    dashboardAnalyticsService.trackEvent(
                      {
                        category: 'dashboard',
                        action:   'add-new-deal',
                        label:    AddNewDealLabel.DealListButton,
                      },
                    );
                    routeService.routeTo(DashboardRoutes.NewDeal, { companyId: currentCompany.id });

                  }}
                  className={classes.createButton}
          >
            {locale.dashboard.dealsPage.headerCreate}
          </Button>
        }
        />
        <CardContent>
          <RecentDealTable newDealId={newDealId}/>
          <DealsTableTabs currentCompany={currentCompany}/>
        </CardContent>
      </Card>
    );
  }
}

export const DealsTableCard = withStyles(styles)(_DealsTableCard);

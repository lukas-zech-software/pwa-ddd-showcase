import {
  Card,
  CardActions,
  CardContent,
  createStyles,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}               from '@material-ui/core';
import { Done } from '@material-ui/icons';

import { IApiCompanyMinimal }        from '@my-old-startup/common/interfaces';
import { CUSTOMER_COMPANY_ROUTES }   from '@my-old-startup/common/routes/FrontendRoutes';
import { WithRouterProps }           from 'next/dist/client/with-router';
import { withRouter }                from 'next/router';
import * as React                    from 'react';
import { calculateDistance }         from '../../../../common/utils/geoUtils';
import { locale }                    from '../../common/locales';
import { customerAnalyticsService }  from '../../services/customerAnalyticsService';
import { locationStore }             from '../../store/LocationStore';
import { VisibilitySensor }          from '../common/VisibilitySensor';
import { CompanyCardButtons }        from './CompanyCardButtons';
import { CompanyDetailsMediaHeader } from './CompanyDetailsMediaHeader';
import { CompanyDistanceShare }      from './CompanyDistanceShare';

const styles = (theme: Theme) => createStyles(
  {
    card:        {
      margin:              theme.spacing(2),
      marginTop:           0,
      // Fix for mobile safari
      '-webkit-transform': 'translate3d(0,0,0)',
    },
    done:        {
      marginRight: theme.spacing(1),
      marginLeft:  theme.spacing(1),
      top:         6,
      position:    'relative',
    },
    lowerAction: {
      paddingTop: 0,
    },
    actionRoot:  {
      paddingTop:   theme.spacing(2),
      paddingLeft:  theme.spacing(2),
      paddingRight: theme.spacing(2),
    },
    contentCard: {
      marginBottom:  0,
      paddingBottom: 0,
      whiteSpace:    'normal',
    },
  },
);
type State = {
  showImage: boolean;
}

type Props = {
  company: IApiCompanyMinimal;
} & WithStyles<typeof styles> & WithRouterProps;

class _CompanyListCard extends React.Component<Props, State> {

  constructor(props: Readonly<Props>) {
    super(props);
    this.state = {
      showImage: false,
    };
  }

  public componentDidMount(): void {
    void this.props.router.prefetch(CUSTOMER_COMPANY_ROUTES.companyDetailsPath);
  }

  public render(): React.ReactNode {
    const { classes, company} = this.props;

    let distance = 0;
    if(this.state.showImage){
      distance = company.distance || calculateDistance(company.location, locationStore.location.coordinates);
    }

    return (
      <VisibilitySensor
        scrollThrottle={250}
        partialVisibility
        active={this.state.showImage == false}
        onChange={visible => {
        if (!visible) {
          return;
        }

        this.setState({ showImage: true });
        customerAnalyticsService.companyListImpression({ company });
      }}
      >
        <Card
          className={classes.card}
          elevation={4}>

          <CompanyDetailsMediaHeader
            company={company}
            distance={distance}
            showImage={this.state.showImage}
          />

          <CardActions classes={{ root: classes.actionRoot }}>
            <CompanyDistanceShare company={company} distance={distance} component={'h2' as any}/>
          </CardActions>

          <CardContent className={classes.contentCard}>
            {(company.corona.offersReopen || company.corona.offersCoupons || company.corona.offersDelivery || company.corona.offersTakeAway || company.corona.acceptsDonations) && (
              <>
                <Typography variant="h6" align={'center'}>
                  {locale.restaurantView.coronaHeader}
                </Typography>
                <CardContent>
                  <Typography variant="subtitle2" component={'h2' as any} align="center">
                    {company.corona.offersReopen && (
                      <>
                        <Done className={classes.done}/>
                        {locale.restaurantView.offersReopenHeader}
                      </>
                    )}

                    {company.corona.offersDelivery && (
                      <>
                        <Done className={classes.done}/>
                        {locale.restaurantView.offersDeliveryHeader}
                      </>
                    )}

                    {company.corona.offersTakeAway && (
                      <>
                        <Done className={classes.done}/>
                        {locale.restaurantView.offersTakeAwayHeader}
                      </>
                    )}

                    {company.corona.offersCoupons && (
                      <>
                        <Done className={classes.done}/>
                        {locale.restaurantView.offersCouponsHeader}
                      </>
                    )}
                  </Typography>

                </CardContent>
              </>
            )}
          </CardContent>

          <CardActions className={classes.lowerAction}>
            <CompanyCardButtons company={company}/>
          </CardActions>
        </Card>
      </VisibilitySensor>
    );
  }
}

export const CompanyListCard = withRouter(withStyles(styles)(_CompanyListCard));

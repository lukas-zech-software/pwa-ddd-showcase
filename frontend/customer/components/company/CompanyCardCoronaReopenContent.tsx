import {
  createStyles,
  Grid,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { IApiCompanyMinimal } from '@my-old-startup/common/interfaces';
import { cleanUrl }           from '@my-old-startup/frontend-common/utils/format';
import * as React             from 'react';
import { locale }             from '../../common/locales';
import {
  IndoorIcon,
  PersonIcon,
  ReservationIcon,
  TimeIcon,
}                             from '../icons/icons';

const styles = (theme: Theme) => createStyles(
  {
    container:   {
      [theme.breakpoints.up('sm')]: {
        marginLeft:  theme.spacing(2),
        marginRight: theme.spacing(2),
        marginBottom: theme.spacing(2),
      },
    },
    marginTop:   {
      marginTop:                      theme.spacing(1),
    },
    contentCard: {
      marginBottom:  0,
      paddingBottom: 0,
      whiteSpace:    'normal',
    },
  },
);

type Props = {
  company: IApiCompanyMinimal;
} & WithStyles<typeof styles>;

class _CompanyCardCoronaReopenContent extends React.Component<Props> {

  public render(): React.ReactNode {
    const { classes, company } = this.props;

    if (!company.corona.offersReopen) {
      return null;
    }

    if (!company.corona.openRestrictions) {
      return null;
    }

    return (
      <Grid container className={classes.container}>
        {(company.corona.openRestrictions.indoor || company.corona.openRestrictions.outdoor) && (
            <Grid item xs={12} sm={6} className={classes.marginTop}>
              <Typography variant="subtitle2" component={'h3' as any}>
                <IndoorIcon/>
                {(company.corona.openRestrictions.indoor === true && !company.corona.openRestrictions.outdoor) && (
                  locale.restaurantView.openRestriction.indoor
                )}
                {(!company.corona.openRestrictions.indoor && company.corona.openRestrictions.outdoor === true) && (
                  locale.restaurantView.openRestriction.outdoor
                )}
                {(company.corona.openRestrictions.indoor === true && company.corona.openRestrictions.outdoor === true) && (
                  locale.restaurantView.openRestriction.inoutdoor
                )}
              </Typography>
            </Grid>
        )}

        {(company.corona.openRestrictions.reservationNecessary !== undefined) && (
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" component={'h3' as any} className={classes.marginTop}>
              <ReservationIcon/>
              {(company.corona.openRestrictions.reservationNecessary === true) && (
                locale.restaurantView.openRestriction.reservationNecessary
              )}
              {(company.corona.openRestrictions.reservationNecessary === false) && (
                locale.restaurantView.openRestriction.reservationPreferred
              )}
              &nbsp;
              {(company.corona.openRestrictions.reservationsLink !== undefined) && (
                <>
                  <>(</>
                  <a rel="noopener noreferrer nofollow" target="_blank"
                     href={cleanUrl(company.corona.openRestrictions.reservationsLink)}>Link</a>
                  <>)</>
                </>
              )}
              {(company.corona.openRestrictions.reservationsLink === undefined && company.corona.openRestrictions.phoneReservations === true && company.contact.telephone) && (
                <>
                  <>(</>
                  <a
                    href={`tel:+49${company.contact.telephone}`}>{locale.restaurantView.openRestriction.reservationPhone}</a>
                  <>)</>
                </>
              )}
            </Typography>
          </Grid>
        )}

        {(company.corona.openRestrictions.maxPersonCount) && (
          <Grid item xs={12} sm={6} className={classes.marginTop}>
            <Typography variant="subtitle2" component={'h3' as any}>
              <PersonIcon/>
              {locale.restaurantView.openRestriction.maxPersonCount(company.corona.openRestrictions.maxPersonCount)}
            </Typography>
          </Grid>
        )}

        {(company.corona.openRestrictions.maxStayTime) && (
          <Grid item xs={12} sm={6} className={classes.marginTop}>
            <Typography variant="subtitle2" component={'h3' as any}>
              <TimeIcon/>
              {locale.restaurantView.openRestriction.maxStayTime(company.corona.openRestrictions.maxStayTime)}
            </Typography>
          </Grid>
        )}

      </Grid>
    );
  }
}

export const CompanyCardCoronaReopenContent = withStyles(styles)(_CompanyCardCoronaReopenContent);

import {
  Button,
  createStyles,
  makeStyles,
  Theme,
}                                 from '@material-ui/core';
import {
  ArrowBack,
  Home,
  OpenInNew,
  Restaurant,
} from '@material-ui/icons';
import LocalHospital              from '@material-ui/icons/LocalHospital';
import { locale as commonLocale } from '@my-old-startup/frontend-common/locales';
import {
  COMPANY_ROUTES,
  DashboardRoutes,
}                                 from '@my-old-startup/frontend-common/routes';
import * as React                 from 'react';
import { IApiCompany }            from '../../../../../../common/interfaces';
import { locale }                 from '../../../common/locales';
import { routeService }           from '../../../services/CdbRouteService';

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
                        button:    {
                          margin: theme.spacing(1),
                        },
                        leftIcon:  {
                          marginRight: theme.spacing(1),
                        },
                        paragraph: {
                          marginTop: theme.spacing(2),
                        },
                      });
});

type Props = {
  route: DashboardRoutes;
  company: IApiCompany;
};

export function FastNavigationButtons(props: Props): JSX.Element {
  const { company, route } = props;
  const classes            = useStyles();

  return (
    <>
      {route !== DashboardRoutes.Restaurant && (
        <Button
          variant="contained"
          color="inherit"
          className={classes.button}
          onClick={() =>
            routeService.routeTo(DashboardRoutes.Restaurant, {
              companyId: company.id,
            })
          }
        >
          <ArrowBack className={classes.leftIcon}/>
          <Home className={classes.leftIcon}/>
          {commonLocale.company.prefix[company.contact.type] +
          ' ' +
          commonLocale.company.types[company.contact.type]}
        </Button>
      )}
      {route !== DashboardRoutes.Corona && (
        <Button
          variant="contained"
          color="inherit"
          className={classes.button}
          onClick={() =>
            routeService.routeTo(DashboardRoutes.Corona, {
              companyId: company.id,
            })
          }
        >
          <ArrowBack className={classes.leftIcon}/>
          <LocalHospital className={classes.leftIcon}/>
          {locale.dashboard.menuItems.corona}
        </Button>
      )}
      {route !== DashboardRoutes.Dishes && (
        <Button
          variant="contained"
          color="inherit"
          className={classes.button}
          onClick={() =>
            routeService.routeTo(DashboardRoutes.Dishes, {
              companyId: company.id,
            })
          }
        >
          <ArrowBack className={classes.leftIcon}/>
          <Restaurant className={classes.leftIcon}/>
          {locale.dashboard.menuItems.dishes}
        </Button>

      )}
      <Button
        variant="contained"
        color="inherit"
        className={classes.button}
        onClick={() => {
          const route = routeService.getRoute(COMPANY_ROUTES.companyDetails, {
            companyId: company.id,
          });
          window.open('https://app.my-old-startups-domain.de' + route, '_blank');
        }}
      >
        <OpenInNew className={classes.leftIcon}/>
        {locale.dashboard.companyPage.publicProfileButton}
      </Button>
    </>
  );
}

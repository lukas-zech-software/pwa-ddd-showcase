import {
  createStyles,
  Fab,
  Theme,
  Tooltip,
  WithStyles,
  withStyles,
  Zoom,
}                          from '@material-ui/core';
import { PermPhoneMsg }    from '@material-ui/icons';
import { DashboardRoutes } from '@my-old-startup/frontend-common/routes';
import { dashboardTheme }  from '@my-old-startup/frontend-common/theme';
import React               from 'react';
import { routeService }    from '../../services/CdbRouteService';
import { locale }          from '../locales';

const transitionDuration = {
  enter: dashboardTheme.transitions.duration.enteringScreen,
  exit:  dashboardTheme.transitions.duration.leavingScreen,
};

const styles = (theme: Theme) => createStyles(
  {
    fab: {
      position: 'fixed',
      bottom:   theme.spacing(2),
      right:    theme.spacing(2),
      zIndex:   999,
    },
  },
);

type Props = WithStyles<typeof styles>;

export const SupportButton = withStyles(styles)(({ classes }: Props) => {
  if (
    routeService.isRouteActive(DashboardRoutes.Contact) ||
    routeService.isRouteActive(DashboardRoutes.Feedback) ||
    routeService.isRouteActive(DashboardRoutes.EditDeal) ||
    routeService.isRouteActive(DashboardRoutes.NewDeal) ||
    routeService.isRouteActive(DashboardRoutes.TemplateDeal)
  ) {
    return null;
  }

  return (
    <Zoom in
          timeout={transitionDuration}
          style={{
            transitionDelay: `${transitionDuration.exit}ms`,
          }}
          unmountOnExit
    >
      <Tooltip title={locale.dashboard.contactPage.button}>
        <Fab className={classes.fab} color="primary" onClick={() => routeService.routeTo(DashboardRoutes.Contact)}>
          <PermPhoneMsg/>
        </Fab>
      </Tooltip>
    </Zoom>
  );
});

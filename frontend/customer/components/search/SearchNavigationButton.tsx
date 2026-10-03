import {
  createStyles,
  IconButton,
  Theme,
  WithStyles,
  withStyles,
}                                  from '@material-ui/core';
import ArrowBackIcon               from '@material-ui/icons/ArrowBack';
import MenuIcon                    from '@material-ui/icons/Menu';
import { CUSTOMER_COMPANY_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';
import { WithRouterProps }         from 'next/dist/client/with-router';
import Router, { withRouter }      from 'next/router';
import * as React                  from 'react';
import { getLastRoute }            from '../../common/routeUtils';

function showBackButton(path: string): boolean {
  return (
    path === CUSTOMER_COMPANY_ROUTES.dealDetailsPath ||
    path === CUSTOMER_COMPANY_ROUTES.companyDetailsPath
  );
}

const styles = (theme: Theme) =>
  createStyles(
    {
      iconButton: {
        marginTop:  theme.spacing(1),
        marginLeft: theme.spacing(1),
        float:      'left',
      },
    },
  );

type Props = {
  onMenuClick: () => void;
} & WithStyles<typeof styles> & WithRouterProps;

// eslint-disable-next-line @typescript-eslint/class-name-casing
class _SearchNavigationButton extends React.Component<Props> {
  /**
   * Either get back button if on a details page or menu button else
   */
  public render(): React.ReactNode {
    const { classes, onMenuClick, router } = this.props;
    if (router && showBackButton(router.pathname)) {
      return (
        <IconButton
          className={classes.iconButton}
          aria-label="Back"
          onClick={() => {
            if (getLastRoute() === CUSTOMER_COMPANY_ROUTES.companyListViewPath) {
              Router.push(CUSTOMER_COMPANY_ROUTES.companyListViewPath);
            } else {
              Router.push(CUSTOMER_COMPANY_ROUTES.companyMapViewPath);
            }
          }}
        >
          <ArrowBackIcon/>
        </IconButton>
      );
    }

    return (
      <IconButton
        className={classes.iconButton}
        aria-label="Menu"
        onClick={onMenuClick}
      >
        <MenuIcon/>
      </IconButton>
    );
  }
}

export const SearchNavigationButton = withStyles(styles)(withRouter(_SearchNavigationButton));

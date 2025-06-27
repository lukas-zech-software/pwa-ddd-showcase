import {
  CircularProgress,
  createStyles,
  Grid,
  Theme,
  withStyles,
  WithStyles,
}                                  from '@material-ui/core';
import { IS_SERVER }               from '@my-old-startup/frontend-common/constants';
import { observer }                from 'mobx-react';
import Router                      from 'next/router';
import * as React                  from 'react';
import { CUSTOMER_COMPANY_ROUTES } from '../../../../common/routes/FrontendRoutes';
import { searchStore }             from '../../store/SearchStore';
import { getInnerHeight }          from '../../styles/theme';

const styles = (theme: Theme) => createStyles({
                                                loading: {
                                                  textAlign: 'center',
                                                  height:    getInnerHeight(theme),
                                                  width:     '100%',
                                                },
                                              });

type Props = {
};

@observer
class _ViewWrapper extends React.Component<Props & WithStyles<typeof styles>> {
  public render(): React.ReactNode {
    const { children, classes } = this.props;
    const isLoading                      = searchStore.isLoading;


    if (isLoading) {
      return (
        <Grid
          container
          spacing={3}
          justify={'center'}
          alignItems={'center'}
          className={classes.loading}
        >
          <Grid item xs={12}>
            <CircularProgress size={70}/>
          </Grid>
        </Grid>
      );
    }

    return children;
  }
}

export const ViewWrapper = withStyles(styles)(_ViewWrapper);

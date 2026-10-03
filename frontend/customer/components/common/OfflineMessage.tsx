import {
  createStyles,
  Snackbar,
  SnackbarContent,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                      from '@material-ui/core';
import { Update }      from '@material-ui/icons';
import { alertColors } from '@my-old-startup/frontend-common/style';
import * as React      from 'react';
import { locale }      from '../../common/locales';
import { searchStore } from '../../store/SearchStore';

const styles = (theme: Theme) => createStyles(
  {
    info:    {
      backgroundColor: alertColors(theme).info,
      color:           theme.palette.text.primary,
    },
    message: {
      fontSize:   20,
      display:    'flex',
      flexGrow:   2,
      flexBasis:  2,
      alignItems: 'center',
    },
  },
);

type State = {
  offline: boolean;
};

class _OfflineMessage extends React.Component<WithStyles<typeof styles>, State> {
  public state: State = {
    offline: false,
  };

  public componentDidMount(): void {
    this.register();
  }

  public render(): React.ReactNode {
    const { classes } = this.props;
    const { offline } = this.state;

    if (offline === false) {
      return null;
    }

    return (
      <Snackbar
        color="primary"
        anchorOrigin={{
          vertical:   'top',
          horizontal: 'center',
        }}
        open={offline === true}
      >
        <SnackbarContent
          className={classes.info}
          message={
            <Typography
              variant="subtitle1"
              className={classes.message}
              align="center"
              color="inherit">
              <Update style={{
                left:     -8,
                position: 'relative',
              }}/>
              {locale.common.offlineMessage}
            </Typography>
          }
        />
      </Snackbar>
    );
  }

  private register(): void {
    window.addEventListener('load', () => {
      window.addEventListener('online', () => {
        this.setState({ offline: false });
        searchStore.setIsOffline(false);
      });
      window.addEventListener('offline', () => {
        this.setState({ offline: true });
        searchStore.setIsOffline(true);
      });
    });
  }
}

export const OfflineMessage = withStyles(styles)(_OfflineMessage);

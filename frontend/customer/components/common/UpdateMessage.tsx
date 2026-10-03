import {
  createStyles,
  Snackbar,
  SnackbarContent,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                        from '@material-ui/core';
import { Update }        from '@material-ui/icons';
import { IS_PRODUCTION } from '@my-old-startup/frontend-common/constants';
import { alertColors }   from '@my-old-startup/frontend-common/style';
import * as React        from 'react';
import { locale }        from '../../common/locales';

export enum UpdateEvent {
  IS_UPDATE_READY,
  IS_UPDATING,
  HAS_UPDATED_FINISHED,
  HAS_UPDATE_FAILED,
  OFFLINE,
}

const styles = (theme: Theme) => createStyles({
  info: {
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
});

type State = {
  event: UpdateEvent | undefined;
};

class _UpdateMessage extends React.Component<WithStyles<typeof styles>, State> {
  public state: State = {
    event: undefined,
  };

  public componentDidMount(): void {
    this.register();
  }

  public render(): React.ReactNode {
    const { classes } = this.props;
    const event = this.state.event;

    if (event === undefined) {
      return null;
    }

    return (
      <Snackbar
        color="primary"
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={event !== undefined}
        onClose={() => this.setState({ event: undefined })}
        autoHideDuration={4000}
      >
        <SnackbarContent
          className={classes.info}
          message={
            <Typography
              variant="subtitle1"
              className={classes.message}
              align="center"
              color="inherit">
              <Update style={{ left: -8, position: 'relative' }}/>
              {locale.common.updateMessage[event]}
            </Typography>
          }
        />
      </Snackbar>
    );
  }

  private register(): void {
    if (IS_PRODUCTION === false) {
      return;
    }

    if ('serviceWorker' in navigator) {
      const wb = (window as any).workbox;

      wb.addEventListener(
        'installed',
        (event: any) => {
          if (event.isUpdate) {
            this.setState({ event: UpdateEvent.HAS_UPDATED_FINISHED });
            setTimeout(
              () => {
                window.location.reload();
              },
              4000);
          }
        });

      void wb.register();
    }
  }
}

export const UpdateMessage = withStyles(styles)(_UpdateMessage);

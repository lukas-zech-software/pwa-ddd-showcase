import {
  createStyles,
  IconButton,
  Snackbar,
  SnackbarContent,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                         from '@material-ui/core';
import { Close }          from '@material-ui/icons';
import InfoIcon           from '@material-ui/icons/Info';
import { RawHtml }        from '@my-old-startup/frontend-common/components/RawHtml';
import { storageService } from '@my-old-startup/frontend-common/services/StorageService';
import * as React         from 'react';
import { locale }         from './locales';

const styles = (theme: Theme) => createStyles({
  loading: {
    textAlign: 'center',
    height:    '100%',
  },
  icon: {
    marginRight: theme.spacing(1),
  },
  root: {
    display:        'flex',
    justifyContent: 'space-between',
  },
  info: {
    backgroundColor: '#f2f2f2',
    color:           theme.palette.text.primary,
  },
  iconButton: {
    float: 'right',
  },
  header: {
    fontSize:   20,
    display:    'flex',
    alignItems: 'center',
  },
  message: {
    display:    'flex',
    flexGrow:   2,
    flexBasis:  2,
    alignItems: 'center',
  },
});

type Props = WithStyles<typeof styles>;

type State = {
  isOpen: boolean;
};

class _PrivacyBar extends React.Component<Props, State> {

  public constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  public componentWillMount(): void {
    if (!storageService.has('privacyShown')) {
      this.setState({ isOpen: true });
    }
  }

  public render(): React.ReactNode {
    const { classes } = this.props;
    const { isOpen }  = this.state;

    return (
      <Snackbar disableWindowBlurListener
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                onClose={() => this.onClose()}
                open={isOpen}
      >


        <SnackbarContent
          className={classes.info}
          message={
            <>
              <div className={classes.root}>
                <span className={classes.header}>

                  <InfoIcon className={classes.icon}/>
                  {locale.common.privacyMessage.header}
                </span>

                <IconButton className={classes.iconButton} aria-label="Close" color="inherit"
                            onClick={() => this.onClose(true)}>
                  <Close/>
                </IconButton>

              </div>
              <Typography variant="caption" className={classes.message}>
                <RawHtml>{locale.common.privacyMessage.text}</RawHtml>
              </Typography>
            </>
          }
        />
      </Snackbar>
    );
  }

  private onClose(flag = false): void {
    if (!flag) {
      return;
    }
    this.setState({ isOpen: false });
    storageService.set('privacyShown', 'true');
  }
}

export const PrivacyBar = withStyles(styles)(_PrivacyBar);

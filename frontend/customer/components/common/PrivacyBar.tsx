import {
  Button,
  createStyles,
  Grid,
  Snackbar,
  SnackbarContent,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                 from '@material-ui/core';
import InfoIcon                   from '@material-ui/icons/Info';
import { RawHtml }                from '@my-old-startup/frontend-common/components/RawHtml';
import { GoogleAnalyticsService } from '@my-old-startup/frontend-common/services/GoogleAnalyticsService';
import { storageService }         from '@my-old-startup/frontend-common/services/StorageService';
import * as Cookie                from 'js-cookie';
import * as React                 from 'react';
import { COOKIE_ONLY_NECESSARY }  from '../../../../common/enums';
import { locale }                 from '../../common/locales';

const styles = (theme: Theme) =>
  createStyles({

                 info: {
                   backgroundColor: '#f2f2f2',
                   color:           theme.palette.text.primary,
                 },

                 icon:    {
                   marginRight: theme.spacing(1),
                 },
                 header:  {
                   fontSize:     20,
                   display:      'flex',
                   alignItems:   'center',
                   marginBottom: theme.spacing(1),
                 },
                 message: {
                   display:    'flex',
                   flexGrow:   2,
                   flexBasis:  2,
                   alignItems: 'center',
                 },

                 onlyButton: {
                   marginRight:     theme.spacing(2),
                   backgroundColor: theme.palette.grey[300],
                 },
                 okButton:   {},
               });

type State = {
  isOpen: boolean;
};

class _PrivacyBar extends React.Component<WithStyles<typeof styles>, State> {

  public constructor(props: any) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }

  public componentDidMount(): void {
    const domainWideGA = Cookie.get('_ga');
    if (!!domainWideGA) {
      // cookies were already accepted
      storageService.set('privacyShown', 'true');
      storageService.remove(COOKIE_ONLY_NECESSARY);
      return;
    }

    if (storageService.has('privacyShown') === false) {
      this.setState({ isOpen: true });
    }
  }

  public render(): React.ReactNode {
    const { classes } = this.props;
    const { isOpen }  = this.state;

    if (isOpen === false) {
      return null;
    }

    return (
      <Snackbar
        anchorOrigin={{
          vertical:   'bottom',
          horizontal: 'center',
        }}
        open
      >


        <SnackbarContent
          className={classes.info}
          message={
            <Grid container>
              <Grid item xs={12}>
              <span className={classes.header}>

                <InfoIcon className={classes.icon}/>
                {locale.common.privacyMessage.header}
                </span>

              </Grid>
              <Grid item xs={12}>
                <Typography variant="caption" className={classes.message}>
                  <RawHtml>{locale.common.privacyMessage.text}</RawHtml>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <div style={{ textAlign: 'end' }}>
                  <Button
                    variant="contained"
                    className={classes.onlyButton}
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      this.onClose(true);
                    }}
                  >
                    {locale.common.privacyMessage.onlyNecessary}
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.okButton}
                    onClick={(e: any) => {
                      e.preventDefault();
                      e.stopPropagation();
                      this.onClose();
                    }}
                  >
                    {locale.common.privacyMessage.accept}
                  </Button>
                </div>
              </Grid>
            </Grid>
          }
        />
      </Snackbar>
    );
  }

  private onClose(onlyNecessary: boolean = false): void {
    this.setState({ isOpen: false });
    storageService.set('privacyShown', 'true');

    if (onlyNecessary) {
      storageService.set(COOKIE_ONLY_NECESSARY, 'true');
      GoogleAnalyticsService.disable('app.my-old-startups-domain.de');
    }
  }
}

export const PrivacyBar = withStyles(styles)(_PrivacyBar);

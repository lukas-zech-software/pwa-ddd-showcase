import {
  Button,
  createStyles,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                from '@material-ui/core';
import { authenticationService } from '@my-old-startup/frontend-common/services/AuthenticationService';
import * as React                from 'react';
import { locale }                from '../common/locales';

const styles = (theme: Theme) => createStyles(
  {
    background:          {
      top:                            0,
      position:                       'absolute',
      height:                         '100vh',
      width:                          '100vw',
      // eslint-disable-next-line @typescript-eslint/tslint/config
      backgroundImage:                'url("https://storage.googleapis.com/static.my-old-startups-domain.de/images/login_background.jpg?v=3")',
      backgroundPosition:             'center',
      backgroundRepeat:               'no-repeat',
      backgroundSize:                 'cover',
      [theme.breakpoints.down('sm')]: {
        backgroundImage: 'url("https://storage.googleapis.com/static.my-old-startups-domain.de/images/login_background_sm.jpg?v=3")',
      },
    },
    button:              {
      width:     '100%',
      marginTop: theme.spacing(2),
    },
    buttonBackground:    {
      width:     '220px',
      margin:    '0 auto',
      marginTop: '40vh',
    },
    smallLink:           {
      fontSize:    '0.65rem',
      margin:      `0 ${theme.spacing(1)}px`,
      '&:visited': {
        color: 'inherit',
      },
    },
    legalLinksContainer: {
      position: 'absolute',
      bottom:   0,
      right:    0,
    },
    positionContainer:   {
      position: 'relative',
    },
    logoLinkContainer:   {
      width:           '100%',
      height:          200,
      top:             -200,
      position:        'absolute',
      cursor:          'pointer',
      zIndex:1000,
    },
  },
);

type Props = WithStyles<typeof styles>;

class _Login extends React.Component<Props> {
  public render(): JSX.Element {
    const { classes } = this.props;

    return (
      <>
        <div className={classes.background}>
          <div className={classes.buttonBackground}>
            <Grid container spacing={3}>
              <Grid item xs>
                <div className={classes.positionContainer}>
                  <div className={classes.logoLinkContainer} onClick={()=>window.location.assign('https://my-old-startups-domain.de')} />
                </div>
                <Button color="secondary"
                        variant="contained"
                        className={classes.button}
                        onClick={() => authenticationService.authorize()}
                        aria-label={locale.dashboard.menuItems.header.login}>
                  <Typography variant="h6">
                    {locale.dashboard.menuItems.header.login}
                  </Typography>
                </Button>
              </Grid>

              <Grid item xs>
                <Button color="primary"
                        variant="contained"
                        className={classes.button}
                        onClick={() => authenticationService.signUp()}
                        aria-label={locale.dashboard.menuItems.header.signUp}>
                  <Typography variant="h6">
                    {locale.dashboard.menuItems.header.signUp}
                  </Typography>
                </Button>
              </Grid>
            </Grid>
          </div>
        </div>


        <div className={classes.legalLinksContainer}>
          <Typography variant="overline">
            <a className={classes.smallLink} href="https://www.my-old-startups-domain.de/datenschutz/"
               target="_blank" rel="noopener noreferrer" >{locale.dashboard.menuItems.privacy}</a>
          </Typography>
          <Typography variant="overline">
            <a className={classes.smallLink} href="https://www.my-old-startups-domain.de/impressum/"
               target="_blank" rel="noopener noreferrer">{locale.dashboard.menuItems.legal}</a>
          </Typography>
          <Typography variant="overline">
            <a className={classes.smallLink} href="https://my-old-startups-domain.de/agb-anbieter/"
               target="_blank" rel="noopener noreferrer">{locale.dashboard.menuItems.terms}</a>
          </Typography>
        </div>
      </>
    );
  }
}

export const Login = withStyles(styles)(_Login);

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                 from '@material-ui/core';
import { GlobalMessageContainer } from '@my-old-startup/frontend-common/components/growl/GlobalMessageContainer';
import { DashboardRoutes }        from '@my-old-startup/frontend-common/routes';
import { authenticationService }  from '@my-old-startup/frontend-common/services/AuthenticationService';
import { globalMessageService }   from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { logService }             from '@my-old-startup/frontend-common/services/LogService';
import { centerCard }             from '@my-old-startup/frontend-common/style';
import * as React                 from 'react';
import { CardMediaFix }           from '../../../common/fixes/CardMediaFix';
import { locale }                 from '../common/locales';
import { userFacade }             from '../facade/UserFacade';
import { routeService }           from '../services/CdbRouteService';

const styles = (theme: Theme) => createStyles({
                                                buttonLink: {
                                                  textDecoration: 'none',
                                                  color:          theme.palette.text.primary,
                                                },
                                                card:       {
                                                  ...centerCard(theme),
                                                },
                                              });

type Props = WithStyles<typeof styles>;

function _EmailNotVerified(props: Props): JSX.Element {
  const { classes } = props;

  return (
    <Card className={classes.card}>
      <CardMediaFix
        image="https://storage.googleapis.com/static.my-old-startups-domain.de/images/validate_email.jpg"
        title="Validate Email"
      />
      <CardHeader title={locale.common.error.emailNotVerified.header}/>
      <CardContent>
        <Typography gutterBottom variant="body1">
          {locale.common.error.emailNotVerified.body}
          <br/>
          <br/>
          {locale.common.error.emailNotVerified.bodyResend}
        </Typography>
      </CardContent>
      <CardActions>
        <Button variant="contained" size="medium" color="primary" onClick={async () => {
          try {
            // make sure the user is logged out and can login after verification

            await userFacade.resendVerificationEmail();
            globalMessageService.pushMessage({
              message: locale.common.error.emailNotVerified.resendSuccess,
              variant: 'success',
            });

            authenticationService.logOut();
            routeService.routeTo(DashboardRoutes.Login);
          } catch (error) {
            logService.error('ResendVerificationMail', error);
            globalMessageService.pushMessage({
                                               message: locale.common.error.emailNotVerified.resendFailed,
                                               variant: 'error',
                                             });
            authenticationService.logOutHard();
          }
        }}>
          {locale.common.error.emailNotVerified.button}
        </Button>
        <Button variant="contained" size="medium" color="default" onClick={() => {
          authenticationService.logOut();
          authenticationService.authorize();
        }}>
          {locale.common.error.retry}
        </Button>
        <Button variant="contained" size="medium" color="default">
          <a className={classes.buttonLink} href="mailto:support@my-old-startups-domain.de">
            {locale.common.error.contactSupport}
          </a>
        </Button>
      </CardActions>
      <GlobalMessageContainer/>
    </Card>
  );
}

export const EmailNotVerified = withStyles(styles)(_EmailNotVerified);

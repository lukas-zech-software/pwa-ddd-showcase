import {
  Button,
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
}                                from '@material-ui/core';
import { authenticationService } from '@my-old-startup/frontend-common/services/AuthenticationService';
import * as React                from 'react';
import { locale }                from '../common/locales';

const styles = (theme: Theme) => createStyles({
  container: {
    display:  'flex',
    flexWrap: 'wrap',
  },
  card: {
    margin:                         '5% auto',
    maxWidth:                       '793px',
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  },
  media: {
    height: '297px',
  },
  actions: {
    flexDirection: 'row-reverse',
  },
});

type Props = WithStyles<typeof styles>;

export const Login = withStyles(styles)(
  class Login extends React.Component<Props> {
    public render(): JSX.Element {
      const { classes } = this.props;
      return (
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image="https://storage.googleapis.com/static.my-old-startups-domain.de/images/mail_background.jpg"
            title="Login Background"
          />
          <CardHeader title={locale.login.header}/>
          <CardActions className={classes.actions}>
            <Button color="primary"
                    variant="contained"
                    onClick={() => this.register()}
                    aria-label={locale.login.buttons.register}>
              {locale.login.buttons.register}
            </Button>
          </CardActions>
        </Card>

      );
    }

    private register(): void {
      authenticationService.authorize();
    }
  },
);

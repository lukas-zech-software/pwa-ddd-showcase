import { Button, Card, CardActions, CardHeader, createStyles, Theme, withStyles, WithStyles } from '@material-ui/core';
import { green }
  from '@material-ui/core/colors';
import { authenticationService } from '@my-old-startup/frontend-common/services/AuthenticationService';
import { centerCard }            from '@my-old-startup/frontend-common/style';
import * as React                from 'react';
import { locale }                from '../../common/locales';

const styles = (theme: Theme) => createStyles({
  container: {
    display:  'flex',
    flexWrap: 'wrap',
  },
  card: {
    ...centerCard(theme),
  },
  actions: {
    flexDirection: 'row-reverse',
  },
  avatar: {
    backgroundColor: green[500],
  },
});

type Props = WithStyles<typeof styles>;

export const RegistrationIntro = withStyles(styles)(
  class RegistrationIntro extends React.Component<Props> {
    public render(): JSX.Element {
      const { classes } = this.props;
      return (
        <Card className={classes.card}>
          <CardHeader title={locale.registrationIntro.header}/>
          <CardActions className={classes.actions}>
            <Button color="primary"
                    variant="contained"
                    onClick={() => this.register()}
                    aria-label={locale.registrationIntro.buttons.login}>
              {locale.registrationIntro.buttons.login}
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

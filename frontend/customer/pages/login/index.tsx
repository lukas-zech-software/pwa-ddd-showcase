import {
  Button,
  Card,
  CardActions,
  CardHeader,
  createStyles,
  Grid,
  TextField,
  Theme,
  withStyles,
  WithStyles,
}                                 from '@material-ui/core';
import CardContent                from '@material-ui/core/CardContent';
import { GoogleAnalyticsService } from '@my-old-startup/frontend-common/services/GoogleAnalyticsService';
import { centerCard }             from '@my-old-startup/frontend-common/style';
import * as React                 from 'react';

const styles = (theme: Theme) => createStyles({
  card: {
    ...centerCard(theme),
    width: '25%',
  },

});

type State = {
  username: string;
  password: string;
  error?: boolean;
};

class LoginPage extends React.Component<WithStyles<typeof styles>, State> {

  public constructor(props: any) {
    super(props);
    this.state = {
      username: '',
      password: '',
    };
  }

  public render(): React.ReactNode {
    const { classes }                   = this.props;
    const { username, password, error } = this.state;

    const isDisabled = GoogleAnalyticsService.isAnalyticsDisabled();
    const gaLabel = isDisabled ? 'Disabled' : 'Enabled';

    return (

      <Card className={classes.card}>
        <CardHeader title="Login"/>
        <CardContent>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={error}
                label="Username"
                value={username}
                onChange={e => this.setState({ username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                error={error}
                label="Password"
                value={password}
                onChange={e => this.setState({ password: e.target.value })}
              />
            </Grid>
          </Grid>
        </CardContent>

        <CardActions>
          <Button variant="contained" color="primary" onClick={() => this.login()}>
            Login
          </Button>

          <Button disabled={isDisabled} variant="contained" color="secondary" onClick={() => void 0}>
            GA is {gaLabel}
          </Button>
        </CardActions>
      </Card>
    );
  }

  private login(): void {
    const { username, password } = this.state;

    if (username === 'my-old-startups-domain') {
      if (password === 'disableGA') {
        GoogleAnalyticsService.disable('app.my-old-startups-domain.de');
        this.setState({ error: false });
        alert('GA disabled');
      }
    } else {
      this.setState({ error: true });
    }
  }
}

export default withStyles(styles)(LoginPage);

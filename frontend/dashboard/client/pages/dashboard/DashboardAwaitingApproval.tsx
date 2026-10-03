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
}                       from '@material-ui/core';
import { centerCard }   from '@my-old-startup/frontend-common/style';
import * as React       from 'react';
import { CardMediaFix } from '../../../../common/fixes/CardMediaFix';
import { locale }       from '../../common/locales';

const styles = (theme: Theme) => createStyles({
  avatarIcon: {
    color:    theme.palette.primary.main,
    fontSize: 48,
  },
  title: {
    fontSize: theme.typography.h5.fontSize,
  },
  button: {
    backgroundColor: theme.palette.grey[300],
  },
  buttonLink: {
    textDecoration: 'none',
    color:          'inherit',
  },
  card: {
    ...centerCard(theme),
  },
});

type Props = WithStyles<typeof styles> & {
  header: string;
  text: string;
};

export const DashboardAwaitingApproval = withStyles(styles)(
  class DashboardAwaitingApproval extends React.Component<Props> {

    public render(): JSX.Element {
      const { classes, text, header } = this.props;

      return (
        <Card className={classes.card}>
          <CardMediaFix
            image="https://storage.googleapis.com/static.my-old-startups-domain.de/images/awaiting_approval.jpg"
            title={header}
          />
          <CardHeader
            classes={{ title: classes.title }}
            title={header}
          />
          <CardContent>
            <Typography gutterBottom variant="subtitle1" component={'h2' as any}
                        dangerouslySetInnerHTML={{ __html: text }}>

            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" variant="contained" color="primary" onClick={() => window.location.reload()}>
              {locale.common.error.retry}
            </Button>
            <Button size="small" variant="contained" className={classes.button}>
              <a className={classes.buttonLink} href="mailto:support@my-old-startups-domain.de">
                {locale.common.error.contactSupport}
              </a>
            </Button>
          </CardActions>
        </Card>
      );
    }
  },
);

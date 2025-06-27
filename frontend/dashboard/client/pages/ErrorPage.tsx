import {
  Button,
  Card,
  CardActions,
  CardContent,
  Collapse,
  createStyles,
  IconButton,
  Theme,
  Typography,
  withStyles,
  WithStyles,
} from '@material-ui/core';

import ExpandMoreIcon      from '@material-ui/icons/ExpandMore';
import { HttpStatusCode }  from '@my-old-startup/common/http/HttpStatusCode';
import { DashboardRoutes } from '@my-old-startup/frontend-common/routes';
import { logService }      from '@my-old-startup/frontend-common/services/LogService';
import { centerCard }      from '@my-old-startup/frontend-common/style';
import clsx                from 'clsx';
import * as React          from 'react';
import { Redirect }        from 'react-router';
import { CardMediaFix }    from '../../../common/fixes/CardMediaFix';
import { locale }          from '../common/locales';

const styles = (theme: Theme) => createStyles({
  buttonLink: {
    textDecoration: 'none',
    color:          'inherit',
  },
  card: {
    ...centerCard(theme),
  },
  media: {
    // ⚠️ object-fit is not supported by IE11.
    objectFit: 'cover',
  },
  expand: {
    transform:  'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft:                   'auto',
    [theme.breakpoints.up('sm')]: {
      marginRight: -8,
    },
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

type Props = WithStyles<typeof styles>;

type State = {
  expanded: boolean;
};

class _ErrorPage extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = { expanded: false };
  }

  public render(): JSX.Element {
    const { classes } = this.props;

    const lastError = logService.getLastError();
    if (lastError && lastError.statusCode === HttpStatusCode.NOT_AUTHORIZED) {
      return <Redirect to={DashboardRoutes.Login}/>;
    }

    return (
      <Card className={classes.card}>
        <CardMediaFix
          className={classes.media}
          image="https://storage.googleapis.com/static.my-old-startups-domain.de/images/error.jpg"
          title="Technical problems"
        />
        {lastError && <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph variant="h6">
              Error details:
            </Typography>
            <Typography paragraph variant="subtitle1">
              {lastError.message}
            </Typography>
            <Typography paragraph>
              {JSON.stringify(lastError.details)}
            </Typography>
          </CardContent>
        </Collapse>}
        <CardActions disableSpacing={false}>
          <Button size="small" color="primary" variant="contained">
            <a className={classes.buttonLink} href="/">
              {locale.common.error.restart}
            </a>
          </Button>
          <Button size="small" variant="contained">
            <a className={classes.buttonLink} href="mailto:support@my-old-startups-domain.de">
              {locale.common.error.contactSupport}
            </a>
          </Button>
          {lastError && (
            <IconButton
              className={clsx(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={() => this.toggleDetails()}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon/>
            </IconButton>
          )}
        </CardActions>
      </Card>
    );
  }

  private toggleDetails(): void {
    this.setState({ expanded: !this.state.expanded });
  }
}

export const ErrorPage = withStyles(styles)(_ErrorPage);

import {
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  createStyles,
  IconButton,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                     from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { logService } from '@my-old-startup/frontend-common/services/LogService';
import clsx           from 'clsx';
import * as React     from 'react';
import { locale }     from '../common/locales';

const styles = (theme: Theme) => createStyles({
  buttonLink: {
    textDecoration: 'none',
  },
  card: {
    margin:                         '5% auto',
    maxWidth:                       '1200px',
      width: '60%',
    [theme.breakpoints.down('md')]: {
      width: '90%',
    },
  },
  media: {
    objectFit: 'cover',
    height:    '800px',
  },
  expand: {
    transform:  'rotate(0deg)',
    transition: theme.transitions.create(
      'transform',
      {
        duration: theme.transitions.duration.shortest,
      },
    ),
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

export const ErrorPage = withStyles(styles)(
  class ErrorPage extends React.Component<Props, State> {

    constructor(props: Props) {
      super(props);
      this.state = { expanded: false };
    }

    public render(): JSX.Element {
      const { classes } = this.props;

      const lastError = logService.getLastError();

      return (
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image="https://storage.googleapis.com/static.my-old-startups-domain.de/images/error.jpg"
            title="Technical problems"
          />
          <CardContent>
            <CardActionArea onClick={() => this.toggleDetails()}>
              <Typography gutterBottom variant="h5" component={'h2' as any}>
                {locale.common.error.defaultErrorMessage}
              </Typography>
            </CardActionArea>
            {lastError && <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph variant="h6">
                  Details:
                </Typography>
                <Typography paragraph variant="subtitle1">
                  {lastError.message}
                </Typography>
                <Typography paragraph>
                  {JSON.stringify(lastError.details)}
                </Typography>
              </CardContent>
            </Collapse>}
          </CardContent>
          <CardActions>
            <Button size="small" color="primary">
              <a className={classes.buttonLink} href="/">
                {locale.common.error.restart}
              </a>
            </Button>
            <Button size="small" color="primary">
              <a className={classes.buttonLink} href="mailto:info@my-old-startups-domain.de">
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
  },
);

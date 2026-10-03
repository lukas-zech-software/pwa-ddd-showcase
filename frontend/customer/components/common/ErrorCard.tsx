import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
  makeStyles,
  Theme,
  Typography,
}                          from '@material-ui/core';
import ExpandMoreIcon      from '@material-ui/icons/ExpandMore';
import { logService }      from '@my-old-startup/frontend-common/services/LogService';
import clsx                from 'clsx';
import React, { useState } from 'react';
import { locale }          from '../../common/locales';

const useStyles = makeStyles((theme: Theme) => ({
  card:       {
    margin:                         `${theme.spacing(2)}px auto`,
    width:                          '60%',
    marginBottom:200,
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
  },
  media:      {
    height:     0,
    paddingTop: '66.67%',
  },
  buttonLink: {
    textDecoration: 'none',
  },
  expand:     {
    transform:                    'rotate(0deg)',
    transition:                   theme.transitions.create('transform', {
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
}));


export const ErrorCard: React.FC = () => {
  const classes   = useStyles();
  const lastError = logService.getLastError();

  const [expanded, setExpanded] = useState(false);

  return (
    <Card className={classes.card}>
      <CardMedia className={classes.media}
                 image="https://storage.googleapis.com/static.my-old-startups-domain.de/images/error.jpg"
                 title={locale.error.page.header}
      />

      <CardContent>
        <Typography gutterBottom variant="h5" component={'h2' as any}>
          {locale.error.page.header}
        </Typography>
      </CardContent>

      <CardContent>
        {lastError && <Collapse in={expanded} timeout="auto" unmountOnExit>
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
      </CardContent>
      <CardActions>
        <Button size="small" color="primary">
          <a className={classes.buttonLink} href="/">
            {locale.error.page.restart}
          </a>
        </Button>
        <Button size="small" color="primary">
          <a className={classes.buttonLink} href="mailto:info@my-old-startups-domain.de">
            {locale.error.page.contactSupport}
          </a>
        </Button>
        {lastError && (
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: expanded,
            })}
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="Show more"
          >
            <ExpandMoreIcon/>
          </IconButton>
        )}
      </CardActions>
    </Card>
  );
};

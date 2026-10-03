import {
  Card,
  CardActionArea,
  CardContent,
  CardHeader,
  CardMedia,
  createStyles,
  Fab,
  Grid,
  Paper,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                       from '@material-ui/core';
import { Timeline }     from '@material-ui/icons';
import { CDN_BASE_URL } from '@my-old-startup/common/enums/constants';
import { observer }     from 'mobx-react';
import * as React       from 'react';
import { dealStore }    from '../stores/DealStore';
import { fullHeight }   from '../styles/common';
import { FormTooltip }  from './FormTooltip';
import { locale }       from './locales';

const styles = (theme: Theme) => createStyles({
  card:        fullHeight,
  description: {
    fontWeight: 'lighter',
  },
  media: {
    height: theme.spacing(22),
  },
  extendedIcon: {
    marginRight: theme.spacing(1),
  },
  opaqueContainerGrid: {
    position:    'relative',
    alignItems:  'center',
    paddingLeft: theme.spacing(2),
    top:         theme.spacing(-2),
  },
  opaqueImpressionsPaper: {
    marginTop:       theme.spacing(-1),
    color:           'black',
    backgroundColor: 'white',
    padding:         theme.spacing(1),
    lineHeight:      .7,
  },
  opaqueImpressionsText: {
    fontSize: theme.typography.pxToRem(14),
  },
  title: {
    fontWeight: 'lighter',
  },
  subHeader: {
    fontSize: '1.2em',
  },
});

type Props = WithStyles<typeof styles>;

const _NoDealsCard: React.FC<Props> = ({ classes }) => (
  <Card className={classes.card}>
    <CardHeader subheader={(
      <>
        {locale.dashboard.cards.hotDeal.header}
        <FormTooltip inline title={locale.dashboard.cards.hotDeal.tooltip}/>
      </>
    )}
    />
    <CardHeader subheader={locale.dashboard.cards.hotDeal.noDeals}/>
    <CardContent>
      <Typography variant="body2" className={classes.title}>
        {locale.dashboard.cards.hotDeal.testTitle}
      </Typography>
    </CardContent>
  </Card>
);

const _HotDealCard: React.FC<Props> = observer(({ classes }) => {
  const deal = dealStore.hotDeal;

  if (deal === null || deal === undefined) {
    return (
      <NoDealsCard classes={classes}/>
    );
  }

  return (
    <Card className={classes.card}>
      <CardHeader
        classes={{ subheader: classes.subHeader }}
        subheader={(
          <>
            {locale.dashboard.cards.hotDeal.header}
            <FormTooltip inline title={locale.dashboard.cards.hotDeal.tooltip}/>
          </>
        )}
        action={
          <Fab variant="extended" size="small">
            <Timeline className={classes.extendedIcon}/>
            Analytics
          </Fab>
        }
      />
      <CardActionArea>
        <CardMedia className={classes.media}
                   image={CDN_BASE_URL + deal.image || '/static/img/deal.png'}
                   title={deal.description.title}
        />
        <Grid container justify="space-between" className={classes.opaqueContainerGrid}>
          <Grid item xs={false}>
            <Paper className={classes.opaqueImpressionsPaper}>
              <Typography variant="h6" className={classes.opaqueImpressionsText}>
                600+ Ansichten!
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        <CardContent>
          <Typography variant="body2" className={classes.title}>
            {locale.dashboard.cards.hotDeal.testTitle}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
});

export const NoDealsCard = withStyles(styles)(_NoDealsCard);
export const HotDealCard = withStyles(styles)(_HotDealCard);

import {
  Card,
  CardActionArea,
  CardHeader,
  createStyles,
  Grid,
  Theme,
  WithStyles,
  withStyles,
}                               from '@material-ui/core';
import { GridSpacing }          from '@material-ui/core/Grid';
import { DateFilter }           from '@my-old-startup/common/enums';
import { CUSTOMER_DEAL_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';
import { calculateDistance }    from '@my-old-startup/common/utils/geoUtils';
import { useWidth }             from '@my-old-startup/frontend-common/utils/hooks';
import clsx                     from 'clsx';
import Head                     from 'next/head';
import Router                   from 'next/router';
import * as React               from 'react';
import { IApiCompany }          from '../../../../common/interfaces';
import { locale }               from '../../common/locales';
import { filterStore }          from '../../store/FilterStore';
import { locationStore }        from '../../store/LocationStore';
import { SearchStore }          from '../../store/SearchStore';
import {
  getInnerHeight,
  MuiButtonContainedSecondary,
}                               from '../../styles/theme';
import { DealListCard }         from '../deal/DealListCard';

const styles = (theme: Theme) => createStyles(
  {
    dateCard:   {
      ...MuiButtonContainedSecondary,
      cursor:       'pointer',
      marginTop:    theme.spacing(1),
      marginLeft:   theme.spacing(2),
      marginRight:  theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    dateHeader: {
      textAlign: 'center',
    },
    mdGrid:     {
      padding: theme.spacing(1),
    },
    root:       {
      'paddingTop': theme.spacing(2),
      'maxWidth':   1200,
      'margin':     '0 auto',
      'height':     '100%',
      '&.empty':    {
        height: getInnerHeight(theme),
      },
    },
  },
);

function filterForDate(date: DateFilter): void {
  filterStore.setDate(date);
  void filterStore.apply();
}

function getDateFilter(backward: boolean, props: Props): React.ReactNode {
  const { classes } = props;

  let cardSettings = {
    onClick:   () => filterForDate(DateFilter.TOMORROW),
    header:    locale.listView.filter.today.header,
    subheader: locale.listView.filter.today.subheader,
  };

  if (filterStore.filter.date === DateFilter.TOMORROW) {
    cardSettings = {
      onClick:   () => filterForDate(DateFilter.REST_OF_WEEK),
      header:    locale.listView.filter.tomorrow.header,
      subheader: locale.listView.filter.tomorrow.subheader,
    };
  }

  if (filterStore.filter.date === DateFilter.REST_OF_WEEK) {
    cardSettings = {
      onClick:   () => void Router.push(CUSTOMER_DEAL_ROUTES.filterViewPath),
      header:    locale.listView.filter.wholeWeek.header,
      subheader: locale.listView.filter.wholeWeek.subheader,
    };
  }

  if (backward === true) {
    cardSettings = {
      onClick:   () => filterForDate(DateFilter.TODAY),
      header:    locale.listView.filter.backToToday.header,
      subheader: locale.listView.filter.backToToday.subheader,
    };
  }

  return (
    <Card className={classes.dateCard}>
      <CardActionArea onClick={() => cardSettings.onClick()}>
        <CardHeader
          className={classes.dateHeader}
          title={cardSettings.header}
          subheader={cardSettings.subheader}
        />
      </CardActionArea>
    </Card>
  );
}

type Props = {
  searchStore: SearchStore;
} & WithStyles<typeof styles>;

const _DealListView: React.FC<Props> = (props: Props) => {
  const { searchStore, classes } = props;
  const searchResults            = searchStore.currentDealResults.filter(x => x.deal.type !== 4 && x.deal.type !== 5);
  const isUneven                 = searchResults.length % 2 !== 0;
  const isToday                  = filterStore.filter.date === DateFilter.TODAY;
  const empty                    = searchResults.length === 0;
  const width                    = useWidth();

  let spacing: GridSpacing = 0;
  const isTablet           = width !== 'xs';
  if (isTablet) {
    spacing = 2;
  }

  const metaTitle = `my-old-startups-domain.de | Entdecke Neuheiten, Deals und Märkte in ${locationStore.location.city}`;

  return (
    <>
      <Head>
        <title>
          {metaTitle}
        </title>
        <meta name="og:title" property="og:title" content={metaTitle}/>
        <meta name="description" content={`Aktuelle Deals in ${locationStore.location.city}`}/>
        <meta name="og:description" property="og:description"
              content={`Aktuelle Deals in ${locationStore.location.city}`}/>
      </Head>

      <Grid container spacing={spacing} alignContent="center"
            className={clsx(classes.root, {
              [classes.mdGrid]: isTablet,
              empty,
            })}>
        {searchResults.map((result, i) => {
          let dealDistance = result.distance;

          if (result.deal.location !== undefined) {
            dealDistance = calculateDistance(result.deal.location.location, locationStore.location.coordinates);
          }

          return (
            <Grid item xs={12} sm={6} key={i}>
              <DealListCard
                deal={result.deal}
                company={result.company as IApiCompany}
                distance={dealDistance}
              />
            </Grid>
          );
        })}

        {isUneven && (
          <Grid item xs={6}/>
        )}

        {!isToday && (
          <Grid item xs={12} sm={6}>
            {getDateFilter(true, props)}
          </Grid>
        )}

        <Grid item xs={12} sm={isToday ? 12 : 6}>
          {getDateFilter(false, props)}
        </Grid>
      </Grid>
    </>
  );
};

export const DealListView = (withStyles(styles)(_DealListView));

import { Button }                   from '@material-ui/core';
import Avatar                       from '@material-ui/core/Avatar';
import Card                         from '@material-ui/core/Card';
import CardActions                  from '@material-ui/core/CardActions';
import CardHeader                   from '@material-ui/core/CardHeader';
import red                          from '@material-ui/core/colors/red';
import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
}                                   from '@material-ui/core/styles';
import { Close }                    from '@material-ui/icons';
import { CUSTOMER_DEAL_ROUTES }     from '@my-old-startup/common/routes/FrontendRoutes';
import Router                       from 'next/router';
import * as React                   from 'react';
import { DateFilter }               from '../../../../common/enums';
import { noDealsFoundEvent }        from '../../common/GAEvent';
import { locale }                   from '../../common/locales';
import { customerAnalyticsService } from '../../services/customerAnalyticsService';
import { searchService }            from '../../services/SearchService';
import { filterStore }              from '../../store/FilterStore';
import { locationStore }            from '../../store/LocationStore';
import { searchStore }              from '../../store/SearchStore';

const styles = (theme: Theme) => createStyles(
  {
    card:         {
    },
    media:        {
      height: 84,
    },
    actions:      {
      width: '100%',
    },
    expand:       {
      transform:  'rotate(0deg)',
      marginLeft: 'auto',
      transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen:   {
      transform: 'rotate(180deg)',
    },
    close:        {
      color:           theme.palette.text.primary,
      height:          30,
      width:           30,
      borderRadius:    0,
      backgroundColor: 'transparent',
      cursor:          'pointer',
    },
    avatar:       {
      backgroundColor: red[500],
      position:        'relative',
      top:             theme.spacing(-1),
    },
    filterButton: {
      'width': '100%',
      '& a':   {
        textDecoration: 'none',
        color:          'inherit',
      },
    },
    subheader:    {
      marginTop: theme.spacing(1),
      fontSize:  '0.85rem',
    },
  },
);

type Props = {
  isEmptyDeals: boolean;
  onClose(): void;
};

type State = {};

class _EmptyCardSuggestion extends React.Component<Props & WithStyles<typeof styles>, State> {
  public componentDidMount(): void {
    const location = locationStore.location;
    const filter   = filterStore.filter;

    const gaEvent = noDealsFoundEvent(
      {
        location,
        filter,
      },
    );
    customerAnalyticsService.trackEvent(gaEvent);
  }

  public render(): React.ReactNode {
    const { classes, isEmptyDeals } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          action={
            <Avatar className={classes.close} onClick={this.props.onClose}>
              <Close/>
            </Avatar>
          }
          title={locale.search.noResults}
          subheader={isEmptyDeals ? locale.search.noDealResultsBody : locale.search.noResultsBody}
          classes={{ subheader: classes.subheader }}
        />
        <CardActions className={classes.actions}>
          {isEmptyDeals ? (
            <>
              {filterStore.filter.date !== DateFilter.TOMORROW && (
                <Button color="primary" variant="contained" className={classes.filterButton}
                        onClick={() => this.filterDate(DateFilter.TOMORROW)}>
                  {locale.common.dateFilter[DateFilter.TOMORROW]}
                </Button>
              )}
              {filterStore.filter.date !== DateFilter.REST_OF_WEEK && filterStore.filter.date !== DateFilter.TODAY && (
                <>
                  <Button color="primary" variant="contained" className={classes.filterButton}
                          onClick={() => this.filterDate(DateFilter.REST_OF_WEEK)}>
                    {locale.common.dateFilter[DateFilter.REST_OF_WEEK]}
                  </Button>

                  <Button color="primary" variant="contained" className={classes.filterButton}
                          onClick={() => Router.push(CUSTOMER_DEAL_ROUTES.filterViewPath)}>
                    {locale.drawer.items.filter}
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button color="primary" variant="contained" className={classes.filterButton}
                      onClick={() => this.filterCologne()}>
                {locale.common.cologne}
              </Button>
              <Button color="primary" variant="contained" className={classes.filterButton}
                      onClick={() => Router.push(CUSTOMER_DEAL_ROUTES.filterViewPath)}>
                {locale.drawer.items.filter}
              </Button>
            </>
          )}
        </CardActions>
      </Card>
    );
  }

  /**
   * Sets the filter to default and the location to Cologne, and routes to the list view
   */
  private filterCologne(): void {
    void searchService.searchByText('Köln');
  }

  /**
   * Sets the filter to default and the location to Cologne, and routes to the list view
   */
  private filterDate(date: DateFilter): void {
    filterStore.setDate(date);
    void filterStore.apply();
  }
}

export const EmptyCardSuggestion = withStyles(styles)(_EmptyCardSuggestion);

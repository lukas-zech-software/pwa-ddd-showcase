import { Button }                   from '@material-ui/core';
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
import Router                       from 'next/router';
import * as React                   from 'react';
import { CUSTOMER_COMPANY_ROUTES }  from '../../../../common/routes/FrontendRoutes';
import { noDealsFoundEvent }        from '../../common/GAEvent';
import { locale }                   from '../../common/locales';
import { customerAnalyticsService } from '../../services/customerAnalyticsService';
import { searchService }            from '../../services/SearchService';
import { filterStore }              from '../../store/FilterStore';
import { locationStore }            from '../../store/LocationStore';
import { searchStore }              from '../../store/SearchStore';

const styles = (theme: Theme) => createStyles(
  {
    card:         {},
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
};

type State = {};

class _EmptyCardCorona extends React.Component<Props & WithStyles<typeof styles>, State> {
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
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          title={locale.search.noResults}
          subheader={locale.search.noResultsBodyCorona}
          classes={{ subheader: classes.subheader }}
        />
        <CardActions className={classes.actions}>
          <Button color="primary" variant="contained" className={classes.filterButton}
                  onClick={() => {
                    filterStore.reset();
                    searchStore.resetCoronaFilter();
                    void searchService.searchByText('NRW');
                    Router.push(CUSTOMER_COMPANY_ROUTES.companyMapViewPath);
                  }}>
            {locale.search.suggestions.nrw}
          </Button>
        </CardActions>
      </Card>
    );
  }

}

export const EmptyCardCorona = withStyles(styles)(_EmptyCardCorona);

import { createStyles, Grid, Theme, WithStyles, withStyles } from '@material-ui/core';
import { GridSpacing }                                       from '@material-ui/core/Grid';
import { useWidth }                                          from '@my-old-startup/frontend-common/utils/hooks';
import clsx                                                  from 'clsx';
import * as React                                            from 'react';
import { SearchStore }                                       from '../../store/SearchStore';
import { getInnerHeight }                                    from '../../styles/theme';
import { MarketListCard }                                   from '../market/MarketListCard';
import { MarketMetaData }                                   from '../market/MarketMetaData';

const styles = (theme: Theme) => createStyles({
  dateCard: {
    cursor:          'pointer',
    backgroundImage: `linear-gradient(to bottom right, ${theme.palette.secondary.main}, ${theme.palette.primary.main})`,
    marginTop:       theme.spacing(1),
    marginLeft:      theme.spacing(2),
    marginRight:     theme.spacing(2),
    marginBottom:    theme.spacing(2),
  },
  dateHeader: {
    textAlign: 'center',
  },
  mdGrid: {
    padding: theme.spacing(1),
  },
  root: {
    'paddingTop': theme.spacing(2),
    'maxWidth':   1200,
    'margin':     '0 auto',
    'height':     '100%',
    '&.empty':    {
      height: getInnerHeight(theme),
    },
  },
});

type Props = {
  searchStore: SearchStore;
} & WithStyles<typeof styles>;

const _MarketListView: React.FC<Props> = (props: Props) => {
  const { searchStore, classes } = props;
  const searchResults = searchStore.currentMarketResults;
  const empty = searchResults.length === 0;
  const width = useWidth();

  let spacing: GridSpacing = 0;
  const isTablet = width !== 'xs';
  if (isTablet) {
    spacing = 2;
  }

  return (
    <Grid container spacing={spacing} alignContent="center"
          className={clsx(classes.root, { [classes.mdGrid]: isTablet, empty })}>
      {searchResults.map((market, i) => (
        <Grid item xs={12} sm={6} key={i}>
          <MarketListCard market={market} distance={0}/>
          <MarketMetaData market={market}/>
        </Grid>
      ))}
    </Grid>
  );
};

export const MarketListView = (withStyles(styles)(_MarketListView));

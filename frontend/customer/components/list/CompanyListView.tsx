import {
  createStyles,
  Grid,
  Theme,
  withStyles,
  WithStyles,
}                           from '@material-ui/core';
import { GridSpacing }      from '@material-ui/core/Grid';
import { Loading }          from '@my-old-startup/frontend-common/components';
import { useWidth }         from '@my-old-startup/frontend-common/utils/hooks';
import clsx                 from 'clsx';
import { useObserver }      from 'mobx-react';
import * as React           from 'react';
import { useState }         from 'react';
import { SearchStore }      from '../../store/SearchStore';
import { getInnerHeight }   from '../../styles/theme';
import { VisibilitySensor } from '../common/VisibilitySensor';
import { CompanyListCard }  from '../company/CompanyListCard';

const styles = (theme: Theme) => createStyles({
                                                dateCard:   {
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
                                                mdGrid:     {
                                                  padding: theme.spacing(1),
                                                },
                                                root:       {
                                                  'paddingTop':    theme.spacing(2),
                                                  'paddingBottom': theme.spacing(14),
                                                  'maxWidth':      1200,
                                                  'margin':        '0 auto',
                                                  'height':        '100%',
                                                  '&.empty':       {
                                                    height: getInnerHeight(theme),
                                                  },
                                                },
                                                pageButton: {
                                                  margin: theme.spacing(2),
                                                  width:  '40%',
                                                },
                                              });

const PAGE_SIZE = 6;

type Props = {
  searchStore: SearchStore;
} & WithStyles<typeof styles>;

const _CompanyListView: React.FC<Props> = (props: Props) => {
  const { searchStore, classes }  = props;
  const empty                     = searchStore.currentCompanyResults.length === 0;
  const width                     = useWidth();
  const [currentPageEnd, setPage] = useState(PAGE_SIZE);

  let spacing: GridSpacing = 0;
  const isTablet           = width !== 'xs';
  if (isTablet) {
    spacing = 2;
  }

  const endReached   = currentPageEnd >= searchStore.currentCompanyResults.length;
  return useObserver(() => (
    <Grid container spacing={spacing} alignContent="center"
          className={clsx(classes.root, {
            [classes.mdGrid]: isTablet,
            empty,
          })}>

      {searchStore.currentCompanyResults.slice(0, currentPageEnd).map((result, i) => (
        <Grid item xs={12} sm={6} key={i}>
          <CompanyListCard company={result.company}/>
        </Grid>
      ))}

      <Grid item xs={12}>
        {endReached == false && (
          <VisibilitySensor
            delayedCall
            scrollThrottle={250}
            partialVisibility
            active={endReached == false}
            onChange={visible => {
              if (!visible) {
                return;
              }
              setPage(currentPageEnd + PAGE_SIZE);
            }}
          >
            <Loading/>
          </VisibilitySensor>
        )}
      </Grid>
    </Grid>
  ));
};

export const CompanyListView = (withStyles(styles)(_CompanyListView));

import {
  CircularProgress,
  createStyles,
  Grid,
  Theme,
  withStyles,
  WithStyles,
}                             from '@material-ui/core';
import { observer }           from 'mobx-react';
import * as React             from 'react';
import { IApiCompany }        from '../../../../../common/interfaces';
import { CompanySummaryCard } from '../../common/company/CompanySummaryCard';
import { HotDealCard }        from '../../common/HotDealCard';
import { dealStore }          from '../../stores/DealStore';
import { flex }               from '../../styles/common';
import { DealsCalendarCard }  from './calendar/DealsCalendarCard';

const styles = (theme: Theme) => createStyles(
  {
    actions:  {
      flexDirection: 'row-reverse',
    },
    chip:     {
      margin: theme.spacing(1),
    },
    flex:     {
      ...flex,
      flexGrow:   1,
      flexShrink: 1,
    },
    gridItem: {
      width: '100%',
    },
  },
);

type Props = WithStyles<typeof styles> & {
  currentCompany: IApiCompany;
};

@observer
class _Dashboard extends React.Component<Props> {
  public componentDidMount(): void {
    dealStore.fetchAllDeals(this.props.currentCompany);
  }

  public render(): React.ReactNode {
    const { classes } = this.props;

    if (dealStore.allDeals === undefined) {
      return (
        <CircularProgress/>
      );
    }

    const { currentCompany } = this.props;

    return (
      <Grid container alignItems="stretch" spacing={2}>
        <Grid item md={12} lg={6} className={classes.gridItem}>
          <CompanySummaryCard company={currentCompany}/>
        </Grid>
        <Grid item md={12} lg={6} className={classes.gridItem}>
          <HotDealCard/>
        </Grid>
        <Grid item xs={12} className={classes.gridItem}>
          <DealsCalendarCard currentCompany={currentCompany}/>
        </Grid>
      </Grid>
    );
  }
}

export const Dashboard = withStyles(styles)(_Dashboard);

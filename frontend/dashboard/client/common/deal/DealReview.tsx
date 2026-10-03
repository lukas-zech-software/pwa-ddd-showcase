import {
  createStyles,
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                                from '@material-ui/core';
import { ExpandMore }            from '@material-ui/icons';
import { IApiCompany, IApiDeal } from '@my-old-startup/common/interfaces';
import { DashboardRoutes }       from '@my-old-startup/frontend-common/routes';
import * as React                from 'react';
import { routeService }          from '../../services/CdbRouteService';
import { DealDetailPreview }     from './DealDetailPreview';

const styles = (theme: Theme) => createStyles(
  {
    panel:       {
      marginTop: theme.spacing(2),
    },
    detailTable: {
      width: '100%',
    },
    heading:     {
      textAlign: 'left',
      fontSize:  theme.typography.pxToRem(15),
    },
  },
);

type Props = WithStyles<typeof styles> & {
  deal: IApiDeal;
  company: IApiCompany;
};

class _DealReview extends React.PureComponent<Props> {
  public render(): React.ReactNode {
    const { classes, deal, company } = this.props;

    return (
      <ExpansionPanel className={classes.panel}>
        <ExpansionPanelSummary expandIcon={<ExpandMore/>}>
          <Typography variant="subtitle1">Vorschau</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <DealDetailPreview deal={deal} company={company} />
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  }
}

export const DealReview = withStyles(styles)(_DealReview);

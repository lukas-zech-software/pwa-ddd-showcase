import {
  Card,
  CardContent,
  CardHeader,
  createStyles,
  Fab,
  Grid,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                                    from '@material-ui/core';
import { Edit }                      from '@material-ui/icons';
import { IApiCompany }               from '@my-old-startup/common/interfaces';
import { DashboardRoutes }           from '@my-old-startup/frontend-common/routes';
import * as React                    from 'react';
import { routeService }              from '../../services/CdbRouteService';
import { fullHeight }                from '../../styles/common';
import { FormTooltip }               from '../FormTooltip';
import { locale }                    from '../locales';
import { CompanyDealAccountSummary } from './CompanyDealAccountSummary';
import { CompanySummarySidebar }     from './CompanySummarySidebar';

const styles = (theme: Theme) => createStyles({
  card:        fullHeight,
  description: {
    fontWeight:   'lighter',
    paddingRight: theme.spacing(1),
    borderRight:  '1px solid black',
    maxWidth:     420,
    maxHeight:    420,
    wordBreak:    'break-all',

    // TODO: Not cross browser compatible
    overflow:             'hidden',
    display:              '-webkit-box',
    '-webkit-line-clamp': 4,
    '-webkit-box-orient': 'vertical',
  },

  'block_with_text': {
    'white-space': 'pre-wrap',
    'overflow':    'hidden',
    'lineHeight':  '1.5em',
    'height':      '6em',
    'position':    'relative',
    '&:after':     {
      'content':    '""',
      'textAlign':  'right',
      'position':   'absolute',
      'bottom':     '0',
      'right':      '0',
      'width':      '70%',
      'height':     '1.5em',
      'background': 'linear-gradient(to right, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%)',
    },
  },

  summaryCardContent: {
    paddingTop: 0,
  },
  subHeader: {
    fontSize: '1.2em',
  },
});

type Props = WithStyles<typeof styles> & {
  company: IApiCompany;
};

class _CompanySummaryCard extends React.Component<Props> {
  public render(): React.ReactElement {
    const { classes, company } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          classes={{ subheader: classes.subHeader }}
          subheader={(
            <>
              {locale.dashboard.cards.companyInfo.header}
              <FormTooltip inline title={locale.dashboard.cards.companyInfo.tooltip}/>
            </>
          )}
          action={
            <Fab size="small"
                 aria-label="edit"
                 onClick={() => this.editCompany()}
            >
              <Edit/>
            </Fab>
          }
        />
        <CardContent className={classes.summaryCardContent}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h5">{company.contact.title}</Typography>
              <Typography variant="body2" className={classes.block_with_text}>{company.details.description}</Typography>
            </Grid>
            <Grid item xs={6}>
              <CompanySummarySidebar company={company}/>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">{locale.dashboard.cards.companyInfo.dealAccount.header}</Typography>

              <CompanyDealAccountSummary/>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }

  private editCompany(): void {
    routeService.routeTo(
      DashboardRoutes.Restaurant,
      { companyId: this.props.company.id },
    );
  }
}

export const CompanySummaryCard = withStyles(styles)(_CompanySummaryCard);

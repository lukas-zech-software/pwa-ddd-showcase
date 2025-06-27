import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  createStyles,
  Theme,
  withStyles,
  WithStyles,
}                              from '@material-ui/core';
import HistoryIcon             from '@material-ui/icons/History';
import { IApiCompany }         from '@my-old-startup/common/interfaces';
import { DashboardRoutes }     from '@my-old-startup/frontend-common/routes';
import * as React              from 'react';
import { FormTooltip }         from '../../../common/FormTooltip';
import { locale }              from '../../../common/locales';
import { routeService }        from '../../../services/CdbRouteService';
import { fullHeight }          from '../../../styles/common';
import { DealsCalendar }       from './DealsCalendar';
import { DealsCalendarLegend } from './DealsCalendarLegend';

const styles = (theme: Theme) =>
  createStyles({
    cards: {
      marginBottom: theme.spacing(1),
    },
    actions: {
      ...fullHeight,
      flexDirection: 'row-reverse',
    },
    chip: {
      margin: theme.spacing(1),
    },
    subHeader: {
      fontSize: '1.2em',
    },
  });

type Props = WithStyles<typeof styles> & {
  currentCompany: IApiCompany;
};

const _DealsCalendarCard: React.FC<Props> = ({ classes, currentCompany }) => (
    <>
      <Card className={classes.actions}>
        <CardHeader
          classes={{ subheader: classes.subHeader }}
          subheader={
            <>
              {locale.dashboard.cards.dealCalendar.header}
              <FormTooltip
                inline
                title={locale.dashboard.cards.dealCalendar.tooltip}
              />
            </>
          }
          avatar={
            <Avatar>
              <HistoryIcon/>
            </Avatar>
          }
        />

        <CardContent>
          <DealsCalendar/>
        </CardContent>

        <CardContent>
          <DealsCalendarLegend/>
        </CardContent>

        <CardActions className={classes.actions}>
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              routeService.routeTo(DashboardRoutes.Deals, {
                companyId: currentCompany.id,
              })
            }
            aria-label={locale.dashboard.cards.buttons.deals}
          >
            {locale.dashboard.cards.buttons.deals}
          </Button>
        </CardActions>
      </Card>
    </>
);

export const DealsCalendarCard = withStyles(styles)(_DealsCalendarCard);

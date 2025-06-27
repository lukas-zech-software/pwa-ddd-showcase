import { Avatar, Chip, createStyles, Paper, Theme, withStyles, WithStyles } from '@material-ui/core';
import clsx                                                                 from 'clsx';
import * as React                                                           from 'react';
import { locale }                                                           from '../../../common/locales';
import { getDealColors, NotPublishedIcon, PublishedIcon }                   from '../../../styles/common';

const styles = (theme: Theme) => {
  const dealColors = getDealColors(theme);

  const chip = {
    margin: theme.spacing(1),
  };

  return createStyles({
    paper: {
      padding: theme.spacing(1),

    },
    active: {
      ...chip,
      backgroundColor: dealColors.active + ' !important',
    },
    published: {
      ...chip,
      backgroundColor: dealColors.published,
    },
    special: {
      ...chip,
      backgroundColor: dealColors.special,
    },
    notPublished: {
      ...chip,
      backgroundColor: dealColors.notPublished,
    },
    old: {
      ...chip,
      color: theme.palette.text.primary,
      // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
      // @ts-ignore
      ...dealColors.old,
    },
  });
};

type PropsWithStyles = WithStyles<typeof styles>;

const legendFn: React.SFC<PropsWithStyles> = ({ classes }) => (
  <Paper className={clsx(classes.paper)}>
    <Chip
        color="secondary"
        avatar={<Avatar><PublishedIcon/></Avatar>}
        className={clsx(classes.active)}
        label={locale.dashboard.dealsPage.legend.active}
    />
    <Chip
        color="primary"
        avatar={<Avatar><PublishedIcon/></Avatar>}
        className={clsx(classes.published)}
        label={locale.dashboard.dealsPage.legend.published}
    />
    <Chip
        color="primary"
        avatar={<Avatar><PublishedIcon/></Avatar>}
        className={clsx(classes.special)}
        label={locale.dashboard.dealsPage.legend.special}
    />
    <Chip
        avatar={<Avatar><NotPublishedIcon/></Avatar>}
        className={clsx(classes.notPublished)}
        label={locale.dashboard.dealsPage.legend.notPublished}
    />
    <Chip
        avatar={<Avatar><PublishedIcon/></Avatar>}
        className={clsx(classes.old)}
        label={locale.dashboard.dealsPage.legend.old}
    />
  </Paper>
);

export const DealsCalendarLegend = withStyles(styles)(legendFn);

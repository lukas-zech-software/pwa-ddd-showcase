import {
  createStyles,
  Grid,
  Typography,
  WithStyles,
  withStyles,
}                      from '@material-ui/core';
import {
  OpeningHoursDay,
  OpeningHoursWeek,
}                      from '@my-old-startup/common/interfaces/openingHours';
import { getHourText } from '@my-old-startup/frontend-common/utils/format';
import * as React      from 'react';
import { locale }      from '../../common/locales';

const styles = () => createStyles(
  {
    root: {
      marginRight: 4,
    },
  },
);

type Props = { openingHours: OpeningHoursWeek } & WithStyles<typeof styles>;

const _OpeningHours: React.SFC<Props> = (props: Props) => {
  const { openingHours, classes } = props;

  const getHourEntry = (dayEntry: OpeningHoursDay) => {
    if (dayEntry === undefined) {
      return (
        <Typography variant="caption">
          {locale.restaurantView.closed}
        </Typography>
      );
    }

    const entries = Array.from(dayEntry).sort((a, b) => a.from - b.from);

    return entries.map((timeEntry, i) => (
      <Typography key={i} variant="caption">
        {getHourText(timeEntry.from)} - {getHourText(timeEntry.to)}
      </Typography>
    ));
  };

  const getDayEntry = (day: keyof OpeningHoursWeek, dayEntry: OpeningHoursDay) => (
    <>
      <Typography variant="subtitle2">
        {locale.common.weekday[day]}
      </Typography>

      {getHourEntry(dayEntry)}
    </>
  );

  return (
    <Grid container spacing={1} className={classes.root} justify="space-between">
      <Grid item xs={12}>
        <Typography variant="caption">
          ({locale.common.holidayHint})
        </Typography>
      </Grid>
      <Grid item xs={4}>
        {getDayEntry('monday', openingHours.monday)}
      </Grid>
      <Grid item xs={4}>
        {getDayEntry('tuesday', openingHours.tuesday)}
      </Grid>
      <Grid item xs={4}>
        {getDayEntry('wednesday', openingHours.wednesday)}
      </Grid>
      <Grid item xs={4}>
        {getDayEntry('thursday', openingHours.thursday)}
      </Grid>
      <Grid item xs={4}>
        {getDayEntry('friday', openingHours.friday)}
      </Grid>
      <Grid item xs={4}>
        {getDayEntry('saturday', openingHours.saturday)}
      </Grid>
      <Grid item xs={4}>
        {getDayEntry('sunday', openingHours.sunday)}
      </Grid>
      <Grid item xs={4}>
      </Grid>
    </Grid>
  );
};

export const OpeningHours = withStyles(styles)(_OpeningHours);

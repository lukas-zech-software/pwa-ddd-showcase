import { Theme } from '@material-ui/core';
import {
  amber,
  green,
}                from '@material-ui/core/colors';

export const centerCard = (theme: Theme) => ({
  margin:                                            '5% auto',
  width:                                             '50%',
  [theme.breakpoints.down('md')]:                    {
    width: '90%',
  },
  ['& MuiPickersCalendarHeader-dayLabel' as string]: {
    width: '100%',
  },
});

export const alertColors = (theme: Theme) => ({
  success: green[600],
  error:   theme.palette.error.dark,
  info:    theme.palette.primary.light,
  warning: amber[700],
});

export const warningCard = (theme: Theme) => ({
  borderColor: amber[700],
  borderWidth: '1px',
  borderStyle: 'solid',
  boxShadow:   `${theme.spacing(0.5)}px ${theme.spacing(0.5)}px ${theme.spacing(0.5)}px 0px ${amber[700]}`,
});

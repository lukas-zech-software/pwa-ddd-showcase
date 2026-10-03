import { IconButton, makeStyles, Theme, Typography } from '@material-ui/core';
import clsx                                          from 'clsx';
import * as moment                                   from 'moment';
import { Moment }                                    from 'moment';
import * as React                                    from 'react';

const useStyles = makeStyles((theme: Theme) => ({
  day: {
    width:    36,
    height:   36,
    padding:  0,
    fontSize: theme.typography.caption.fontSize,
    margin:   '0 auto',
    color:    'inherit',
    display:  'block',
  },
  disabled: {
    color: theme.palette.text.disabled,
  },
  highlightdisabled: {
    color: '#676767',
  },
  highlight: {
    background: theme.palette.primary.main,
    color:      theme.palette.common.white,
  },
  firstHighlight: {
    borderTopLeftRadius:    theme.spacing(1),
    borderBottomLeftRadius: theme.spacing(1),
  },
  endHighlight: {
    borderTopRightRadius:    theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
  },
}));

type Props = {
  date: Moment;
  isSelected: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  dayInCurrentMonth: boolean;
};

export const WrappedDatePickerDay: React.SFC<Props> =
               ({ date, isSelected, dayInCurrentMonth, isFirst, isLast }: Props) => {
                 const classes = useStyles();

                 const dateClone = moment(date);

                 const isPast = dateClone.isBefore(moment(), 'day');

                 const wrapperClassName = clsx({
                   [classes.highlight]:      isSelected,
                   [classes.firstHighlight]: isFirst,
                   [classes.endHighlight]:   isLast,
                 });

                 const dayClassName = clsx(classes.day, {
                   [classes.disabled]:          !dayInCurrentMonth || isPast,
                   [classes.highlightdisabled]: !dayInCurrentMonth && isSelected,
                 });

                 return (
                   <div className={wrapperClassName}>
                     <IconButton className={dayClassName}>
                       <Typography variant="body2"> {date.format('D')} </Typography>
                     </IconButton>
                   </div>
                 );
               };

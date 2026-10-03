/* eslint-disable no-case-declarations */
import { Chip, createStyles, Theme, Typography, withStyles, WithStyles } from '@material-ui/core';
import { Timestamp }                                                     from '@my-old-startup/common/interfaces/types';
import moment                                                            from 'moment';
import * as React                                                        from 'react';
import { locale }                                                        from '../locales';
import { MultiDatePickerVariant }                                        from './DatePickerCard';

const styles = (theme: Theme) => createStyles({
  chip: {
    margin: theme.spacing(1),
  },
});

type Props = WithStyles<typeof styles> & {
  selectedTimestamps: Timestamp[];
  selectedVariant: MultiDatePickerVariant;
  onChange: (timestamps: Timestamp[]) => void;
};

const _SelectedDates: React.SFC<Props> = (props: Props) => {
  const { classes, selectedTimestamps, selectedVariant, onChange } = props;

  if (selectedTimestamps.length === 0) {
    return <Typography key="none" variant="body2">{locale.forms.apiDealConditions.datepicker.noneSelected}</Typography>;
  }

  function onDelete(timestamp: Timestamp): void {
    const date         = moment(timestamp);
    // don't mutate parents props directly
    const clonedValues = [...selectedTimestamps];
    const index        = clonedValues.indexOf(date.valueOf());

    if (index !== -1) {
      clonedValues.splice(index, 1);
      onChange(clonedValues);
    } else {
      onChange([...clonedValues, date.valueOf()]);
    }
  }

  switch (selectedVariant) {
    case MultiDatePickerVariant.Single:
      return (
        <Chip className={classes.chip}
              key="single"
              label={moment(selectedTimestamps[0]).format('DD.MM.YYYY')}
        />
      );

    case MultiDatePickerVariant.Multiple:
      return (<>
        {selectedTimestamps.map((x) => <Chip key={x}
                                             onDelete={() => onDelete(x)}
                                             className={classes.chip}
                                             label={moment(x).format('DD.MM.YYYY')}/>)}
      </>);

    case MultiDatePickerVariant.Weekly:
    case MultiDatePickerVariant.Monthly:
      const firstDate = moment(selectedTimestamps[0]);
      const lastDate  = moment(selectedTimestamps[selectedTimestamps.length - 1]);
      const label     = `${firstDate.format('DD.MM.YYYY')} - ${lastDate.format('DD.MM.YYYY')}`;

      return <Chip className={classes.chip} key="first-last" label={label}/>;
    default:
      return null;
  }
};

export const SelectedDates = withStyles(styles)(_SelectedDates);

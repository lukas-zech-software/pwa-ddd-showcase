import { Checkbox, FormControl, FormControlLabel, Tooltip } from '@material-ui/core';
import * as React                                           from 'react';
import { locale }                                           from '../../../../common/locales';

type Props = {
  checked: boolean;
  label: string;
  tooltip: string;
  onChange(checked: boolean): void;
};

export const DayCheckbox: React.FC<Props> = (props) => {
  const { checked, label, onChange } = props;
  let tooltip                        = props.tooltip;

  if (checked) {
    tooltip = locale.forms.apiCompanyDetails.openingHoursForm.hintDayOpen(label);
  }

  return (
    <FormControl required>
      <Tooltip title={tooltip}>
        <FormControlLabel
          label={label}
          control={
            <Checkbox checked={checked}
                      onChange={(event) => onChange(event.target.checked)}

            />
          }/>
      </Tooltip>
    </FormControl>
  );
};

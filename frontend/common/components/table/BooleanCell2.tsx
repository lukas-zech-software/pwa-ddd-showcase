import {
  createStyles,
  Tooltip,
  withStyles,
  WithStyles,
}                            from '@material-ui/core';
import {
  green,
  red,
}                            from '@material-ui/core/colors';
import DefaultNotCheckedIcon from '@material-ui/icons/Cancel';
import DefaultCheckedIcon    from '@material-ui/icons/Check';
import clsx                  from 'clsx';
import * as React            from 'react';

const styles2 = () => createStyles(
  {
    cell: {
      'textAlign': 'center',
      '&.true':    {
        color: green[500],
      },
      '&.false':   {
        color: red[500],
      },
    },
  },
);

type Props = WithStyles<typeof styles2> & {
  value: boolean;
  className?: string;
  CheckedIcon?: React.ReactNode;
  NotCheckedIcon?: React.ReactNode;
  tooltip?: {
    'true'?: string;
    'false'?: string;
  };
};

export const BooleanCell2 = withStyles(styles2)(
  ({ value, classes, tooltip, CheckedIcon, NotCheckedIcon, className }: Props) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let trueIcon: any  = CheckedIcon || <DefaultCheckedIcon/>,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        falseIcon: any = NotCheckedIcon || <DefaultNotCheckedIcon/>;

    if (tooltip) {
      if (tooltip.true) {
        trueIcon = <Tooltip title={tooltip.true}>{trueIcon}</Tooltip>;
      }
      if (tooltip.false) {
        falseIcon = <Tooltip title={tooltip.false}>{falseIcon}</Tooltip>;
      }
    }

    return (
      <div className={clsx(classes.cell, value.toString(), className)}>
        {value === true ? trueIcon : falseIcon}
      </div>
    );
  });

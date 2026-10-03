import {
  createStyles,
  TableCell,
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
  CheckedIcon?: React.ReactNode;
  NotCheckedIcon?: React.ReactNode;
  tooltip?: {
    'true'?: string;
    'false'?: string;
  };
};

export const BooleanCell = withStyles(styles2)(({ value, classes, tooltip, CheckedIcon, NotCheckedIcon }: Props) => {
  let trueIcon: any  = CheckedIcon || <DefaultCheckedIcon/>,
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
    <TableCell className={clsx(classes.cell, value.toString())}>
      {value === true ? trueIcon : falseIcon}
    </TableCell>
  );
});

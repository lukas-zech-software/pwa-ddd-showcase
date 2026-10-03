import {
  createStyles,
  Theme,
  withStyles,
  WithStyles,
}                                                from '@material-ui/core';
import { grey }                                  from '@material-ui/core/colors';
import amber                                     from '@material-ui/core/colors/amber';
import green                                     from '@material-ui/core/colors/green';
import IconButton                                from '@material-ui/core/IconButton';
import SnackbarContent, { SnackbarContentProps } from '@material-ui/core/SnackbarContent';
import { SvgIconProps }                          from '@material-ui/core/SvgIcon';
import CheckCircleIcon                           from '@material-ui/icons/CheckCircle';
import ErrorIcon                                 from '@material-ui/icons/Error';
import InfoIcon                                  from '@material-ui/icons/Info';
import WarningIcon                               from '@material-ui/icons/Warning';
import clsx                                      from 'clsx';
import * as React                                from 'react';

const styles = (theme: Theme) => createStyles({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  disabled: {
    backgroundColor: grey[500],
  },

  icon: {
    fontSize: 26,
  },
  iconVariant: {
    opacity:     0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display:    'flex',
    alignItems: 'center',
  },
  snackbarContent: {
    maxWidth: 'inherit',
  },
});

export type SnackbarVariant = 'success' | 'warning' | 'error' | 'info' | 'disabled';

type Props = {
  message: string;
  snackbarVariant: SnackbarVariant;
  onClose?: () => void;
  buttonIcon: React.ComponentType<SvgIconProps>;
};

type PropsWithStyles = Props & WithStyles<typeof styles> & SnackbarContentProps;
const variantIcon = {
  success:  CheckCircleIcon,
  warning:  WarningIcon,
  error:    ErrorIcon,
  info:     InfoIcon,
  disabled: InfoIcon,
};

function _CustomSnackbarContent(props: PropsWithStyles): JSX.Element {
  const { classes, className, message, onClose, snackbarVariant, buttonIcon: ButtonIcon, ...other } = props;

  const Icon = variantIcon[snackbarVariant] as any;

  return (
    <SnackbarContent
      className={clsx(classes[snackbarVariant], classes.snackbarContent, className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)}/>
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={onClose}
        >
          <ButtonIcon className={classes.icon}/>
        </IconButton>,
      ]}
      {...other}
    />
  );
}

export const CustomSnackbarContent = withStyles(styles)(_CustomSnackbarContent);

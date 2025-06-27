import { Typography }                            from '@material-ui/core';
import { grey }                                  from '@material-ui/core/colors';
import amber                                     from '@material-ui/core/colors/amber';
import green                                     from '@material-ui/core/colors/green';
import IconButton                                from '@material-ui/core/IconButton';
import SnackbarContent, { SnackbarContentProps } from '@material-ui/core/SnackbarContent';
import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
}                                                from '@material-ui/core/styles';
import { SvgIconProps }                          from '@material-ui/core/SvgIcon';
import CheckCircleIcon                           from '@material-ui/icons/CheckCircle';
import CloseIcon                                 from '@material-ui/icons/Close';
import ErrorIcon                                 from '@material-ui/icons/Error';
import InfoIcon                                  from '@material-ui/icons/Info';
import WarningIcon                               from '@material-ui/icons/Warning';
import clsx                                      from 'clsx';
import * as React                                from 'react';
import {
  IGlobalMessage,
  MessageVariant,
}                                                from '../../types';
import { RawHtml }                               from '../RawHtml';

const variantIcon: { [key in MessageVariant]: React.ComponentType<SvgIconProps> } = {
  success:  CheckCircleIcon,
  warning:  WarningIcon,
  error:    ErrorIcon,
  info:     InfoIcon,
  disabled: InfoIcon,
};

const styles = (theme: Theme) => createStyles(
  {
    success:     {
      backgroundColor: green[600],
    },
    error:       {
      backgroundColor: theme.palette.error.dark,
    },
    info:        {
      backgroundColor: theme.palette.primary.dark,
    },
    disabled:    {
      backgroundColor: grey[500],
    },
    warning:     {
      backgroundColor: amber[700],
    },
    icon:        {
      fontSize: 30,
    },
    iconVariant: {
      opacity:     0.9,
      marginRight: theme.spacing(1),
    },
    message:     {
      display:    'flex',
      alignItems: 'center',
      color:      grey[100],
    },
    close:       {},
  },
);

type Props = SnackbarContentProps & {
  message: IGlobalMessage;
  onClose: (id: string) => void;
  hideClose?: boolean;
};

export const GlobalMessageContent = withStyles(styles)((props: Props & WithStyles<typeof styles>) => {
  const { classes, className, message, onClose, hideClose, ...other } = props;

  const Icon = variantIcon[message.variant];

  return (
    <SnackbarContent
      className={clsx(classes[message.variant], className)}
      message={
        <Typography variant="body1" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)}/>
          <RawHtml>{message.message}</RawHtml>
        </Typography>
      }
      action={!hideClose && [
        <IconButton
          key="close"
          color="inherit"
          className={classes.close}
          onClick={() => onClose(message.id)}
        >
          <CloseIcon className={classes.icon}/>
        </IconButton>,
      ]}
      {...other}
    />
  );
});

import {
  createStyles,
  Dialog,
  IconButton,
  Theme,
  useMediaQuery,
  useTheme,
  WithStyles,
  withStyles,
  DialogContent,
  DialogContentText,
  NoSsr,
}                 from '@material-ui/core';
import { Close }  from '@material-ui/icons';
import * as React from 'react';
import { IS_IOS } from '@my-old-startup/frontend-common/constants';
import { InstallAndroid } from './instructions/InstallAndroid';
import { InstallIOS } from './instructions/InstallIOS';

const styles = (theme: Theme) => createStyles({
  image: {
    width: '100%',
  },
  iconButton: {
    'width':    theme.spacing(5),
    'height':   theme.spacing(5),
    'position': 'absolute',
    'right':    theme.spacing(1),
    '& svg':    {
      width:  theme.spacing(4),
      height: theme.spacing(4),
    },
  },
});

type Props = {
  image: string;
  isOpen: boolean;
  onClose: () => void;
} & WithStyles<typeof styles>;

export const _InstallationDialog: React.FunctionComponent<Props> = ({ isOpen, onClose, image, classes }) => {
  const theme = useTheme();
  const isPhone = useMediaQuery(theme.breakpoints.only('xs'));

  const installationInstructions = IS_IOS ? <InstallIOS /> : <InstallAndroid />;

  return (
    <Dialog open={isOpen}
            fullScreen={isPhone}
            onClick={e => {
              e.stopPropagation();
              onClose();
            }}
            onBackdropClick={e => {
              e.stopPropagation();
              onClose();
            }}>
      <IconButton className={classes.iconButton} onClick={onClose}>
        <Close/>
      </IconButton>
      <DialogContent>
        <DialogContentText>
          <NoSsr>
            { installationInstructions }
          </NoSsr>
        </DialogContentText>
        <img src={image}
            className={classes.image}
            onClick={e => {
              e.stopPropagation();
              onClose();
            }}/>
      </DialogContent>
    </Dialog>
  );
};

export const InstallationDialog = withStyles(styles)(_InstallationDialog);

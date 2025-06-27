import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  Typography,
  WithStyles,
  withStyles,
}                      from '@material-ui/core';
import { alertColors } from '@my-old-startup/frontend-common/style';
import React           from 'react';
import { locale }      from './locales';

const styles = (theme: Theme) => createStyles({
  error: {
    color:         alertColors(theme).error,
    paddingBottom: theme.spacing(2),
  },
});

type Props = WithStyles<typeof styles> & {
  title: string;
  open: boolean;
  itemType: 'user' | 'company';
  okButtonLabel?: string;
  error?: React.ReactNode | string;
  onOk(): void;
  onCancel(): void;
};

const deleteConfirmationDialog: React.FC<Props> = ({ classes,
                                                     title,
                                                     open,
                                                     itemType,
                                                     okButtonLabel,
                                                     onOk,
                                                     onCancel,
                                                     error }) => (
  <Dialog open={open}
          disableBackdropClick
          disableEscapeKeyDown
          maxWidth="sm"
          aria-labelledby="confirmation-dialog-title"
  >
    <DialogTitle>
      {locale.dashboard.table.deleteDialog.header(itemType)}
    </DialogTitle>
    <DialogContent>
      {error && (
        <Typography className={classes.error} variant="caption">
          {error}
        </Typography>
      )}
      <Typography paragraph variant="body2">
        {locale.dashboard.table.deleteDialog.body(itemType, title)}
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button variant="contained" onClick={onCancel}>
        {locale.dashboard.table.deleteDialog.buttons.cancel}
      </Button>
      <Button variant="contained" onClick={onOk} color="primary">
        {okButtonLabel || locale.dashboard.table.deleteDialog.buttons.delete}
      </Button>
    </DialogActions>
  </Dialog>
);

export const DeleteConfirmationDialog = withStyles(styles)(deleteConfirmationDialog);

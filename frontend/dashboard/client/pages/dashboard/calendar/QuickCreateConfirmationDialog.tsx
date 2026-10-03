import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  withStyles,
  WithStyles,
}                                 from '@material-ui/core';
import { Timestamp }              from '@my-old-startup/common/interfaces';
import { locale as commonLocale } from '@my-old-startup/frontend-common/locales';
import { capitalize }             from '@my-old-startup/frontend-common/utils/format';
import * as React                 from 'react';
import { locale }                 from '../../../common/locales';

const styles = () => createStyles({
  zIndex: {
    zIndex: 999,
  },
});

type Props = WithStyles<typeof styles> & {
  isOpen: boolean;
  validFrom: Timestamp;
  validTo: Timestamp;
  onContinue(): void;
  onCancel(): void;
};

const _quickCreateConfirmDialog: React.FC<Props> = ({ isOpen, validFrom, validTo, onCancel, onContinue, classes }) => (
  <Dialog open={isOpen}
          onEscapeKeyDown={onCancel}
          onBackdropClick={onCancel}
          className={classes.zIndex}
  >
    <DialogTitle>{locale.dashboard.dialogs.quickCreateConfirmation.title}</DialogTitle>
    <DialogContent>
      <DialogContentText>
        {locale.dashboard.dialogs.quickCreateConfirmation.body({
          validFrom,
          validTo,
        })}
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel}
              variant="contained"
      >
        {capitalize(commonLocale.common.words.cancel)}
      </Button>
      <Button onClick={onContinue}
              variant="contained"
              color="primary"
      >
        {capitalize(commonLocale.common.words.continue)}
      </Button>
    </DialogActions>
  </Dialog>
);

export const QuickCreateConfirmationDialog = withStyles(styles)(_quickCreateConfirmDialog);

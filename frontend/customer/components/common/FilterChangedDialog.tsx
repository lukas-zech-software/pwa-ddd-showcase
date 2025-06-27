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
}                      from '@material-ui/core';
import { observer }    from 'mobx-react';
import * as React      from 'react';
import { locale }      from '../../common/locales';
import { filterStore } from '../../store/FilterStore';

const styles = () => createStyles({});

type Props = {} & WithStyles<typeof styles>;

@observer
class _FilterChangedDialog extends React.Component<Props> {
  public render(): React.ReactNode {
    return (
      <Dialog
        open={filterStore.showIsDirtyDialog}
        onClose={() => this.close()}
        aria-labelledby="filter-dialog-title"
        aria-describedby="filter-dialog-description"
      >
        <DialogTitle>
          {locale.filterView.dialog.dirty.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {locale.filterView.dialog.dirty.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => this.close()} color="default" autoFocus>
            {locale.filterView.buttons.abort}
          </Button>
          <Button onClick={() => this.apply()} color="primary">
            {locale.filterView.buttons.apply}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  private apply(): void {
    void filterStore.apply();
  }

  private close(): void {
    filterStore.resetChanged();
  }
}

export const FilterChangedDialog = withStyles(styles)(_FilterChangedDialog);

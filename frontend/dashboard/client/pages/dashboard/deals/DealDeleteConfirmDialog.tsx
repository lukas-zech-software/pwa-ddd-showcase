import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Theme,
  Typography,
  withStyles,
  WithStyles,
}                         from '@material-ui/core';
import { IApiDeal }       from '@my-old-startup/common/interfaces';
import { alertColors }    from '@my-old-startup/frontend-common/style';
import { dashboardTheme } from '@my-old-startup/frontend-common/theme';
import * as React         from 'react';
import { locale }         from '../../../common/locales';

const styles = (theme: Theme) =>
  createStyles({
    warning: {
      color:   alertColors(theme).warning,
      margin:  '0 auto',
      display: 'block',
      width:   theme.typography.h4.fontSize,
      height:  theme.typography.h4.fontSize,
    },
    header: {
      position: 'relative',
      top:      theme.spacing(1),
      left:     theme.spacing(1),
    },
    ok: {
      backgroundColor: dashboardTheme.palette.primary.main,
      color:           dashboardTheme.palette.text.primary,
      marginRight:     theme.spacing(1),
      '&:hover':       {
        backgroundColor: dashboardTheme.palette.primary.dark,
      },
    },
    zIndex: {
      zIndex: 999,
    },
  });

type Props = {
  deal: IApiDeal;
  open: boolean;

  onOk(): void;
  onCancel(): void;
} & WithStyles<typeof styles>;

class _DealDeleteConfirmDialog extends React.Component<Props> {

  public render(): React.ReactNode {
    const { classes, deal, open, onOk, onCancel } = this.props;

    return (
      <Dialog
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        maxWidth="sm"
        aria-labelledby="confirmation-dialog-title"
        className={classes.zIndex}
      >
        <DialogTitle id="confirmation-dialog-title">
          {locale.dashboard.dealsPage.table.dialog.header}
        </DialogTitle>
        <DialogContent>
          <Typography paragraph variant="body1"
                      dangerouslySetInnerHTML={{
                        __html: locale.dashboard.dealsPage.table.dialog.delete(deal.description.title),
                      }}/>
          {deal.published !== null && (
            <Typography paragraph variant="body1"
                        dangerouslySetInnerHTML={{ __html: locale.dashboard.dealsPage.table.dialog.deletePublished }}/>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onCancel}>
            {locale.common.buttons.cancel}
          </Button>
          <Button variant="contained" onClick={onOk} color="primary" className={classes.ok}>
            {locale.dashboard.dealsPage.table.buttons.delete}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export const DealDeleteConfirmDialog = withStyles(styles)(_DealDeleteConfirmDialog);

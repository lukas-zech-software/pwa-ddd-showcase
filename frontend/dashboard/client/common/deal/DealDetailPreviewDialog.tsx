import {
  Button,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  withStyles,
  WithStyles,
  withWidth,
}                            from '@material-ui/core';
import { WithWidth }         from '@material-ui/core/withWidth';
import {
  IApiCompany,
  IApiDeal,
}                            from '@my-old-startup/common/interfaces';
import { locale }            from '@my-old-startup/frontend-common/locales';
import { capitalize }        from '@my-old-startup/frontend-common/utils/format';
import * as React            from 'react';
import { DealDetailPreview } from './DealDetailPreview';

const styles = () => createStyles(
  {
    zIndex: {
      zIndex: 999,
    },
  },
);

type Props = WithStyles<typeof styles> & WithWidth & {
  company: IApiCompany;
  deal: IApiDeal;
  isOpen: boolean;
  onClose(): void;
};

const _DealDetailPreviewDialog: React.FC<Props> = ({ classes, company, deal, isOpen, width, onClose }: Props) => (
  <Dialog open={isOpen}
          fullScreen={width === 'xs' || width === 'sm'}
          className={classes.zIndex}
          onBackdropClick={onClose}
          onEscapeKeyDown={onClose}
  >
    <DialogContent>
      <DealDetailPreview company={company} deal={deal}/>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}
              variant="contained"
      >
        {capitalize(locale.common.words.close)}
      </Button>
    </DialogActions>
  </Dialog>
);

export const DealDetailPreviewDialog = withWidth()(withStyles(styles)(_DealDetailPreviewDialog));

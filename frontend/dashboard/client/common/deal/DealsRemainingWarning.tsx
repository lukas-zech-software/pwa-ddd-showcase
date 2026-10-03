import { DialogContentText } from '@material-ui/core';
import { RawHtml }           from '@my-old-startup/frontend-common/components';
import * as React            from 'react';
import { locale }            from '../locales';

type Props = {
  dealsRemaining: number;
};

const _dealsRemainingWarning: React.FunctionComponent<Props> = (props: Props) => {
  const { dealsRemaining } = props;

  const plural = dealsRemaining !== 1;

  return (
    <DialogContentText component={'div' as any}>
      <RawHtml>
        {locale.dashboard.dialogs.dealPublishConfirmation.warningText(dealsRemaining, plural)}
      </RawHtml>
    </DialogContentText>
  );
};

export const DealsRemainingWarning = _dealsRemainingWarning;

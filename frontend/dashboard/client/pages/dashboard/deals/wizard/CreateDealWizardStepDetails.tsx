import {
  Checkbox,
  createStyles,
  FormControlLabel,
  Grid,
  makeStyles,
  Theme,
  Typography,
}                                from '@material-ui/core';
import { useObserver }           from 'mobx-react';
import * as React                from 'react';
import { DealType }              from '../../../../../../../common/enums';
import { locale }                from '../../../../common/locales';
import { MaxPersonPicker }       from '../../../../common/MaxPersonPicker';
import { TagPicker }             from '../../../../common/TagPicker';
import { createDealWizardStore } from './CreateDealWizardStore';

type Props = {
  validate: boolean;
};

export function CreateDealWizardStepDetails(props: Props): JSX.Element {
  const errors        = props.validate ? createDealWizardStore.validateDetails() : [];
  const deal          = createDealWizardStore.deal;
  const isSpecialType = createDealWizardStore.deal.type === DealType.SPECIAL || createDealWizardStore.deal.type === DealType.SPECIAL_MENU;

  return useObserver(() => (
    <Grid container spacing={3} alignItems="flex-end">
      <Grid item xs={12}>
        <TagPicker
          selectedTags={deal.details.tags}
          error={errors.some((x) => x.property === 'tags')}
          onTagsChange={(tags) => createDealWizardStore.setDetails({ tags })}
        />
      </Grid>

      {isSpecialType === false && (
        <>
          <Grid item xs={12} md={4}>
            <MaxPersonPicker
              label={locale.forms.apiDealFacts.fields.minimumPersonCount}
              selected={deal.details.minimumPersonCount}
              max={12}
              onChange={(minimumPersonCount) => createDealWizardStore.setDetails({ minimumPersonCount })}
            />
          </Grid>

          <Grid item xs={12} md={6} style={{ alignSelf: 'flex-end' }}>
            <FormControlLabel
              label={locale.forms.apiDealFacts.fields.reservationRequired}
              control={
                <Checkbox checked={deal.details.reservationRequired}
                          onChange={(e) => createDealWizardStore.setDetails({ reservationRequired: e.target.checked })}/>
              }
            />
          </Grid>
        </>
      )}
    </Grid>
  ));
}

const useStylesHelp = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        helpLine: {
          marginBottom: theme.spacing(3),
        },
      },
    ),
);

export function CreateDealWizardStepDetailsHelp(): JSX.Element {
  const classes       = useStylesHelp();
  const deal          = createDealWizardStore.deal;
  const isSpecialType = deal.type === DealType.SPECIAL;

  return (
    <Grid container>
      <Grid item
            xs={12}
            className={classes.helpLine}>
        <Typography variant="subtitle2">
          {locale.forms.apiDealFacts.fields.tags}
        </Typography>
        <Typography variant="body2">
          {locale.forms.apiDealFacts.tooltips.tags}
        </Typography>
      </Grid>
      {isSpecialType === false && (
        <>
          <Grid item
                xs={12}
                className={classes.helpLine}>
            <Typography variant="subtitle2">
              {locale.forms.apiDealFacts.fields.minimumPersonCount}
            </Typography>
            <Typography variant="body2">
              {locale.forms.apiDealFacts.tooltips.minimumPersonCount}
            </Typography>
          </Grid>
          <Grid item
                xs={12}
                className={classes.helpLine}>
            <Typography variant="subtitle2">
              {locale.forms.apiDealFacts.fields.reservationRequired}
            </Typography>
            <Typography variant="body2">
              {locale.forms.apiDealFacts.tooltips.reservationRequired}
            </Typography>
          </Grid>
        </>
      )}

    </Grid>
  );
}


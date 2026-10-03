import {
  Checkbox,
  Chip,
  createStyles,
  FormControlLabel,
  Grid,
  makeStyles,
  Theme,
  Typography,
}                                from '@material-ui/core';
import { Redo }                  from '@material-ui/icons';
import { useObserver }           from 'mobx-react';
import moment                    from 'moment';
import * as React                from 'react';
import { isSpecialType }         from '../../../../../../../common/enums';
import { IApiDealDate }          from '../../../../../../../common/interfaces';
import { DatePickerCard }        from '../../../../common/date/DatePickerCard';
import { TimePicker }            from '../../../../common/date/TimePicker';
import { locale }                from '../../../../common/locales';
import { StaticDaySelector }     from '../StaticDaySelector';
import { createDealWizardStore } from './CreateDealWizardStore';

function isSameDate(): boolean {
  const dateFrom = createDealWizardStore.deal.date.validFrom;
  const dateTo   = createDealWizardStore.deal.date.validTo;

  return moment(dateFrom).isSame(moment(dateTo), 'day');
}

function getDateError(dealDate: IApiDealDate): string | undefined {
  const { validFrom } = dealDate;

  if (moment(validFrom) < moment().hour(0).minute(0).second(0)) {
    return locale.forms.apiDealConditions.dealMustBeInTheFuture;
  } else {
    return undefined;
  }
}

type Props = {
  validate: boolean;
};

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        chipsContainer: {
          display:        'flex',
          flexWrap:       'wrap',
          alignItems:     'center',
          justifyContent: 'center',
        },
        fromChip:       {
          marginLeft:                     0,
          [theme.breakpoints.down('sm')]: {
            marginLeft: theme.spacing(1),
          },
        },
      },
    ),
);

export function CreateDealWizardStepDate(props: Props): JSX.Element {
  let errors             = props.validate ? createDealWizardStore.validateDate() : [];
  const deal             = createDealWizardStore.deal;
  const classes          = useStyles();
  const dateErrorMessage = getDateError(deal.date);
  const spans2Days       = !isSameDate();
  const specialType      = isSpecialType(deal.type);

  // If the date is in the past, only show errors regarding validFrom >= validTo
  if (dateErrorMessage !== undefined) {
    errors = errors
      .filter((err) => err.constraints.isLessThan !== undefined || err.constraints.isGreaterThan !== undefined)
      .map((err) => {
        err.constraints = Object.assign({}, {
          isLessThan:    err.constraints.isLessThan,
          isGreaterThan: err.constraints.isGreaterThan,
        });
        return err;
      });
  }

  return useObserver(() => (
    <Grid container>
      {specialType === false && (
        <Grid item xs={12} style={{ alignSelf: 'flex-end' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={deal.isStatic}
                onChange={(e) => createDealWizardStore.setIsStatic(e.target.checked)}/>
            }
            label={locale.forms.apiDealConditions.isStaticCheckBox}
          />
        </Grid>
      )}

      {deal.isStatic === true && (
        <>
          <Grid item xs={12} style={{ alignSelf: 'flex-end' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={deal.skipHolidays}
                  onChange={(e) => createDealWizardStore.setSkipHolidays(e.target.checked)}/>
              }
              label={locale.forms.apiDealConditions.skipHolidays}
            />
          </Grid>
          <Grid item xs={12} style={{ paddingBottom: 16 }}>
            <StaticDaySelector deal={deal}/>
          </Grid>
        </>
      )}

      {deal.isStatic !== true && (
        <Grid item xs={12} style={{ paddingBottom: 16 }}>
          <DatePickerCard selectedTimestamps={createDealWizardStore.publishTimestamps}
                          onSubmit={(timestamps) => {
                            createDealWizardStore.setPublishTimestamps(timestamps);
                            createDealWizardStore.setTimestamp(timestamps[0]);
                          }}/>
        </Grid>
      )}
      {specialType === false && (
        <>
          <Grid item xs={12} style={{ alignSelf: 'flex-end' }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={spans2Days}
                  onChange={(e) => createDealWizardStore.setTimestamp(deal.date.validFrom, e.target.checked ? 1 : 0)}/>
              }
              label={locale.forms.apiDealConditions.daySpanningCheckBox}
            />
          </Grid>
          <Grid item xs={12} md={3} className={classes.chipsContainer}>
            <TimePicker timestamp={deal.date.validFrom}
                        spanningDay={spans2Days}
                        label={locale.forms.apiDealConditions.timePickerValidFrom}
                        error={errors.find((x) => x.property === 'validFrom')}
                        onChange={(validFrom) => createDealWizardStore.setDate({ validFrom })}
                        chipClass={classes.fromChip}
            />
          </Grid>
          <Grid item xs={12} md={3} className={classes.chipsContainer}>
            <Chip label={<Redo/>}/>
          </Grid>
          <Grid item xs={12} md={3} className={classes.chipsContainer}>
            <TimePicker timestamp={deal.date.validTo}
                        spanningDay={spans2Days}
                        label={locale.forms.apiDealConditions.fields.validTo}
                        error={errors.find((x) => x.property === 'validTo')}
                        onChange={(validTo) => createDealWizardStore.setDate({ validTo })}
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

export function CreateDealWizardStepDateHelp(): JSX.Element {
  const classes = useStylesHelp();

  return (
    <Grid container>
      <Grid item
            xs={12}
            className={classes.helpLine}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.date.header.datepicker}

        </Typography>
        <Typography variant="body2">
          {locale.createDealWizard.date.help.datepicker}
        </Typography>
      </Grid>
      <Grid item
            xs={12}
            className={classes.helpLine}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.date.header.overnight}
        </Typography>
        <Typography variant="body2">
          {locale.createDealWizard.date.help.overnight}
        </Typography>
      </Grid>
    </Grid>
  );
}


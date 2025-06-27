import {
  createStyles,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Hidden,
  makeStyles,
  Radio,
  RadioGroup,
  Theme,
  Typography,
}                                from '@material-ui/core';
import {
  DealSpecialType,
  DealType,
}                                from '@my-old-startup/common/enums';
import { Paragraphs }            from '@my-old-startup/frontend-common/components/Paragraphs';
import { centerCard }            from '@my-old-startup/frontend-common/style';
import clsx                      from 'clsx';
import { useObserver }           from 'mobx-react';
import * as React                from 'react';
import { useState }              from 'react';
import { locale }                from '../../../../common/locales';
import { createDealWizardStore } from './CreateDealWizardStore';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        card:             {
          ...centerCard(theme),
        },
        formControl:      {
          margin:                         theme.spacing(3),
          marginTop:                      0,
          [theme.breakpoints.down('md')]: {
            margin: theme.spacing(0),
          },
        },
        formControlLabel: {
          color:                                         'rgba(0, 0, 0, 0.54) !important',
          '& .Mui-checked + .MuiFormControlLabel-label': {
            color:      theme.palette.text.primary,
            fontWeight: 'bold',
          },
        },
        label:            {
          display:      'block',
          '&.focused':  {
            color: 'rgba(0, 0, 0, 0.54)',
          },
          '&.selected': {
            color:      theme.palette.text.primary,
            fontWeight: 'bold',
          },
        },
        stepBox:          {
          borderColor:  theme.palette.grey[500],
          borderWidth:  1,
          borderStyle:  'solid',
          borderRadius: theme.shape.borderRadius,
          margin:       theme.spacing(1),
        },
      },
    ),
);

export function CreateDealWizardStepType(): JSX.Element {
  const classes                   = useStyles({});
  const [isTypeSet, setIsTypeSet] = useState<boolean>(false);

  return useObserver(() => (
    <Grid container>
      <Grid item xs={5} className={classes.stepBox}>
        <FormControl className={classes.formControl}>
          <FormLabel>
            <Typography variant="h6">
              {locale.createDealWizard.details.dealSpecialTypes.type}
            </Typography>
          </FormLabel>
          <RadioGroup name="dealType"
                      value={isTypeSet ? createDealWizardStore.deal.type.toString() : undefined}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        const type = parseInt((event.target as HTMLInputElement).value, 10) as DealType;
                        setIsTypeSet(true);
                        createDealWizardStore.setType(type);
                      }}>

            <FormControlLabel value={DealType.SPECIAL_NEW.toString()}
                              control={<Radio color="primary"/>}
                              label={locale.createDealWizard.type.dealTypes[DealType.SPECIAL_NEW]}
            />
            <FormControlLabel value={DealType.SPECIAL_MENU.toString()}
                              control={<Radio color="primary"/>}
                              label={locale.createDealWizard.type.dealTypes[DealType.SPECIAL_MENU]}
            />
            <FormControlLabel value={DealType.SPECIAL.toString()}
                              control={<Radio color="primary"/>}
                              label={locale.createDealWizard.type.dealTypes[DealType.SPECIAL]}
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      {isTypeSet === true && createDealWizardStore.deal.type !== DealType.SPECIAL_NEW && (
        <Grid item xs={5} className={classes.stepBox}>
          <CreateDealWizardStepSubType/>
        </Grid>
      )}
    </Grid>
  ));
}

export function CreateDealWizardStepSubType(): JSX.Element | null {
  const classes = useStyles({});
  const deal    = createDealWizardStore.deal;

  if (deal.type === DealType.SPECIAL) {
    return useObserver(() => (
      <FormControl className={classes.formControl}>
        <FormLabel>
          <Typography variant="h6">
            {locale.createDealWizard.details.dealSpecialTypes.kind}
          </Typography>
        </FormLabel>
        <RadioGroup name="dealSpecialType"
                    value={createDealWizardStore.deal.specialType ? createDealWizardStore.deal.specialType.toString() : DealSpecialType.DAILY.toString()}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      createDealWizardStore.setSpecialType(parseInt((event.target as HTMLInputElement).value, 10) as DealSpecialType);
                    }}>
          <FormControlLabel value={DealSpecialType.SPECIAL.toString()}
                            control={<Radio color="primary"/>}
                            label={locale.createDealWizard.details.dealSpecialTypes[DealSpecialType.SPECIAL]}
          />
          <FormControlLabel value={DealSpecialType.DAILY.toString()}
                            control={<Radio color="primary"/>}
                            label={locale.createDealWizard.details.dealSpecialTypes[DealSpecialType.DAILY]}
          />
          <FormControlLabel value={DealSpecialType.WEEKLY.toString()}
                            control={<Radio color="primary"/>}
                            label={locale.createDealWizard.details.dealSpecialTypes[DealSpecialType.WEEKLY]}
          />
          <FormControlLabel value={DealSpecialType.MONTHLY.toString()}
                            control={<Radio color="primary"/>}
                            label={locale.createDealWizard.details.dealSpecialTypes[DealSpecialType.MONTHLY]}
          />
        </RadioGroup>
      </FormControl>
    ));
  }

  return useObserver(() => (
    <FormControl className={classes.formControl}>
      <FormLabel>
        <Typography variant="h6">
          {locale.createDealWizard.details.dealSpecialTypes.kind}
        </Typography>
      </FormLabel>
      <RadioGroup name="dealSpecialType"
                  value={createDealWizardStore.deal.specialType ? createDealWizardStore.deal.specialType.toString() : DealSpecialType.DAILY.toString()}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    createDealWizardStore.setSpecialType(parseInt((event.target as HTMLInputElement).value, 10) as DealSpecialType);
                  }}>
        <FormControlLabel value={DealSpecialType.DAILY.toString()}
                          control={<Radio color="primary"/>}
                          label={locale.createDealWizard.details.dealSpecialMenuTypes[DealSpecialType.DAILY]}
        />
        <FormControlLabel value={DealSpecialType.WEEKLY.toString()}
                          control={<Radio color="primary"/>}
                          label={locale.createDealWizard.details.dealSpecialMenuTypes[DealSpecialType.WEEKLY]}
        />
        <FormControlLabel value={DealSpecialType.MONTHLY.toString()}
                          control={<Radio color="primary"/>}
                          label={locale.createDealWizard.details.dealSpecialMenuTypes[DealSpecialType.MONTHLY]}
        />
      </RadioGroup>
    </FormControl>
  ));

}

export function CreateDealWizardDealType(): JSX.Element {
  const classes = useStyles({});

  return useObserver(() => (
    <FormControl className={classes.formControl}>
      <RadioGroup name="dealType"
                  value={createDealWizardStore.deal.type.toString()}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                    const type = parseInt((event.target as HTMLInputElement).value, 10) as DealType;
                    createDealWizardStore.setType(type);
                    if (type === DealType.SPECIAL) {
                      createDealWizardStore.setSpecialType(DealSpecialType.DAILY);
                    }
                  }}>
        <Grid container alignItems="center">
          <Grid item xs={12} sm={6}>
            <FormControlLabel className={classes.formControlLabel}
                              value={DealType.DISCOUNT_2_FOR_1.toString()}
                              control={<Radio color="primary"/>}
                              label={locale.createDealWizard.type.dealTypes[DealType.DISCOUNT_2_FOR_1]}
            />
          </Grid>

          <Hidden xsDown>
            <Grid item xs={12} sm={6}>
              <FormLabel
                className={clsx({ selected: createDealWizardStore.deal.type === DealType.DISCOUNT_2_FOR_1 })}
                classes={{
                  focused: 'focused',
                  root:    classes.label,
                }}>{locale.createDealWizard.type.example[DealType.DISCOUNT_2_FOR_1]}</FormLabel>
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={6}>
            <FormControlLabel className={classes.formControlLabel}
                              value={DealType.DISCOUNT.toString()}
                              control={<Radio color="primary"/>}
                              label={locale.createDealWizard.type.dealTypes[DealType.DISCOUNT]}
            />
          </Grid>

          <Hidden xsDown>
            <Grid item xs={12} sm={6}>
              <FormLabel
                className={clsx({ selected: createDealWizardStore.deal.type === DealType.DISCOUNT })}
                classes={{
                  focused: 'focused',
                  root:    classes.label,
                }}>{locale.createDealWizard.type.example[DealType.DISCOUNT]}</FormLabel>
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={6}>
            <FormControlLabel className={classes.formControlLabel}
                              value={DealType.DISCOUNT_CATEGORY.toString()}
                              control={<Radio color="primary"/>}
                              label={locale.createDealWizard.type.dealTypes[DealType.DISCOUNT_CATEGORY]}
            />
          </Grid>

          <Hidden xsDown>
            <Grid item xs={12} sm={6}>
              <FormLabel
                className={clsx({ selected: createDealWizardStore.deal.type === DealType.DISCOUNT_CATEGORY })}
                classes={{
                  focused: 'focused',
                  root:    classes.label,
                }}>{locale.createDealWizard.type.example[DealType.DISCOUNT_CATEGORY]}</FormLabel>
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={6}>
            <FormControlLabel className={classes.formControlLabel}
                              value={DealType.DISCOUNT_WHOLE_BILL.toString()}
                              control={<Radio color="primary"/>}
                              label={locale.createDealWizard.type.dealTypes[DealType.DISCOUNT_WHOLE_BILL]}
            />
          </Grid>

          <Hidden xsDown>
            <Grid item xs={12} sm={6}>
              <FormLabel
                className={clsx({ selected: createDealWizardStore.deal.type === DealType.DISCOUNT_WHOLE_BILL })}
                classes={{
                  focused: 'focused',
                  root:    classes.label,
                }}>{locale.createDealWizard.type.example[DealType.DISCOUNT_WHOLE_BILL]}</FormLabel>
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={6}>
            <FormControlLabel className={classes.formControlLabel}
                              value={DealType.ADDON.toString()}
                              control={<Radio color="primary"/>}
                              label={locale.createDealWizard.type.dealTypes[DealType.ADDON]}
            />
          </Grid>

          <Hidden xsDown>
            <Grid item xs={12} sm={6}>
              <FormLabel
                className={clsx({ selected: createDealWizardStore.deal.type === DealType.ADDON })}
                classes={{
                  focused: 'focused',
                  root:    classes.label,
                }}>{locale.createDealWizard.type.example[DealType.ADDON]}</FormLabel>
            </Grid>
          </Hidden>

        </Grid>
        <Hidden mdUp>
          <Typography variant="caption">
            {locale.createDealWizard.type.mobileHint}
          </Typography>
        </Hidden>
      </RadioGroup>
    </FormControl>
  ));
}

const useStylesHelp = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        helpLine:       {
          marginBottom: theme.spacing(3),
          display:      'none',
        },
        helpLineActive: {
          color:   theme.palette.primary.contrastText,
          display: 'block',
        },
        example:        {
          fontStyle: 'italic',
        },
      },
    ),
);

export function CreateDealWizardStepTypeHelp(): JSX.Element {
  const classes = useStylesHelp();
  const deal    = createDealWizardStore.deal;

  if (deal.type === DealType.SPECIAL_NEW) {
    return useObserver(() => (
      <Grid container>
        <Grid item
              xs={12}
              className={clsx(classes.helpLine, classes.helpLineActive)}>
          <Typography variant="subtitle2">
            {locale.createDealWizard.details.dealSpecialNewMenuTypes.header}
          </Typography>
          <Typography variant="body2">
            {locale.createDealWizard.details.dealSpecialNewMenuTypes.help}
          </Typography>
        </Grid>
      </Grid>
    ));
  }

  if (deal.type === DealType.SPECIAL) {
    return useObserver(() => (
      <Grid container>
        <Grid item
              xs={12}
              className={clsx(classes.helpLine, classes.helpLineActive)}>
          <Typography variant="subtitle2">
            {locale.createDealWizard.details.dealSpecialTypes.header}
          </Typography>
          <Typography variant="body2">
            {locale.createDealWizard.details.dealSpecialTypes.help}
          </Typography>
        </Grid>
      </Grid>
    ));
  }

  if (deal.type === DealType.SPECIAL_MENU) {
    return useObserver(() => (
      <Grid container>
        <Grid item
              xs={12}
              className={clsx(classes.helpLine, classes.helpLineActive)}>
          <Typography variant="subtitle2">
            {locale.createDealWizard.details.dealSpecialMenuTypes.header}
          </Typography>
          <Typography variant="body2">
            {locale.createDealWizard.details.dealSpecialMenuTypes.help}
          </Typography>
        </Grid>
      </Grid>
    ));
  }

  return useObserver(() => (
    <Grid container>
      <Grid item
            xs={12}
            className={clsx(classes.helpLine, { [classes.helpLineActive]: createDealWizardStore.deal.type === DealType.DISCOUNT_2_FOR_1 })}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.type.dealTypes[DealType.DISCOUNT_2_FOR_1]}
        </Typography>
        <Hidden smUp>
          <Paragraphs variant="body2" className={classes.example}>
            {locale.createDealWizard.type.example[DealType.DISCOUNT_2_FOR_1]}
          </Paragraphs>
        </Hidden>
        <Paragraphs variant="body2">
          {locale.createDealWizard.type.help[DealType.DISCOUNT_2_FOR_1]}
        </Paragraphs>
      </Grid>

      <Grid item
            xs={12}
            className={clsx(classes.helpLine, { [classes.helpLineActive]: createDealWizardStore.deal.type === DealType.DISCOUNT })}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.type.dealTypes[DealType.DISCOUNT]}
        </Typography>
        <Hidden smUp>
          <Paragraphs variant="body2" className={classes.example}>
            {locale.createDealWizard.type.example[DealType.DISCOUNT]}
          </Paragraphs>
        </Hidden>
        <Paragraphs variant="body2">
          {locale.createDealWizard.type.help[DealType.DISCOUNT]}
        </Paragraphs>
      </Grid>

      <Grid item
            xs={12}
            className={clsx(classes.helpLine, { [classes.helpLineActive]: createDealWizardStore.deal.type === DealType.DISCOUNT_CATEGORY })}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.type.dealTypes[DealType.DISCOUNT_CATEGORY]}
        </Typography>
        <Hidden smUp>
          <Paragraphs variant="body2" className={classes.example}>
            {locale.createDealWizard.type.example[DealType.DISCOUNT_CATEGORY]}
          </Paragraphs>
        </Hidden>
        <Paragraphs variant="body2">
          {locale.createDealWizard.type.help[DealType.DISCOUNT_CATEGORY]}
        </Paragraphs>
      </Grid>

      <Grid item
            xs={12}
            className={clsx(classes.helpLine, { [classes.helpLineActive]: createDealWizardStore.deal.type === DealType.DISCOUNT_WHOLE_BILL })}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.type.dealTypes[DealType.DISCOUNT_WHOLE_BILL]}
        </Typography>
        <Hidden smUp>
          <Paragraphs variant="body2" className={classes.example}>
            {locale.createDealWizard.type.example[DealType.DISCOUNT_WHOLE_BILL]}
          </Paragraphs>
        </Hidden>
        <Paragraphs variant="body2">
          {locale.createDealWizard.type.help[DealType.DISCOUNT_WHOLE_BILL]}
        </Paragraphs>
      </Grid>

      <Grid item
            xs={12}
            className={clsx(classes.helpLine, { [classes.helpLineActive]: createDealWizardStore.deal.type === DealType.ADDON })}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.type.dealTypes[DealType.ADDON]}
        </Typography>
        <Hidden smUp>
          <Paragraphs variant="body2" className={classes.example}>
            {locale.createDealWizard.type.example[DealType.ADDON]}
          </Paragraphs>
        </Hidden>
        <Paragraphs variant="body2">
          {locale.createDealWizard.type.help[DealType.ADDON]}
        </Paragraphs>
      </Grid>

      <Grid item
            xs={12}
            className={clsx(classes.helpLine, { [classes.helpLineActive]: createDealWizardStore.deal.type === DealType.SPECIAL })}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.type.dealTypes[DealType.SPECIAL]}
        </Typography>
        <Hidden smUp>
          <Paragraphs variant="body2" className={classes.example}>
            {locale.createDealWizard.type.example[DealType.SPECIAL]}
          </Paragraphs>
        </Hidden>
        <Paragraphs variant="body2">
          {locale.createDealWizard.type.help[DealType.SPECIAL]}
        </Paragraphs>
      </Grid>
    </Grid>
  ));
}


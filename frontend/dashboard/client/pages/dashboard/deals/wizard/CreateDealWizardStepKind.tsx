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
  isSpecialType,
}                                from '@my-old-startup/common/enums';
import { Paragraphs }            from '@my-old-startup/frontend-common/components/Paragraphs';
import { centerCard }            from '@my-old-startup/frontend-common/style';
import clsx                      from 'clsx';
import { useObserver }           from 'mobx-react';
import * as React                from 'react';
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
      },
    ),
);

type Props = {};

export function CreateDealWizardStepKind(props: Props): JSX.Element {
  const classes         = useStyles({});
  const isSpecial       = isSpecialType(createDealWizardStore.deal.type);
  let actualSpecialType = DealType.SPECIAL;
  if (isSpecial) {
    actualSpecialType = createDealWizardStore.deal.type;
  }

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
                              value={actualSpecialType.toString()}
                              control={<Radio color="primary"/>}
                              label={locale.createDealWizard.type.dealTypes.special}
            />
          </Grid>

          <Hidden xsDown>
            <Grid item xs={12} sm={6}>
              <FormLabel
                className={clsx({ selected: isSpecial })}
                classes={{
                  focused: 'focused',
                  root:    classes.label,
                }}>{locale.createDealWizard.type.example[actualSpecialType]}</FormLabel>
            </Grid>
          </Hidden>

          <Grid item xs={12} sm={6}>
            <FormControlLabel className={classes.formControlLabel}
                              value={DealType.DISCOUNT_2_FOR_1.toString()}
                              control={<Radio color="primary"/>}
                              label={locale.createDealWizard.type.dealTypes.deal}
            />
          </Grid>

          <Hidden xsDown>
            <Grid item xs={12} sm={6}>
              <FormLabel
                className={clsx({ selected: createDealWizardStore.deal.type === DealType.DISCOUNT_2_FOR_1 })}
                classes={{
                  focused: 'focused',
                  root:    classes.label,
                }}>{locale.createDealWizard.type.example.deal}</FormLabel>
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

export function CreateDealWizardStepKindHelp(): JSX.Element {
  const classes       = useStylesHelp();
  const isSpecialType = createDealWizardStore.deal.type === DealType.SPECIAL || createDealWizardStore.deal.type === DealType.SPECIAL_MENU;

  return useObserver(() => (
    <Grid container>
      <Grid item
            xs={12}
            className={clsx(classes.helpLine, { [classes.helpLineActive]: createDealWizardStore.deal.type === DealType.DISCOUNT_2_FOR_1 })}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.type.dealTypes.deal}
        </Typography>
        <Hidden smUp>
          <Paragraphs variant="body2" className={classes.example}>
            {locale.createDealWizard.type.example.deal}
          </Paragraphs>
        </Hidden>
        <Paragraphs variant="body2">
          {locale.createDealWizard.type.help.deal}
        </Paragraphs>
      </Grid>

      <Grid item
            xs={12}
            className={clsx(classes.helpLine, { [classes.helpLineActive]: isSpecialType })}>
        <Typography variant="subtitle2">
          {locale.createDealWizard.type.dealTypes.special}
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


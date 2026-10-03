import {
  createStyles,
  FormLabel,
  Grid,
  InputAdornment,
  makeStyles,
  Paper,
  Slider,
  TextField,
  Theme,
  Typography,
}                                from '@material-ui/core';
import { Help }                  from '@material-ui/icons';
import { warningCard }           from '@my-old-startup/frontend-common/style';
import clsx                      from 'clsx';
import { useObserver }           from 'mobx-react';
import * as React                from 'react';
import { useState }              from 'react';
import { DealType }              from '../../../../../../../common/enums';
import { Monetary }              from '../../../../../../../common/interfaces';
import {
  getDiscount,
  getMinMax,
  getPercent,
}                                from '../../../../../../../common/utils/deals';
import { CurrencyFormField }     from '../../../../common/CurrencyFormField';
import { locale }                from '../../../../common/locales';
import { createDealWizardStore } from './CreateDealWizardStore';

type ValueConfig = {
  originalValue: ValueFieldConfig;
  discountValue: ValueFieldConfig;
  slider: ValueFieldConfig;
}

type ValueFieldConfig = {
  hide: boolean;
  disabled: boolean;
}

function getValueConfig(dealType: DealType): ValueConfig {
  switch (dealType) {
    case DealType.ADDON:
      return {
        originalValue: {
          hide:     false,
          disabled: false,
        },
        discountValue: {
          hide:     true,
          disabled: true,
        },
        slider:        {
          hide:     false,
          disabled: true,
        },
      };

    case DealType.DISCOUNT_2_FOR_1:
      return {
        originalValue: {
          hide:     false,
          disabled: true,
        },
        discountValue: {
          hide:     false,
          disabled: false,
        },
        slider:        {
          hide:     false,
          disabled: true,
        },
      };

    case DealType.SPECIAL_NEW:
    case DealType.SPECIAL:
      return {
        originalValue: {
          hide:     true,
          disabled: true,
        },
        discountValue: {
          hide:     false,
          disabled: false,
        },
        slider:        {
          hide:     true,
          disabled: true,
        },
      };

    case DealType.DISCOUNT_CATEGORY:
    case DealType.DISCOUNT_WHOLE_BILL:
      return {
        originalValue: {
          hide:     true,
          disabled: true,
        },
        discountValue: {
          hide:     true,
          disabled: true,
        },
        slider:        {
          hide:     false,
          disabled: false,
        },
      };

    case DealType.DISCOUNT:
    default:
      return {
        originalValue: {
          hide:     false,
          disabled: false,
        },
        discountValue: {
          hide:     false,
          disabled: false,
        },
        slider:        {
          hide:     false,
          disabled: false,
        },
      };
  }
}

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        inputGridItem:                            {
          marginRight: theme.spacing(1),
        },
        warningCard:                              warningCard(theme),
        sliderGrid:                               {
          marginLeft: theme.spacing(1),
        },
        sliderCaption:                            {
          marginBottom: theme.spacing(2),
        },
        sliderIcon:                               {
          color:     theme.palette.primary.main,
          width:     theme.spacing(3),
          height:    theme.spacing(3),
          marginTop: -11,
        },
        '@global .Mui-disabled .MuiSlider-thumb': {
          color: theme.palette.text.disabled,
        },
        percentageText:                           {
          margin: 'auto',
          width:  theme.spacing(10),
        },
        hidden:                                   {
          display: 'none',
        },
        paper:                                    {
          backgroundColor: theme.palette.grey['100'],
          padding:         theme.spacing(1),
        },
        paperIcon:                                {
          float:       'left',
          marginRight: theme.spacing(1),
        },
      },
    ),
);

type Props = {
  validate: boolean;
};

export function CreateDealWizardStepValue(props: Props): JSX.Element {
  const classes = useStyles({});

  const errors                                = props.validate ? createDealWizardStore.validateValue() : [];
  const deal                                  = createDealWizardStore.deal;
  const defaultDiscount                       = deal.type === DealType.SPECIAL ? 0 : 50;
  const [discountPercent, setDiscountPercent] = useState<number>(getPercent(deal.value.discountValue, deal.value.originalValue));
  const [addonValue, setAddonValue]           = useState<Monetary>(deal.value.discountValue !== undefined ? deal.value.discountValue : defaultDiscount);
  const dealType                              = createDealWizardStore.deal.type;
  const config                                = getValueConfig(dealType);

  function onDiscountChanged(discountValue: Monetary): void {
    createDealWizardStore.setValue({ discountValue });
    if (config.originalValue.hide === true) {
      createDealWizardStore.setValue({ originalValue: discountValue });
    }
    if (dealType === DealType.DISCOUNT_2_FOR_1) {
      createDealWizardStore.setValue({ originalValue: discountValue * 2 });
    }
    setDiscountPercent(getPercent(discountValue, deal.value.originalValue));
  }

  function onOriginalChanged(originalValue: Monetary): void {
    createDealWizardStore.setValue({ originalValue });
    if (dealType === DealType.ADDON) {
      createDealWizardStore.setValue({ discountValue: addonValue });
    }

    setDiscountPercent(getPercent(deal.value.discountValue, originalValue));
  }

  function onAddonChanged(newAddonValue: Monetary): void {
    setAddonValue(newAddonValue);
    createDealWizardStore.setValue({ discountValue: newAddonValue });
  }

  function onSliderChange(value: any): void {
    value               = parseInt(value, 10);
    value               = getMinMax(value);
    const discountValue = getDiscount(value, deal.value.originalValue);

    createDealWizardStore.setValue({ discountValue });

    setDiscountPercent(value);
  }

  function getDefaultFields(): React.ReactNode {
    return (
      <>
        <Grid item xs={12} className={clsx(classes.inputGridItem, { [classes.hidden]: config.originalValue.hide })}>
          <CurrencyFormField onValueChange={onOriginalChanged}
                             disabled={config.originalValue.disabled}
                             label={locale.forms.apiDealValue.fields.originalValue}
                             value={deal.value.originalValue}
                             errors={errors.filter((e) => e.property === 'originalValue')}
          />

        </Grid>

        <Grid item xs={12} className={clsx(classes.inputGridItem, { [classes.hidden]: config.discountValue.hide })}>
          <CurrencyFormField onValueChange={onDiscountChanged}
                             disabled={config.discountValue.disabled}
                             label={locale.forms.apiDealValue.fields.discountValue}
                             value={deal.value.discountValue}
                             errors={errors.filter((e) => e.property === 'discountValue')}
          />
        </Grid>

        <Grid item xs={12} className={clsx(classes.sliderGrid, { [classes.hidden]: config.slider.hide })}>
          <Typography variant="caption" color="textSecondary" className={classes.sliderCaption}>
            {locale.forms.apiDealValue.discountSlider}
          </Typography>

          <Slider
            value={discountPercent}
            min={0}
            max={100}
            step={1}
            disabled={config.slider.disabled}
            onChange={(event, value) => onSliderChange(value)}
            classes={{ thumb: classes.sliderIcon }}
          />

        </Grid>

        <Grid item>
          <TextField
            className={clsx(classes.percentageText, { [classes.hidden]: config.slider.hide })}
            value={discountPercent}
            disabled={config.slider.disabled}
            onChange={onSliderChange}
            InputProps={{
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            margin="dense"
            variant="outlined"
          />
        </Grid>
      </>
    );
  }

  function getAddonFields(): React.ReactNode {
    return (
      <>
        <Grid item xs={7}>
          <FormLabel>{locale.createDealWizard.type.addonHintOriginalValue}</FormLabel>
        </Grid>
        <Grid item xs={4} className={classes.inputGridItem}>
          <CurrencyFormField onValueChange={onOriginalChanged}
                             disabled={config.originalValue.disabled}
                             label={locale.forms.apiDealValue.addonOriginalPrice}
                             value={deal.value.originalValue}
                             errors={errors.filter((e) => e.property === 'originalValue')}
          />

        </Grid>

        <Grid item xs={7}>
          <FormLabel>{locale.createDealWizard.type.addonHintAddonValue}</FormLabel>
        </Grid>
        <Grid item xs={4} className={classes.inputGridItem}>
          <CurrencyFormField onValueChange={onAddonChanged}
                             label={locale.forms.apiDealValue.addonValue}
                             value={addonValue}
                             errors={[]}/>

        </Grid>

      </>
    );
  }

  if (dealType === DealType.SPECIAL_MENU) {
    return useObserver(() => (
      <Grid container spacing={3} style={{ marginTop: 0 }}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant="subtitle2">
              {locale.createDealWizard.price.menuPriceHint}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    ));
  }

  return useObserver(() => (
    <Grid container spacing={3} justify={'center'} style={{ marginTop: 0 }}>
      {dealType === DealType.ADDON ? getAddonFields() : getDefaultFields()}
    </Grid>
  ));
}

const useStylesHelp = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        helpLine:       {
          marginBottom: theme.spacing(3),
        },
        helpLineActive: {
          color: theme.palette.primary.contrastText,
        },
      },
    ),
);

export function CreateDealWizardStepValueHelp(): JSX.Element {
  const classes  = useStylesHelp();
  const labels   = locale.createDealWizard.price.help[createDealWizardStore.deal.type];
  const dealType = createDealWizardStore.deal.type;

  if (dealType === DealType.SPECIAL_MENU) {
    return useObserver(() => (
      <Grid container>
        <Grid item
              xs={12}
              className={classes.helpLine}>
          <Typography variant="subtitle2">
            {locale.createDealWizard.price.menuPriceHelp}
          </Typography>
        </Grid>
      </Grid>
    ));
  }

  return useObserver(() => (
    <Grid container>
      {labels.originalValue && (
        <Grid item
              xs={12}
              className={classes.helpLine}>
          <Typography variant="subtitle2">
            {dealType !== DealType.ADDON ? locale.forms.apiDealValue.fields.originalValue : locale.forms.apiDealValue.addonOriginalPrice}
          </Typography>
          <Typography variant="body2">
            {labels.originalValue}
          </Typography>
        </Grid>
      )}

      {labels.discountValue && (
        <Grid item
              xs={12}
              className={classes.helpLine}>
          <Typography variant="subtitle2">
            {locale.forms.apiDealValue.fields.discountValue}
          </Typography>
          <Typography variant="body2">
            {labels.discountValue}
          </Typography>
        </Grid>
      )}

      {labels.discount && (
        <Grid item
              xs={12}
              className={classes.helpLine}>
          <Typography variant="subtitle2">
            {locale.forms.apiDealValue.discountSlider}
          </Typography>
          <Typography variant="body2">
            {labels.discount}
          </Typography>
        </Grid>
      )}

      {(labels as any).addonValue && (
        <Grid item
              xs={12}
              className={classes.helpLine}>
          <Typography variant="subtitle2">
            {locale.forms.apiDealValue.addonValue}
          </Typography>
          <Typography variant="body2">
            {(labels as any).addonValue}
          </Typography>
        </Grid>
      )}
    </Grid>
  ));
}


import {
  Button,
  Card,
  CardActions,
  CardContent,
  createStyles,
  Grid,
  hexToRgb,
  makeStyles,
  Theme,
}                             from '@material-ui/core';
import { Remove }             from '@material-ui/icons';
import { ValidationError }    from 'class-validator';
import clsx                   from 'clsx';
import * as React             from 'react';
import { useState }           from 'react';
import { Dish }               from '../../../../../common/interfaces';
import { companyStore }       from '../../stores/CompanyStore';
import { CurrencyFormField }  from '../CurrencyFormField';
import { locale }             from '../locales';
import { getValidationError } from '../utils/utils';
import { CompanyFormField }   from './CompanyFormField';

function hexToRgba(color: string, opacity: number): string {
  return hexToRgb(color).replace('rgb', 'rgba').replace(')', `, ${opacity.toFixed(1)})`);
}

const useStyles = makeStyles(
  (theme: Theme) => {
    return createStyles(
      {
        cardActions:  {
          flexDirection: 'column-reverse',
          alignItems:    'flex-end',
        },
        subheader:    {
          color: `${theme.palette.text.primary} !important`,
        },
        deleteButton: {
          '&:hover':       {
            backgroundColor: theme.palette.error.dark,
          },
          backgroundColor: theme.palette.grey[300],
        },
        hovered:      {
          backgroundColor: hexToRgba(theme.palette.error.dark, 0.25),
        },
      },
    );
  },
);

type Props = {
  index: number;
  dish: Dish;
  errors: ValidationError[];
  onRemove: () => void,
};

export function CompanyDishInput(props: Props): JSX.Element {
  const { errors, dish, index, onRemove } = props;
  const classes                           = useStyles();

  const [hovered, setHover] = useState(false);

  return (
    <Card className={clsx({ [classes.hovered]: hovered })}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={7}>
            <CompanyFormField
              errorMessage={getValidationError(errors, 'title')}
              value={dish.title || ''}
              propertyName="dishes.title" // name or dirty check
              onValueChange={(value) => (dish.title = value)}
              label={locale.forms.apiCompanyDishes.fields.title}
            />
          </Grid>
          <Grid item xs={1}/>
          <Grid item xs={4}>
            <CurrencyFormField onValueChange={(value) => {
              companyStore.addDirty('dishes.price');

              return (dish.price = value);
            }}
                               label={locale.forms.apiCompanyDishes.fields.price}
                               inline
                               value={dish.price || 0}
                               errors={errors.filter((e) => e.property === 'price')}/>
          </Grid>
          <Grid item xs={12}>
            <CompanyFormField
              errorMessage={getValidationError(errors, 'description')}
              value={dish.description || ''}
              propertyName="dishes.description" // name or dirty check
              onValueChange={(value) => dish.description = value}
              label={locale.forms.apiCompanyDishes.fields.description}
              multiline
              rows="2"/>
          </Grid>
        </Grid>
      </CardContent>
      <CardActions className={classes.cardActions}>
        <Button
          startIcon={<Remove/>}
          variant="contained"
          className={classes.deleteButton}
          size="small"
          onClick={onRemove}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {locale.forms.apiCompanyDishes.deleteButton}
        </Button>
      </CardActions>
    </Card>
  );
}


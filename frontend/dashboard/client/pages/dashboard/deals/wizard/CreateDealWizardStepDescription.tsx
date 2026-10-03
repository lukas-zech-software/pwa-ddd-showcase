import {
  createStyles,
  FormLabel,
  Grid,
  makeStyles,
  TextField,
  Theme,
  Typography,
}                                from '@material-ui/core';
import clsx                      from 'clsx';
import { useObserver }           from 'mobx-react';
import * as React                from 'react';
import { locale }                from '../../../../common/locales';
import { getValidationError }    from '../../../../common/utils/utils';
import { createDealWizardStore } from './CreateDealWizardStore';

const useStyles = makeStyles(
  (theme: Theme) =>
    createStyles(
      {
        input: {
          marginLeft:  theme.spacing(1),
          marginRight: theme.spacing(1),
        },
        label: {
          marginTop:  theme.spacing(0.5),
          display:'block',
          fontStyle: 'italic',
          fontSize:  '.9rem',
        },
      },
    ),
);

type Props = {
  validate: boolean;
};

export function CreateDealWizardStepDescription(props: Props): JSX.Element {
  const classes = useStyles({});

  const errors = props.validate ? createDealWizardStore.validateDescription() : [];
  const deal   = createDealWizardStore.deal;

  return useObserver(() => (
    <Grid container spacing={3} alignItems="flex-end">
      <Grid item xs={12}>
        <TextField error={errors.some(e => e.property === 'title')}
                   helperText={getValidationError(errors, 'title')}
                   value={deal.description.title}
                   onChange={(e) => createDealWizardStore.setDescription({ title: e.target.value })}
                   label={locale.forms.apiDealDescription.fields.title}
                   fullWidth
                   className={classes.input}
        />
        <FormLabel className={clsx(classes.label,classes.input)}>
          {locale.createDealWizard.description.titleHint[deal.type]}
        </FormLabel>
      </Grid>

      <Grid item xs={12}>
        <TextField error={errors.some(e => e.property === 'description')}
                   helperText={getValidationError(errors, 'description')}
                   value={deal.description.description}
                   onChange={(e) => createDealWizardStore.setDescription({ description: e.target.value })}
                   label={locale.forms.apiDealDescription.fields.description}
                   multiline
                   rows="4"
                   fullWidth
                   className={classes.input}
        />
      </Grid>
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

export function CreateDealWizardStepDescriptionHelp(): JSX.Element {
  const classes = useStylesHelp();

  return useObserver(() => (
    <Grid container>
      <Grid item
            xs={12}
            className={classes.helpLine}>
        <Typography variant="subtitle2">
          {locale.forms.apiDealDescription.fields.title}
        </Typography>
        <Typography variant="body2">
          {locale.forms.apiDealDescription.tooltips.title}
        </Typography>
      </Grid>
      <Grid item
            xs={12}
            className={classes.helpLine}>
        <Typography variant="subtitle2">
          {locale.forms.apiDealDescription.fields.description}
        </Typography>
        <Typography variant="body2">
          {locale.forms.apiDealDescription.tooltips.description}
        </Typography>
      </Grid>
    </Grid>
  ));
}


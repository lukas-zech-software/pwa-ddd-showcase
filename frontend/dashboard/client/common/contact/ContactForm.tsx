import { Button, createStyles, FormGroup, TextField, Theme, withStyles, WithStyles } from '@material-ui/core';
import { IApiContactForm }
  from '@my-old-startup/common/interfaces';
import { ApiContactForm }                from '@my-old-startup/common/validation';
import { globalMessageService }          from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { sanitize }                      from 'class-sanitizer';
import { plainToClass }                  from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import * as React                        from 'react';
import { contactFacade }                 from '../../facade/ContactFacade';
import { CompanyFormCheckbox }           from '../company/CompanyFormField';
import { locale }                        from '../locales';
import { getValidationError }            from '../utils/utils';
import { ContactSuccessCard }            from './ContactSuccessCard';

const BLANK_FORM: IApiContactForm = {
  contactEmail:     '',
  subject:          '',
  body:             '',
  hasAcceptedTerms: false,
};

const styles = (theme: Theme) => createStyles({
  form: {
    marginTop: theme.spacing(2),
  },
  textField: {
    marginTop: theme.spacing(1),
  },
  checkboxLabel: {
    fontSize: theme.typography.pxToRem(13),
  },
});

type Props = WithStyles<typeof styles> & {
  email: 'support@my-old-startups-domain.de' | 'feedback@my-old-startups-domain.de';
};

type State = {
  formData: IApiContactForm;
  shouldValidate: boolean;
  formErrors: ValidationError[];
  wasSent: boolean;
};

class _ContactForm extends React.Component<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      formData:       Object.assign({}, BLANK_FORM),
      shouldValidate: false,
      formErrors:     [],
      wasSent:        false,
    };
  }

  public render(): React.ReactElement {
    const { classes }                                       = this.props;
    const { shouldValidate, formErrors, wasSent }           = this.state;
    const { contactEmail, subject, body, hasAcceptedTerms } = this.state.formData;

    if (wasSent) {
      return (
        <ContactSuccessCard/>
      );
    }

    const errors = shouldValidate ? formErrors : [];

    const contactEmailError = getValidationError(errors, 'contactEmail');
    const subjectError      = getValidationError(errors, 'subject');
    const bodyError         = getValidationError(errors, 'body');

    return (
      <FormGroup className={classes.form}>
        <TextField label={locale.forms.contact.labels.contactEmail}
                   error={contactEmailError !== undefined}
                   helperText={contactEmailError}
                   value={contactEmail}
                   variant="outlined"
                   margin="dense"
                   className={classes.textField}
                   onChange={(event) => this.updateForm({ contactEmail: event.target.value })}
        />
        <TextField label={locale.forms.contact.labels.subject}
                   error={subjectError !== undefined}
                   helperText={subjectError}
                   value={subject}
                   variant="outlined"
                   margin="dense"
                   className={classes.textField}
                   onChange={(event) => this.updateForm({ subject: event.target.value })}
        />
        <TextField label={locale.forms.contact.labels.body}
                   error={bodyError !== undefined}
                   helperText={bodyError}
                   value={body}
                   multiline
                   rows={4}
                   rowsMax={10}
                   variant="outlined"
                   margin="dense"
                   className={classes.textField}
                   onChange={(event) => this.updateForm({ body: event.target.value })}
        />
        <CompanyFormCheckbox errorMessage={getValidationError(errors, 'hasAcceptedTerms')}
                             controlLabelClassName={classes.checkboxLabel}
                             label={locale.forms.contact.labels.hasAcceptedTerms}
                             value={hasAcceptedTerms}
                             propertyName={'hasAcceptedTerms'}
                             onCheckboxChange={(value: boolean) => this.updateForm({ hasAcceptedTerms: value })}
        />
        <Button onClick={() => this.send()} variant="contained" color="primary">
          {locale.dashboard.contactPage.send}
        </Button>
      </FormGroup>
    );
  }

  private async send(): Promise<void> {
    const { formData } = this.state;

    const instance: ApiContactForm = plainToClass(ApiContactForm, formData);
    sanitize(instance);
    const errors = validateSync(instance);

    this.setState({ shouldValidate: true, formErrors: errors });

    if (errors.length !== 0) {
      return Promise.reject();
    }

    try {
      if (this.props.email === 'feedback@my-old-startups-domain.de') {
        await contactFacade.sendToFeedback(formData);
      } else {
        await contactFacade.sendToSupport(formData);
      }

      setTimeout(() => this.setState({ wasSent: false, shouldValidate: false, formData: BLANK_FORM }), 5000);
      this.setState({ wasSent: true });
    } catch (e) {
      globalMessageService.pushMessage({
        message: 'Failed to send email',
        variant: 'error',
      });
    }
  }

  private updateForm(newFormData: Partial<IApiContactForm>): void {
    const oldFormData = this.state.formData;
    const formData    = Object.assign(oldFormData, newFormData);

    this.setState({ formData });
  }
}

export const ContactForm = withStyles(styles)(_ContactForm);

import {
  createStyles,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Theme,
  withStyles,
  WithStyles,
}                                 from '@material-ui/core';
import { CompanyType }            from '@my-old-startup/common/enums/types';
import { Loading }                from '@my-old-startup/frontend-common/components';
import { locale as commonLocale } from '@my-old-startup/frontend-common/locales';
import { observer }               from 'mobx-react';
import * as React                 from 'react';
import { companyStore }           from '../../stores/CompanyStore';
import { FormTooltip }            from '../FormTooltip';
import { locale }                 from '../locales';
import { getValidationError }     from '../utils/utils';

const styles = (theme: Theme) => createStyles({
  selectIcon: {
    marginRight: theme.spacing(3),
  },
});

type Props = {
  disabled?: boolean;
  tooltip?: boolean;
} & WithStyles<typeof styles>;

type State = {
  value: CompanyType;
};

@observer
class _CompanyTypeSelect extends React.Component<Props, State> {
  private _ref: any;
constructor(props:Props) {
    super(props);
    this._ref = React.createRef();
  }
  /**
   * Scroll to the form field the first time it shows a validation error
   */
  private scrollToError(errorMessage: string | undefined): void {
    if (errorMessage !== undefined && this._ref.current) {
      setTimeout(
        () => {
          this._ref.current.scrollIntoView(
            {
              behavior: 'smooth',
              block:    'center',
            },
          );
        },
        200,
      );
    }
  }

  public render(): JSX.Element {
    const company = companyStore.currentCompany;

    if (company === undefined) {
      return <Loading/>;
    }

    const { disabled, tooltip } = this.props;

    let errorMessage: string | undefined;
    // TODO: Shouldn|t this happen onUpdated?
    if (companyStore.isValidationEnabled) {
      errorMessage = getValidationError(companyStore.contactValidationError, 'type');
      this.scrollToError(errorMessage);
    }

    return (
      <FormControl fullWidth disabled={disabled} error={errorMessage !== undefined}  ref={this._ref}>
        <input type="hidden" ref={this._ref}/>
        <InputLabel htmlFor="type">{locale.forms.apiCompanyContact.fields.type}</InputLabel>
        <Select
          endAdornment={(tooltip !== undefined &&
            <FormTooltip form title={locale.forms.apiCompanyContact.tooltips.type}/>)}
          value={company.contact.type !== undefined ? company.contact.type : ''}
          onChange={(event) => this.onChange(event.target.value)}
          inputProps={{ name: 'type' }}
          classes={{ icon: this.props.classes.selectIcon }}
        >
          <MenuItem
            value={CompanyType.RETAIL}>{commonLocale.company.types[CompanyType.RETAIL]}</MenuItem>
          <MenuItem
            value={CompanyType.RESTAURANT}>{commonLocale.company.types[CompanyType.RESTAURANT]}</MenuItem>
          <MenuItem value={CompanyType.CAFE}>{commonLocale.company.types[CompanyType.CAFE]}</MenuItem>
          <MenuItem value={CompanyType.IMBISS}>{commonLocale.company.types[CompanyType.IMBISS]}</MenuItem>
          <MenuItem
            value={CompanyType.FOODTRUCK}>{commonLocale.company.types[CompanyType.FOODTRUCK]}</MenuItem>
          <MenuItem
            value={CompanyType.BAR}>{commonLocale.company.types[CompanyType.BAR]}</MenuItem>
        </Select>
        {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
      </FormControl>
    );
  }

  private onChange(value: any): void {
    if (companyStore.currentCompany) {
      companyStore.currentCompany.contact.type = value;
    }
  }
}

export const CompanyTypeSelect = withStyles(styles)(_CompanyTypeSelect);

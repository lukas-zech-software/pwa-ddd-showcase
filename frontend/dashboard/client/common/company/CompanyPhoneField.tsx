import {
  createStyles,
  Theme,
  Tooltip,
  withStyles,
  WithStyles,
}                           from '@material-ui/core';
import { amber }            from '@material-ui/core/colors';
import { TextFieldProps }   from '@material-ui/core/TextField';
import clsx                 from 'clsx';
import * as React           from 'react';
import { FormTooltip }      from '../FormTooltip';
import { locale }           from '../locales';
import { CompanyFormField } from './CompanyFormField';

const styles = (theme: Theme) => createStyles(
  {
    '@keyframes fade-formatted': {
      from:  {
        color: theme.palette.common.black,
      },
      '50%': {
        color: amber[700],
      },
      to:    {
        color: theme.palette.common.black,
      },
    },
    animatePrefilled:            {
      animationName:           'fade-formatted',
      animationDuration:       '.75s',
      animationIterationCount: 1,
    },
  },
);

type Props = WithStyles<typeof styles> & TextFieldProps & {
  propertyName: string;
  errorMessage: string | undefined;
  label: string;
  value: string | undefined;
  tooltip?: string;
  isOptional?: boolean;
  emptyStringToUndefined?: boolean;
  onValueChange(value: string | undefined): void;
};

type State = {
  didReformat: boolean;
  onlyZeroWasStripped: boolean;
};

class _CompanyPhoneField extends React.PureComponent<Props, State> {
  public constructor(props: Props) {
    super(props);

    this.state = {
      didReformat:         false,
      onlyZeroWasStripped: false,
    };
  }

  private static insertMask(formValue: string | undefined = ''): string {
    return '🇩🇪 +49 ' + formValue;
  }

  private static stripMask(maskedValue: string): string {
    return maskedValue.replace(/^🇩🇪 \+49 ?/, '');
  }

  public render(): React.ReactNode {
    const
      {
        classes,
        errorMessage,
        value,
        propertyName,
        label,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onValueChange,
        tooltip,
        isOptional,
        emptyStringToUndefined,
        // eslint-disable-next-line @typescript-eslint/tslint/config
        ...inputProps
      }                                        = this.props;
    const { didReformat, onlyZeroWasStripped } = this.state;

    // We only show the tooltip if the following is true:
    // - The number was reformatted AND
    // - More than the zero was stripped
    const showTooltip = didReformat && !onlyZeroWasStripped;

    const maskedValue = _CompanyPhoneField.insertMask(value);

    return (
      <Tooltip open={showTooltip}
               title={locale.common.error.telephoneReformatTooltip}
      >
        <CompanyFormField errorMessage={errorMessage}
                          helperText={errorMessage}
                          value={maskedValue}
                          onBlur={(event) => this.onClickAway(event.currentTarget.value)}
                          onValueChange={(value) => this.onChange(value)}
                          label={label}
                          name={propertyName}
                          optional={isOptional}
                          emptyStringToUndefined={emptyStringToUndefined}
                          propertyName={propertyName}
                          InputProps={{
                            className:    clsx({ [classes.animatePrefilled]: didReformat }),
                            endAdornment: (tooltip !== undefined && <FormTooltip form title={tooltip}/>),
                          }}
                          {...inputProps}
        />
      </Tooltip>
    );
  }

  /**
   * Takes a value and normalizes it for the German phone number format:
   * - Takes either the first 12 digits or `0?49` and 8 additional digits
   * - Optionally strips the leading `0`
   * @param value - the value of the form field after the mask has been stripped
   * @param stripLeadingZero - Whether to strip the leading zero
   */
  private normalizePhoneNumber(value: string, stripLeadingZero?: boolean): string {
    const replaced = value.replace(/^(0?(49\d{0,8}|\d{0,12})).*$/, '$1');

    if (stripLeadingZero === true) {
      const zeroStripped = replaced.replace(/0?(.*)$/, '$1');

      let onlyZeroWasStripped = false;

      // Checks whether the stripped string with prepended `0` is identical to the input value
      if (`0${zeroStripped}` === value) {
        onlyZeroWasStripped = true;
      }
      this.setState({ onlyZeroWasStripped });

      return zeroStripped;
    }

    this.setState({ onlyZeroWasStripped: false });

    return replaced;
  }

  private onChange(rawValue: string): void {
    const value = _CompanyPhoneField.stripMask(rawValue);

    const normalized = this.normalizePhoneNumber(value);

    const didReformat = value !== normalized;
    this.setState({ didReformat });

    this.props.onValueChange(normalized.length !== 0 ? normalized : undefined);
  }

  private onClickAway(rawValue: string): void {
    const value = _CompanyPhoneField.stripMask(rawValue);

    const normalized = this.normalizePhoneNumber(value, true);

    const didReformat = value !== normalized;
    this.setState({ didReformat });

    this.props.onValueChange(normalized.length !== 0 ? normalized : undefined);
  }
}

export const CompanyPhoneField = withStyles(styles)(_CompanyPhoneField);

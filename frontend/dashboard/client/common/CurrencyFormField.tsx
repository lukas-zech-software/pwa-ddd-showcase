import {
  createStyles,
  InputAdornment,
  TextField,
  Theme,
  withStyles,
  WithStyles,
}                          from '@material-ui/core';
import { amber }           from '@material-ui/core/colors';
import { TextFieldProps }  from '@material-ui/core/TextField';
import { Monetary }        from '@my-old-startup/common/interfaces';
import { locale }          from '@my-old-startup/frontend-common/locales';
import { parseMonetary }   from '@my-old-startup/frontend-common/utils/format';
import { ValidationError } from 'class-validator';
import clsx                from 'clsx';
import * as React          from 'react';

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
      animationDuration:       '1s',
      animationIterationCount: 2,
    },
  });

type Props = TextFieldProps & WithStyles<typeof styles> & {
  label: string;
  inline?: boolean | undefined;
  value: Monetary;
  errors: ValidationError[];
  onValueChange(value: Monetary): void;
};

type State = {
  inputText: string;
  inputReformatted: boolean;
};

class _CurrencyFormField extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      inputText:        locale.format.currency(props.value),
      inputReformatted: false,
    };
  }

  public componentWillReceiveProps(nextProps: Props): void {
    const inputText = locale.format.currency(nextProps.value);

    // If the value changed, reformat and use the updated string
    if (inputText !== this.state.inputText) {
      this.setState({ inputText, inputReformatted: true });
    } else {
      this.setState({ inputReformatted: false });
    }
  }

  public render(): React.ReactNode {
    const { classes, label, errors, disabled, inline } = this.props;
    const { inputText, inputReformatted }              = this.state;

    const error = errors.length === 0 ? undefined : errors[0];

    let errorMessage: string | undefined;

    if (error) {
      errorMessage = Object.values<string>(error.constraints)[0];
    }

    let inlineProps: TextFieldProps = {
      margin:  'none',
      variant: 'outlined',
    };

    if (inline) {
      inlineProps = {};
    }

    return (
      <TextField
        error={errorMessage !== undefined}
        helperText={errorMessage}
        fullWidth
        value={inputText}
        onChange={(event) => this.onInputChange(event.target.value)}
        onBlur={() => this.propagateChange()}
        label={label}
        disabled={disabled}
        InputProps={{
          className:      clsx({ [classes.animatePrefilled]: inputReformatted }),
          startAdornment: <InputAdornment position="start">&euro;</InputAdornment>,
        }}
        InputLabelProps={{
          shrink: true,
        }}
        {...inlineProps}
      />
    );
  }

  /**
   * Updates the currently input text
   * @param eventValue The raw input value from the event
   */
  private onInputChange(eventValue: string): void {
    // Strip out non-digit and non-currency punctuation
    const inputText = eventValue.replace(/[^0-9,.]/, '');

    this.setState({ inputText });
  }

  /**
   * Triggers the `onValueChange` callback
   */
  private propagateChange(): void {
    const normalized = parseMonetary(this.state.inputText);

    if (normalized === undefined) {
      return;
    }

    this.props.onValueChange(normalized);
  }
}

export const CurrencyFormField = withStyles(styles)(_CurrencyFormField);

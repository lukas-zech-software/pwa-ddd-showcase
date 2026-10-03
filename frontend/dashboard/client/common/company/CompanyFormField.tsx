import {
  Checkbox,
  createStyles,
  FormControl,
  FormControlLabel,
  FormHelperText,
  TextField,
  Theme,
  withStyles,
  WithStyles,
}                         from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import clsx               from 'clsx';
import * as React         from 'react';
import { companyStore }   from '../../stores/CompanyStore';
import { FormTooltip }    from '../FormTooltip';

const styles = (theme: Theme) => createStyles(
  {
    input:         {
      margin: theme.spacing(1),
    },
    tooltip:       {
      cursor: 'pointer',
    },
    tooltipPopper: {
      fontSize: '.8rem',
    },
    tooltipIcon:   {
      float:    'right',
      position: 'relative',
      top:      theme.spacing(-1),
      left:     theme.spacing(1),
      width:    theme.spacing(3),
      height:   theme.spacing(3),
      color:    theme.palette.grey[500],
    },
    softDisabled:      {
      color:  'rgba(0, 0, 0, 0.38)',
      cursor: 'default',
    },
  },
);

type Props = TextFieldProps & {
  errorMessage: string | undefined;
  propertyName: string;
  label: string;
  tooltip?: string;
  value: any;
  optional?: boolean;
  emptyStringToUndefined?: boolean;
  softDisabled?: boolean;
  // TODO: change call signature to (value: string | undefined): void
  // The callback will call with `undefined` if `emptyStringToUndefined` is `true`,
  // but this is not type-checked for the caller
  onValueChange(value: string): void;
};

type PropsWithStyles = Props & WithStyles<typeof styles>;

/**
 * Needs to be a class _as TextField uses ref internally, which is not available on functional components
 */
class _CompanyFormField extends React.Component<PropsWithStyles> {
  private readonly _ref: any;

  constructor(props: PropsWithStyles) {
    super(props);
    this._ref = React.createRef();
  }

  public render(): React.ReactNode {

    const
      {
        errorMessage,
        value,
        propertyName,
        label,
        onValueChange,
        tooltip,
        optional,
        emptyStringToUndefined,
        softDisabled,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        classes,
        // eslint-disable-next-line @typescript-eslint/tslint/config
        ...inputProps
      } = this.props;

    const formLabel = optional ? `${label} (optional)` : label;

    this.scrollToError(errorMessage);

    return (
      <TextField
        ref={this._ref}
        error={errorMessage !== undefined}
        helperText={errorMessage}
        fullWidth
        value={value}
        onChange={(event) => {
          if (companyStore.currentCompany) {
            companyStore.addDirty(propertyName);
          }
          const value = event.currentTarget.value;
          if (emptyStringToUndefined === true && value === '') {
            onValueChange(undefined as any);
          } else {
            onValueChange(value);
          }
        }}
        label={formLabel}
        InputProps={{
          className:    clsx({ [classes.softDisabled]: softDisabled }),
          endAdornment: (tooltip !== undefined && <FormTooltip form title={tooltip}/>),
        }}
        name={propertyName}
        {...inputProps}/>
    );
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
}

export const CompanyFormField = withStyles(styles)(_CompanyFormField);

type CheckboxProps = {
  errorMessage: string | undefined;
  propertyName: string;
  className?: string;
  disabled?: boolean;
  disabledAndEmpty?: boolean;
  controlLabelClassName?: string;
  controlLabelRootClassName?: string;
  label: string;
  value: boolean;
  onCheckboxChange(value: boolean): void;
  onFormClick?: () => void;
} & WithStyles<typeof styles>;

export const CompanyFormCheckbox = withStyles(styles)((props: CheckboxProps) => {

  const
    {
      classes,
      controlLabelClassName,
      controlLabelRootClassName,
      errorMessage,
      label,
      value,
      onCheckboxChange,
      propertyName,
      className,
      disabled,
      disabledAndEmpty,
      onFormClick,
    } = props;

  return (
    <FormControl required error={errorMessage !== undefined} className={classes.input + ' ' + className}
                 onClick={onFormClick}>
      <FormControlLabel
        disabled={disabled || disabledAndEmpty}
        classes={{
          label: controlLabelClassName,
          root:  controlLabelRootClassName,
        }}
        control={
          <Checkbox name={propertyName}
                    className={controlLabelClassName}
                    checked={disabledAndEmpty ? false : value}
                    onChange={(event) => {
                      if (companyStore.currentCompany) {
                        companyStore.addDirty(propertyName);
                      }
                      onCheckboxChange(event.target.checked);
                    }}
          />
        }
        label={<div dangerouslySetInnerHTML={{ __html: label }}/>}
      />
      {errorMessage && <FormHelperText>{errorMessage}</FormHelperText>}
    </FormControl>
  );
});

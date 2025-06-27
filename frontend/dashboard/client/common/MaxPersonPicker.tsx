import {
  createStyles,
  FormControl,
  Input,
  InputLabel,
  NativeSelect,
  Theme,
  withStyles,
  WithStyles,
}                          from '@material-ui/core';
import { ValidationError } from 'class-validator';
import * as React          from 'react';

const styles = (theme: Theme) => createStyles(
  {
    formControl: {
      margin:    theme.spacing(1),
      width:     120,
      '& label': {
        width: 240,
      },
    },
  },
);

type Props = WithStyles<typeof styles> & {
  label: string;
  selected: number;
  max: number;
  onChange: (value: number) => void;
  error?: ValidationError;
};

type State = {
  value: number;
};

class _MaxPersonPicker extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      value: props.selected,
    };
  }

  public render(): React.ReactNode {
    const { classes, label, max } = this.props;

    return (
      <FormControl className={classes.formControl}>
        <InputLabel>{label}</InputLabel>
        <NativeSelect value={this.state.value}
                      onChange={(event) => this.onMinimumPersonChange(parseInt(event.target.value, 10))}
                      input={<Input/>}
        >
          {new Array(max).fill(0).map((x, i) => (
            <option key={i} value={i + 1}>{i + 1}</option>
          ))}
        </NativeSelect>
      </FormControl>
    );
  }

  private onMinimumPersonChange(value: number): void {
    this.props.onChange(value);
    this.setState({ value });
  }
}

export const MaxPersonPicker = withStyles(styles)(_MaxPersonPicker);

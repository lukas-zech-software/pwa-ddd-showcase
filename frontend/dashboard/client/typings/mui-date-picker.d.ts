import { InputBaseProps } from '@material-ui/core/InputBase';

declare module 'material-ui-pickers/DateTimePicker' {

  import { InputBaseProps }           from '@material-ui/core/InputBase';
  import { DateTimePickerModalProps } from 'material-ui-pickers/DateTimePicker/DateTimePickerModal';
  import { ComponentClass }           from 'react';

  type Props = DateTimePickerModalProps & {
    error?: boolean;
    helperText?: string;
    label: string;
    className: string;
    InputProps: InputBaseProps;
  };

  const DateTimePickerModal: ComponentClass<Props>;

  export default DateTimePickerModal;
}

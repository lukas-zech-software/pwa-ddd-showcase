export type MessageVariant =
  'success' |
  'warning' |
  'error' |
  'disabled' |
  'info' ;

export type IGlobalMessage = {
  id: string;
  message: string;
  variant: MessageVariant;
  duration?: number;
};

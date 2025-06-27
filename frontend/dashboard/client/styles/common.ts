import { Theme }         from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';

export { default as PublishedIcon } from '@material-ui/icons/CheckCircle';
export { default as NotPublishedIcon } from '@material-ui/icons/Schedule';

export const fullHeight = {
  height: '100%',
};

export const flex: CSSProperties = {
  display:  'flex',
  flexFlow: 'row wrap',
};

export const flexFullWidth: CSSProperties = {
  flexBasis: '100%',
};

export const getDealColors = (theme: Theme) => ({
  active: theme.palette.secondary.main,

  special: theme.palette.primary.dark,

  published: theme.palette.primary.main,

  notPublished: theme.palette.grey[500],

  old: {
    opacity:         0.5,
    backgroundColor: theme.palette.grey[300] + ' !important',
  },
});

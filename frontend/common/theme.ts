import { createMuiTheme } from '@material-ui/core';
import { ThemeOptions }   from '@material-ui/core/styles/createMuiTheme';

export const ACTIVE_COLOR = '#296E01';

const theme1: ThemeOptions  = {
  palette:   {
    primary:   {
      main: '#FFB031',
    },
    secondary: {
      main: '#FA8231',
    },
  },
  overrides: {
    MuiCardActions: {
      // make disableSpacing={false} the default and give the buttons spacing
      spacing: {
        '& > * + *': {
          marginLeft: '8px !important',
        },
      },
    },
    MuiTooltip:     {
      tooltip: {
        fontSize: '0.8rem !important',
      },
    },
  },
};
export const dashboardTheme = createMuiTheme(theme1);

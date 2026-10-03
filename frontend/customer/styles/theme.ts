import { OverrideProps } from '@material-ui/core/OverridableComponent';
import {
  createMuiTheme,
  Theme,
}                        from '@material-ui/core/styles';
import { IS_SERVER }     from '@my-old-startup/frontend-common/constants';
import {
  APP_HEADER_HEIGHT,
  BOTTOM_NAV_HEIGHT,
}                        from '../common/constants';

export const ACTIVE_COLOR         = '#228C20';
export const ACTIVE_COLOR_RGBA    = 'rgba(41, 110, 1, 0.5)';
export const LATER_COLOR_RGBA     = 'rgba(0, 0, 0, 0.5)';
export const OVER_COLOR_RGBA      = 'rgba(244, 67, 54, 0.5)';
export const PRIMARY_COLOR_RGBA   = 'rgba(255, 176, 49, 0.75)';
export const SECONDARY_COLOR_RGBA = 'rgba(250, 130, 49, 0.5)';

export const MuiButtonContainedSecondary: OverrideProps<any, any> = {
  backgroundColor: '#F2F2F2',
  '&:hover':       {
    backgroundColor: '#E5E5E5',
  },
};

const primaryMain   = '#FFB031';
const secondaryMain = '#FA8231';

export const theme = createMuiTheme(
  {
    palette:   {
      primary:   { main: primaryMain },
      secondary: { main: secondaryMain },
    },
    overrides: {
      MuiCssBaseline: {
        '@global': {
          'body': {
            backgroundColor: '#FFF',
          },
        },
      },
      MuiTypography:  {
        root: {
          display: 'block',
        },
      },
      MuiButton:      {
        containedPrimary:   {
          backgroundImage: `linear-gradient(to bottom right, ${secondaryMain}, ${primaryMain})`,
        },
        containedSecondary: MuiButtonContainedSecondary,
        contained:          {
          backgroundColor: '#E2E2E2',
        },
      },
      MuiCard:        {},
      MuiCardActions: {
        // make disableSpacing={false} the default and give the buttons spacing
        spacing: {
          '& > * + *': {
            marginLeft: '8px !important',
          },
        },
      },
      MuiSnackbar:    {
        anchorOriginTopCenter: {
          top: '72px !important',
        },
      },
    },
  },
);

export function getInnerHeight(theme: Theme, addition = 0): string {
  if (IS_SERVER) {
    return '0px';
  }
  return `${window.innerHeight -
  theme.spacing(APP_HEADER_HEIGHT + BOTTOM_NAV_HEIGHT) +
  addition}px`;
}

import {
  createStyles,
  Theme,
  WithStyles,
  withStyles,
} from '@material-ui/core';

import { CUSTOMER_COMMON_ROUTES } from '@my-old-startup/common/routes/FrontendRoutes';

import { GlobalMessageContainer } from '@my-old-startup/frontend-common/components/growl';
import { globalMessageService }   from '@my-old-startup/frontend-common/services/GlobalMessageService';
import clsx                       from 'clsx';
import { observer }               from 'mobx-react';
import { WithRouterProps }        from 'next/dist/client/with-router';
import { withRouter }             from 'next/router';
import * as React                 from 'react';
import {
  BOTTOM_NAV_HEIGHT,
  TOP_NAV_HEIGHT,
}                                 from '../../common/constants';
import { locale }                 from '../../common/locales';
import { searchStore }            from '../../store/SearchStore';
import { getInnerHeight }         from '../../styles/theme';
import { TopAppBar }              from './AppBar';
import { BottomNavigation }       from './BottomNavigation';
import { FilterChangedDialog }    from './FilterChangedDialog';
import { OfflineMessage }         from './OfflineMessage';
import { PrivacyBar }             from './PrivacyBar';
import { SideMenu }               from './SideMenu';
import { UpdateMessage }          from './UpdateMessage';

const styles = (theme: Theme) => createStyles(
  {
    iosSticky:   {
      position: '-webkit-sticky',
    },
    main:        {
      paddingTop:                   theme.spacing(TOP_NAV_HEIGHT),
      backgroundImage:              'url(https://storage.googleapis.com/static.my-old-startups-domain.de/images/list_background.jpg)',
      backgroundRepeat:             'repeat',
      backgroundPosition:           '50% 50%',
      backgroundAttachment:         'fixed',
      '-webkit-overflow-scrolling': 'touch',
      '&.isMap':                    {
        height: getInnerHeight(theme, theme.spacing(10)),
      },
      '&.isDetails':                {
        height:     '100vh',
      },
    },
    mainLoading: {
      minHeight: getInnerHeight(theme, theme.spacing(3)),
    },
    footer: {
      position:  'fixed',
      bottom:    0,
      zIndex:    100,
      width:     '100%',
      borderTop: '1px solid ' + theme.palette.grey[400],
      boxShadow: '0px -2px 4px -1px rgba(0,0,0,0.2)',

      height: theme.spacing(BOTTOM_NAV_HEIGHT),
    },
  },
);

type Props = WithStyles<typeof styles> & WithRouterProps;

type State = {
  isOpen: boolean;
  markInstall: boolean;
};

@observer
class _AppContainer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen:      false,
      markInstall: false,
    };
  }

  public componentDidMount(): void {
    if (window.location.search.includes('markInstall=true')) {
      this.setState(
        {
          isOpen:      true,
          markInstall: true,
        },
      );
    }
    this.fixOrientation();

    const elementById = window.document.getElementById('splash--root');
    if (elementById) {
      setTimeout(() => elementById.remove(), 500);
    }
  }

  public render(): React.ReactNode {
    const { classes, router }     = this.props;
    const { isOpen, markInstall } = this.state;
    const isIndex                 = router.pathname === CUSTOMER_COMMON_ROUTES.index;

    if (isIndex) {
      return this.props.children;
    }

    const isMap     = router.pathname.endsWith('/map');
    const isDetails = router.pathname.includes('/details');

    return (
      <>
        <TopAppBar onMenuClick={() => this.setState({ isOpen: true })}/>

        <GlobalMessageContainer
          origin={{
            vertical:   'top',
            horizontal: 'center',
          }}
          hideClose
        />

        <SideMenu isOpen={isOpen}
                  onClose={() => this.setState({ isOpen: false })}
                  onOpen={() => this.setState(
                    {
                      isOpen:      true,
                      markInstall: false,
                    },
                  )}
                  markInstall={markInstall}
        />

        <main className={clsx(classes.main, {
          [classes.mainLoading]: searchStore.isLoading,
          isMap,
          isDetails,
        })}>
          {this.props.children}
        </main>

        {isDetails === false && (
          <footer className={clsx(classes.footer, classes.iosSticky)}>
            <BottomNavigation/>
          </footer>)}

        <PrivacyBar/>
        <UpdateMessage/>
        <OfflineMessage/>
        <FilterChangedDialog/>

      </>
    );
  }

  /**
   * Fix orientation if API is available
   */
  private fixOrientation(): void {
    if (window.screen.orientation !== undefined) {
      screen.orientation.lock('portrait-primary').catch(() => {
        // try to lock via API, but ignore any errors as its still experimental
      });
    }

    window.addEventListener('orientationchange', () => {
      if (window.matchMedia('(orientation: portrait)').matches) {
        globalMessageService.pushMessage(
          {
            message: locale.error.orientationWarning,
            variant: 'warning',
          },
        );
      }
    });
  }
}

export const AppContainer = withRouter(withStyles(styles)(_AppContainer));

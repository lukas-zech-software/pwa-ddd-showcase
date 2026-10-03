import {
  createStyles,
  ListItem,
  ListItemIcon,
  ListItemText,
  Theme,
  WithStyles,
  withStyles,
}                                   from '@material-ui/core';
import { GetApp }                   from '@material-ui/icons';
import {
  IS_IOS,
  IS_PWA,
}                                   from '@my-old-startup/frontend-common/constants';
import { globalMessageService }     from '@my-old-startup/frontend-common/services/GlobalMessageService';
import { logService }               from '@my-old-startup/frontend-common/services/LogService';
import clsx                         from 'clsx';
import { observer }                 from 'mobx-react';
import * as React                   from 'react';
import {
  DownloadLabel,
  EventCategory,
}                                   from '../../common/GAEvent';
import { locale }                   from '../../common/locales';
import { customerAnalyticsService } from '../../services/customerAnalyticsService';
import { InstallationDialog }       from './webApp/InstallationDialog';
import { webAppInstallStore }       from './webApp/WebAppInstallStore';

const styles = (theme: Theme) => createStyles(
  {
    drawerPaper:              {
      position: 'relative',
      width:    300,
    },
    markInstall:              {
      backgroundColor: theme.palette.primary.light,
    },
    '@keyframes markInstall': {
      '0%':   {
        opacity: 1,
      },
      '50%':  {
        opacity: .5,
      },
      '100%': {
        opacity: 1,
      },
    },
    animateMarkInstall:       {
      animationName:           '$markInstall',
      animationDuration:       '1s',
      animationIterationCount: 3,
    },
  },
);

type Props = WithStyles<typeof styles> & {
  markInstall: boolean;
};

type State = {
  isAndroid: boolean;
  isIOS: boolean;
};

@observer
class _SideMenuAppInstallItem extends React.Component<Props, State> {

  constructor(props: Readonly<Props>) {
    super(props);

    this.state = {
      isAndroid: false,
      isIOS:     false,
    };
  }

  public componentDidMount(): void {
    if (IS_IOS) {
      return this.setState({ isIOS: true });
    }
    this.setState({ isAndroid: true });
  }

  public showInstallPrompt(): void {
    if (webAppInstallStore.isAppInstallPromptAvailable) {
      const deferredPrompt = webAppInstallStore.deferredPrompt;
      // The user has had a positive interaction with our app and Chrome
      // has tried to prompt previously, so let's show the prompt.
      deferredPrompt.prompt();

      // Follow what the user has done with the prompt.
      deferredPrompt.userChoice.then((choiceResult: any) => {
        // We no longer need the prompt.  Clear it up.
        webAppInstallStore.reset();

        if (choiceResult.outcome === 'accepted') {
          globalMessageService.pushMessage({
            message: locale.install.installSuccess,
            variant: 'success',
          });
        } else {
          globalMessageService.pushMessage({
            message: locale.install.installAbort,
            variant: 'warning',
          });
        }

      }).catch((e: any) => {
        logService.error('Error while installing app', e);
        globalMessageService.pushMessage({
          message: `${locale.install.installError} ${locale.install.installAbort}`,
          variant: 'error',
        });
      });
    }
  }

  public render(): React.ReactNode {
    const { classes, markInstall } = this.props;
    const { isAndroid, isIOS }     = this.state;

    if (IS_PWA) {
      return null;
    }

    return (
      <ListItem button
                className={clsx({
                  [classes.animateMarkInstall]: markInstall,
                  [classes.markInstall]:        markInstall,
                })}
                onClick={() => {
                  customerAnalyticsService.trackEvent(
                    {
                      category: EventCategory.AppCommon,
                      action:   'app-download',
                      label:    DownloadLabel.Menu,
                    },
                  );

                  if (webAppInstallStore.isAppInstallPromptAvailable) {
                    this.showInstallPrompt();
                  } else {
                    webAppInstallStore.showDialog();
                  }
                }}>
        <ListItemIcon>
          <GetApp/>
        </ListItemIcon>
        <ListItemText primary={locale.drawer.items.app}/>

        <InstallationDialog
          isOpen={webAppInstallStore.showAppInstallDialog && isIOS}
          image={'//storage.googleapis.com/static.my-old-startups-domain.de/images/ios_install.png'}
          onClose={() => {
            webAppInstallStore.reset();
          }}/>
        <InstallationDialog
          isOpen={webAppInstallStore.showAppInstallDialog && isAndroid}
          image={'//storage.googleapis.com/static.my-old-startups-domain.de/images/android_install.png'}
          onClose={() => {
            webAppInstallStore.reset();
          }}/>
      </ListItem>
    );
  }
}

export const SideMenuAppInstallItem = withStyles(styles)(_SideMenuAppInstallItem);

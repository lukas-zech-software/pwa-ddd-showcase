/* eslint-disable @typescript-eslint/tslint/config */
import CssBaseline                  from '@material-ui/core/CssBaseline';
import { ThemeProvider }            from '@material-ui/styles';
import { CUSTOMER_COMMON_ROUTES }   from '@my-old-startup/common/routes/FrontendRoutes';
import { IS_PRODUCTION }            from '@my-old-startup/frontend-common/constants';
import { GoogleAnalyticsService }   from '@my-old-startup/frontend-common/services/GoogleAnalyticsService';
import { logService }               from '@my-old-startup/frontend-common/services/LogService';
import App                          from 'next/app';
import Head                         from 'next/head';
import Router                       from 'next/router';
import * as React                   from 'react';
import { ErrorInfo }                from 'react';
import { CUSTOMER_GA_TRACKING_ID }  from '../common/constants';
import {
  DownloadLabel,
  EventCategory,
}                                   from '../common/GAEvent';
import { pushRoute }                from '../common/routeUtils';
import { AppContainer }             from '../components/common/AppContainer';
import { webAppInstallStore }       from '../components/common/webApp/WebAppInstallStore';
import { customerAnalyticsService } from '../services/customerAnalyticsService';
import { theme }                    from '../styles/theme';

const globalCss    = require('../styles/global.min.css').toString();

const description = 'my-old-startups-domain bietet dir die Möglichkeit alle Informationen zum aktuellen Service von Gastronomen in deiner Nähe zu entdecken.';

class MyApp extends App {
  public constructor(props: any) {
    super(props);

    // GA should also be installed on server side to track initial page loads
    this.installGoogleAnalytics();
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    logService.error(`Caught error in customer: ${error}`, {
      error,
      errorInfo,
    });
    void pushRoute(CUSTOMER_COMMON_ROUTES.error, CUSTOMER_COMMON_ROUTES.error);
  }

  public componentDidMount(): void {
    this.addAppInstallPromptHandler();
    this.addAppInstallSuccessHandler();

    // Try to hide the address bar
    window.scrollTo(0, 1);

    window.addEventListener('popstate', () => {
      // Always scroll to top
      window.scrollTo(0, 1);
    });

    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }

  public render(): JSX.Element {
    const { Component, pageProps } = this.props;

    return (
      <>
        <Head>
          <title>my-old-startups-domain | Unterstütze Gastronomen in deiner Nähe</title>
          <meta key="og:title" name="og:title" property="og:title" content="my-old-startups-domain | Aktueller Service von Gastronomen in deiner Nähe"/>
          <meta key="description" name="description"
                content={description}/>
          <meta key="og:description"  name="og:description" property="og:description"
                content={description}/>

          <meta key="og:url" name="og:url" property="og:url" content="https://app.my-old-startups-domain.de/"/>
          <meta key="og:site_name" name="og:site_name" property="og:site_name" content="my-old-startups-domain"/>
          <meta key="og:locale" name="og:locale" property="og:locale" content="de_DE"/>
          <meta key="og:type" name="og:type" property="og:type" content="website"/>
          <meta key="og:image" name="og:image" property="og:image" content="https://my-old-startups-domain.de/wp-content/uploads/2020/04/logo.jpg"/>
          <style>
            {globalCss}
          </style>
        </Head>
        {/* MuiThemeProvider makes the theme available down the React
         tree thanks to React context. */}
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline/>
          <AppContainer>
            {/* Pass pageContext to the _document though the renderPage enhancer
             to render collected styles on server-side. */}
            <Component {...pageProps} />
          </AppContainer>
        </ThemeProvider>
      </>
    );
  }

  private installGoogleAnalytics(): void {
    if (IS_PRODUCTION) {
      GoogleAnalyticsService.init(CUSTOMER_GA_TRACKING_ID, 'app.my-old-startups-domain.de');
      if (!GoogleAnalyticsService.isAnalyticsDisabled()) {
        Router.events.on('routeChangeComplete', (url: string) => GoogleAnalyticsService.trackPageView(url));
      }
    }
  }

  // Catch the install prompt for later usage
  private addAppInstallPromptHandler(): void {
    window.addEventListener('beforeinstallprompt', (e: any) => {
      e.preventDefault();
      webAppInstallStore.deferredPrompt = e;
    });
  }

  private addAppInstallSuccessHandler(): void {
    window.addEventListener('appinstalled', () => {
      customerAnalyticsService.trackEvent({
                                            category: EventCategory.AppCommon,
                                            action:   'app-download',
                                            label:    DownloadLabel.Completed,
                                          });
    });
  }
}

export default MyApp;

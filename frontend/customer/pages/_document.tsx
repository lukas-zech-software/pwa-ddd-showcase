/* eslint-disable @typescript-eslint/tslint/config */
import { ServerStyleSheets }     from '@material-ui/styles';
import Document, {
  Head,
  Main,
  NextScript,
}                                from 'next/document';
import * as React                from 'react';
import { CUSTOMER_MAPS_OPTIONS } from '../common/constants';

class MyDocument extends Document {
  public render(): JSX.Element {

    return (
      <html lang="de" dir="ltr">
        <Head>
          <meta charSet="utf-8"/>
          <meta name="google" content="notranslate"/>
          <meta httpEquiv="Content-Language" content="de"/>
          <meta httpEquiv="X-UA-Compatible" content="IE=edge"/>
          {/*TODO*/}
          {/*<meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests"/>*/}
          {/* Use minimum-scale=1 to enable GPU rasterization */}
          <meta name="viewport"
                content="width=device-width,initial-scale=1,minimum-scale=1, user-scalable=yes, minimal-ui"/>

          <link rel="preconnect" href="https://storage.googleapis.com"/>
          <link rel="preconnect" href="https://maps.googleapis.com"/>
          <link rel="preconnect" href="https://fonts.gstatic.com"/>
          <link rel="preconnect" href="https://maps.gstatic.com"/>

          <link rel="preconnect" href="https://www.google-analytics.com"/>

           <link rel="preload" as="font" crossOrigin="crossorigin" type="font/woff2"
                href="https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9fBBc4AMP6lQ.woff2"/>
          <link rel="preload" as="font" crossOrigin="crossorigin" type="font/woff2"
                href="https://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2"/>
          <link rel="preload" as="font" crossOrigin="crossorigin" type="font/woff2"
                href="https://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5fBBc4AMP6lQ.woff2"/>

          {/* image is always used */}
          <link rel="prefetch" href="https://storage.googleapis.com/static.my-old-startups-domain.de/images/list_background.jpg"/>

          <link rel="manifest" href="/manifest.json"/>

          <meta name="apple-mobile-web-app-status-bar-style" content="translucent"/>
          <meta name="apple-mobile-web-app-capable" content="yes"/>
          <meta name="mobile-web-app-capable" content="yes"/>
          <meta name="apple-mobile-web-app-title" content="my-old-startups-domain"/>
          <meta name="application-name" content="my-old-startups-domain"/>

          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
            href="/apple_splash_1125.png?v=2"/>
          <link
            rel="apple-touch-startup-image"
            media="screen and (device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
            href="/apple_splash_750.png?v=2"
          />
          <link href="/apple_splash_2048.png?v=2" sizes="2048x2732" rel="apple-touch-startup-image"/>
          <link href="/apple_splash_1668.png?v=2" sizes="1668x2224" rel="apple-touch-startup-image"/>
          <link href="/apple_splash_1536.png?v=2" sizes="1536x2048" rel="apple-touch-startup-image"/>
          <link href="/apple_splash_1242.png?v=2" sizes="1242x2208" rel="apple-touch-startup-image"/>
          <link href="/apple_splash_750.png?v=2" sizes="750x1334" rel="apple-touch-startup-image"/>
          <link href="/apple_splash_640.png?v=2" sizes="640x1136" rel="apple-touch-startup-image"/>
          <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=2"/>
          <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152?v=2"/>

          <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png?v=2"/>
          <link rel="icon" type="image/png" sizes="194x194" href="/favicon-194x194.png?v=2"/>
          <link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png?v=2"/>
          <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png?v=2"/>
          <link rel="mask-icon" href="/safari-pinned-tab.svg?v=2" color="#FFF"/>
          <link rel="shortcut icon" href="/favicon.ico?v=2"/>
          <link rel="icon" href="/favicon.ico?v=2"/>
          <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
          <meta name="msapplication-TileColor" content="#FFF"/>
          {/* PWA primary color */}
          <meta
            name="theme-color"
            content="#FFF"
          />

          <script type="text/javascript"
                  dangerouslySetInnerHTML={{ __html: 'var defer;  window.gmapsPromise = new Promise((resolve)=>defer=resolve); function init_google_maps_cb(){defer(google);}' }}/>
          <script async
                  src="https://storage.googleapis.com/static.my-old-startups-domain.de/js/stackdriver-errors-concat.min.js.gz">
          </script>
          <script defer
                  src={`https://maps.googleapis.com/maps/api/js?callback=init_google_maps_cb&key=${CUSTOMER_MAPS_OPTIONS.key}&language=de&libraries=places`}>
          </script>

        </Head>
        <body>
          <p className="browsehappy">Sie verwenden einen <strong>stark veralteten</strong> Browser. Bitte <a
            rel="noopener noreferrer nofollow"
            href="http://outdatedbrowser.com">upgraden Sie zu einem neueren Browser</a>, um diese Seite nutzen zu
            können.
          </p>

          <Main/>
          <NextScript/>

        </body>
      </html>
    );
  }
}

MyDocument.getInitialProps = async ctx => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  // Render app and page and get the context of the page with collected side effects.
  const sheets             = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({

                         enhanceApp: App => props => sheets.collect(<App {...props} />),
                       });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      <React.Fragment key="styles">
        {initialProps.styles}
        {sheets.getStyleElement()}
      </React.Fragment>,
    ],
  };
};

export default MyDocument;

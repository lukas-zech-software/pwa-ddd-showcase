import * as React from "react";
import { IS_PRODUCTION, IS_STAGING } from "@my-old-startup/frontend-common/constants";

export function FacebookPixel() {
  if (!IS_PRODUCTION || IS_STAGING) {
    return null;
  }

  return (
    <>
      <script async defer dangerouslySetInnerHTML={{
        __html:
          `!function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window,document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '2427048214017782');
        fbq('track', 'PageView');`
      }}>
      </script>
      <noscript>
        <img height="1" width="1"
             src="https://www.facebook.com/tr?id=2427048214017782&ev=PageView&noscript=1"/>
      </noscript>
    </>
  );
}

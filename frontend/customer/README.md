# Known issues>

When usin the thr RequestService in the QustomerApp you will propably get this error> 


`Error: Cannot find module 'auth0-js'
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:580:15)
    at Function.Module._load (internal/modules/cjs/loader.js:506:25)
    at Module.require (internal/modules/cjs/loader.js:636:17)
    at require (internal/modules/cjs/helpers.js:20:18)
    a`
    
That is because youe required the full RequestService which includes auth0 authentification.
In the Customer App onlzy require the `UnauthorizedRequestService.ts` thishc doe not include the auth0 dependecy

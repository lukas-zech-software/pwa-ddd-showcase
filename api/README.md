# Architecture
DDD

## Design Decisions

### Repositories / Facades
Facades access the DB directly and return the data as POJOs
Repositories use these POJOs to create instance of the DDD entities, which then can be used to execute business logic on them
**When quering data always use the repositories and not the facades!**
The repositories execute important business logic


### Adatapters
Entity data should neither be sent or received directly to/from the API. It should always be sent through and converted by adapters.
These ensure, that the data does not leak sensitive information to the outside and be also ensurecorrect format like parsing when receiving data 


## API Modes
The API will be started in different modes to fullfil different roles.
These roles include different feature set and security restrictions.
Security is enforced by each API only mounting routes that have the correct access level

### Public API
The API for the public customer facing website
Mounts only routes that are publicy available and do not need authorization

### Dashboard API
The API for the Restaurant Dashboard
Mounts routes that may only be accessed by logged in restaurant users

### Hub API
The API for the Admin Dashboard
Mounts routes that may only be accessed by logged in admin users
Will later be secured by client certificates

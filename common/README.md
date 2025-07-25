# Isomporphic code shared between Backend and Frontends

Typescript interfaces and util implementations that are used in both Backend and Frontends and must always be in same state to ensure compatibiltiy on the REST API.

The Typescript code is used in all projects during design time and will be compiled into every package. 
There is no shared runtime dependency like a npm package that must be installed.

## Interfaces / Contracts

**Interfaces** ensure that the parameters and payloads of REST API routes are hardtyped on both sides of the Request.

**Contracts** are sepcialised interfaces that classes for Controllers in the backend and Facades in the frontend can implement to create a hard-typed client and server implementation.
This effectively creates a hard-typed design time dependency ensure typesafety of REST API requests between client and server.

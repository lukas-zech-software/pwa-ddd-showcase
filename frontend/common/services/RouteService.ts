import { XRoute }               from '@my-old-startup/common/routes/ApiRoutes';
import { createBrowserHistory } from 'history';

export type ParamObject = {
  [index: string]: string;
};

const paramRegex      = /(\/?:[a-zA-Z]+\??)/g,
      replaceRegex    = /[^a-zA-Z]/g,
      // this is a string as it is concatenated before compiled to regex
      // eslint-disable-next-line no-useless-escape
      paramValueRegex = `([^\/]+)`;

export const history = createBrowserHistory();

export class RouteService<TRoutes extends string> {

  constructor(private routes: object) {
  }

  /**
   * Route to the provided route with the provided parameters
   *
   * @param {DashboardRoutes} route
   * @param {ParamObject} routeParams
   * @param replace
   * @param state
   */
  public routeTo(route: TRoutes, routeParams?: ParamObject, replace = false, state?: object): void {
    let routeString = route.toString();

    if (routeParams !== undefined) {
      routeString = this.getRoute(route, routeParams);
    }

    if (replace === true) {
      history.replace(routeString, state);
    } else {
      history.push(routeString, state);
    }

    scrollTo(0, 0);
  }

  /**
   * Get the state object that is associated to the current history entry
   */
  public getCurrentRouteState<T extends object>(): T | undefined {
    return history.location.state;
  }

  /**
   * Get the provided route filled with the parameters of the provided object
   *
   * @param {DashboardRoutes} route
   * @param {ParamObject} routeParams
   * @return {string}
   */
  public getRoute<T>(route: XRoute<T>, routeParams: T): string;
  public getRoute(route: TRoutes | string, routeParams: { [index: string]: string } = {}): string {
    let path = route.toString();

    const matches = path.match(paramRegex);

    if (matches) {
      matches.forEach((match) => {
        const isOptional = match.includes('?'),
              paramName  = match.replace(replaceRegex, '');

        let value = routeParams[paramName];

        if (isOptional === false && value === undefined) {
          throw new Error(
            `Key ${paramName} is not defined on parameter object ${JSON.stringify(routeParams)} for route ${path}`,
          );
        }

        if (value === undefined) {
          value = '';
        } else {
          value = `/${encodeURIComponent(value.toString())}`;
        }

        path = path.replace(match, value);
      });
    }

    return path;
  }

  /**
   * Get the values for all parameters of the provided route from the provided url using the RegExp for each parameter.
   * IMPORTANT: While the route parameter is optional, this method is faster, when it is provided manually.
   * Only omit it, if there are multiple possible routes for your case.
   */
  public getParameterValues(route: TRoutes): ParamObject | never {
    const parameterNames: string[] = [];

    const path = route.toString();
    let result: ParamObject | undefined;

    const parts = path.split('/');

    parts.forEach((part, index) => {
      const match = part.match(paramRegex);
      if (match) {
        // save the parameter name
        parameterNames.push(match[0].replace(':', ''));
        // replace each matched parameter with a regex group to extract that parameter
        parts[index] = paramValueRegex;
      }
    });

    const pathRegex       = new RegExp(parts.join('/')),
          currentUrl      = this.getCurrentPath(),
          parameterValues = currentUrl.match(pathRegex);

    if (parameterValues) {
      // remove global match
      parameterValues.shift();

      result = {} as ParamObject;

      parameterValues.forEach((value, index) => {
        // map each extracted parameter value to its name
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        result![parameterNames[index]] = decodeURIComponent(value);
      });
    }

    if (result === undefined) {
      throw new Error(`Could not find parameters for Route ${route} in URL ${currentUrl}`);
    }

    return result;
  }

  /**
   * Check if the provided route is currently active
   */
  public isRouteActive(route: TRoutes, isExact = false, data?: {}): boolean {
    let path = route.toString();

    if (data !== undefined) {
      path = this.getRoute(route, data);
    }

    const parts = path.split('/');

    parts.forEach((part, index) => {
      if (paramRegex.test(part)) {
        // replace each matched parameter with a regex group to extract that parameter
        parts[index] = paramValueRegex;
      }
    });

    let regex = parts.join('/');

    if (isExact) {
      regex += '$';
    }

    const pathRegex  = new RegExp(regex),
          currentUrl = this.getCurrentPath();

    return pathRegex.test(currentUrl) === true;
  }

  /**
   * Find the route template for the currently active route.
   * Returns undefined if no match is found.
   */
  public getCurrentRouteTemplate(): TRoutes | undefined {
    return Object.values(this.routes).find((route: TRoutes) => this.isRouteActive(route, true));
  }

  /**
   * Get the current path from the url
   * Note: Use this method to make mocking possible
   */
  public getCurrentPath(): string {
    return window.location.pathname;
  }
}

/*

 export class RouteServiceMock extends RouteService implements AutoMock<RouteService> {
 public mockData = {
 routeTo:                 () => undefined,
 getRoute:                () => '/TESTAPP/Track/Main',
 getParameterValues:      () => ({ appAcronym: 'TESTAPP', trackName: 'Main' }),
 isRouteActive:           () => false,
 getCurrentPath:          () => '/TESTAPP/Track/Main',
 getCurrentRouteTemplate: () => Routes.TrackBase
 };

 public constructor() {
 super();
 autoMockAllMethods(this);
 }
 }

 export function mockRouteService(): void {
 Object.assign(routeService, new RouteServiceMock());
 }

 export function unmockRouteService(): void {
 Object.assign(routeService, new RouteService());
 }
 */

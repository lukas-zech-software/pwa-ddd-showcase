import { IS_SERVER } from '@my-old-startup/frontend-common/constants';
import Router        from 'next/router';

const paramRegex = /(\/?:[a-zA-Z]+\??)/g,
      replaceRegex = /[^a-zA-Z]/g;

export function getRoute(route: string, routeParams: any = {}): string {
  let path = route.toString();
  const matches = path.match(paramRegex);

  if (matches) {
    matches.forEach(match => {
      const isOptional = match.includes('?'),
            paramName = match.replace(replaceRegex, '');

      let value = routeParams[paramName];

      if (isOptional === false && value === undefined) {
        throw new Error(
          `Key ${paramName} is not defined on parameter object ${JSON.stringify(
            routeParams,
          )} for route ${path}`,
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

export function getLastRoute(): string {
  return (Router as any).lastPath;
}

export const pushRoute = (
  nextFile: string,
  route: string,
  routeParams: any = {},
) => {
  const routeString = getRoute(route, routeParams);

  if (!IS_SERVER) {
    (Router as any).lastPath = window.location.pathname;
  }

  Router.push({
                pathname: nextFile,
                query:    routeParams,
              }, routeString).then(
    () => {
      if (!IS_SERVER) {
        window.scrollTo(0, 0);
      }
    },
  );
};

export const pushRouteDirect = (
  route: string,
) => {
   if (!IS_SERVER) {
    (Router as any).lastPath = window.location.pathname;
  }

  Router.push(route).then(
    () => {
      if (!IS_SERVER) {
        window.scrollTo(0, 0);
      }
    },
  );
};

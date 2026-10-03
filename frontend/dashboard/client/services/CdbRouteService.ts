import { CommonRoutes, DashboardRoutes } from '@my-old-startup/frontend-common/routes';
import { RouteService }                  from '@my-old-startup/frontend-common/services/RouteService';

export const routeService = new RouteService<DashboardRoutes | CommonRoutes>(DashboardRoutes);

import { RouteService } from '@my-old-startup/frontend-common/services/RouteService';
import { HubRoutes }    from '../common/HubRoutes';

export const routeService = new RouteService<HubRoutes>(HubRoutes);

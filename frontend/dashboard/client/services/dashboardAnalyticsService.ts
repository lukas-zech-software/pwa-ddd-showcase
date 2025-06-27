import { GoogleAnalyticsService } from '@my-old-startup/frontend-common/services/GoogleAnalyticsService';
import { DashboardEvent }         from '../common/GAEvent';

export const dashboardAnalyticsService = new GoogleAnalyticsService<DashboardEvent>();

import {
  CompanyFilter,
  IApiCompany,
  IApiDeal,
  IApiMarket,
  ILocation,
}                    from '@my-old-startup/common/interfaces';
import { EventArgs } from 'react-ga';

export type MarketIdentifier = {
  market: Pick<IApiMarket, 'id'>;
};

export type CompanyIdentifier = {
  company: Pick<IApiCompany, 'id'>;
};

export type DealIdentifier = CompanyIdentifier & {
  deal: Pick<IApiDeal, 'id'>;
};

export type NewsIdentifier = CompanyIdentifier & {
  deal: Pick<IApiDeal, 'id'>;
};

export enum EventCategory {
  AppCommon         = 'app-common',
  DealImpression    = 'deal-impression',
  NewsImpression    = 'news-impression',
  Share             = 'share',
  CompanyImpression = 'company-impression',
  MarketImpression  = 'market-impression',
  NavigationClicked = 'navigation-clicked',
  DetailsClicked    = 'details-clicked',
  NoDealsFound      = 'no-deals-found',
}

/* ACTIONS */

export enum DealImpressionAction {
  DealListCardShown    = 'deal-list-card-shown',
  DealListCardExpanded = 'deal-list-card-expanded',
  DealMapCardShown     = 'deal-map-card-shown',
}

export enum NewsImpressionAction {
  NewsListCardShown    = 'news-list-card-shown',
  NewsListCardExpanded = 'news-list-card-expanded',
  NewsMapCardShown     = 'news-map-card-shown',
}

export enum ShareAction {
  DealUrlCopy      = 'deal-url-copy',
  NewsUrlCopy      = 'deal-url-copy',
  DealRichShare    = 'deal-rich-share',
  NewsRichShare    = 'news-rich-share',
  CompanyUrlCopy   = 'company-url-copy',
  CompanyRichShare = 'company-rich-share',
}

export enum CompanyImpressionAction {
  CompanyListCardShown = 'company-list-card-shown',
  CompanyMapCardShown  = 'company-map-card-shown',
}
export enum MarketImpressionAction {
  MarketListCardShown = 'market-list-card-shown',
  MarketMapCardShown  = 'market-map-card-shown',
}

export enum NavigationAction {
  Deal    = 'deal',
  News    = 'news',
  Company = 'company',
  Market = 'market',
}

/* LABELS */

export enum DownloadLabel {
  Completed = 'completed',
  Menu      = 'menu',
}

/* EVENTS */

type AppDownloadEvent = {
  category: EventCategory.AppCommon;
  action: 'app-download';
  label: DownloadLabel;
} & EventArgs;

type DealImpressionEvent = {
  category: EventCategory.DealImpression;
  action: DealImpressionAction;
  label: string;
} & EventArgs;

type NewsImpressionEvent = {
  category: EventCategory.NewsImpression;
  action: NewsImpressionAction;
  label: string;
} & EventArgs;

/**
 * Event when an item was shared with the share button
 * {label} - the url which was shared
 */
type ShareEvent = {
  category: EventCategory.Share;
  action: ShareAction;
  label: string;
} & EventArgs;

type CompanyImpressionEvent = {
  category: EventCategory.CompanyImpression;
  action: CompanyImpressionAction;
  label: string;
} & EventArgs;

type MarketImpressionEvent = {
  category: EventCategory.MarketImpression;
  action: MarketImpressionAction;
  label: string;
} & EventArgs;

type NavigationEvent = {
  category: EventCategory.NavigationClicked;
  action: NavigationAction;
  label: string;
} & EventArgs;

type DetailsEvent = {
  category: EventCategory.DetailsClicked;
  action: NavigationAction;
  label: string;
} & EventArgs;

/**
 * Event when a customer provides a filter which does not return any deals
 */
type NoDealsFoundEvent = {
  category: EventCategory.NoDealsFound;
  /**
   * The latitude and longitude of the search location
   * `${lat}x${lng}`
   */
  action: string;
  /**
   * The JSON.stringify of the filter used
   */
  label: string;
} & EventArgs;

/* CREATORS */

export const dealListCardImpressionEvent = ({
                                              company,
                                              deal,
                                            }: DealIdentifier): DealImpressionEvent => ({
  category: EventCategory.DealImpression,
  action:   DealImpressionAction.DealListCardShown,
  label:    `${company.id}/${deal.id}`,
});

export const dealListCardExpandedEvent = ({
                                            company,
                                            deal,
                                          }: DealIdentifier): DealImpressionEvent => ({
  category: EventCategory.DealImpression,
  action:   DealImpressionAction.DealListCardExpanded,
  label:    `${company.id}/${deal.id}`,
});

export const dealMapCardImpressionEvent = ({
                                             company,
                                             deal,
                                           }: DealIdentifier): DealImpressionEvent => ({
  category: EventCategory.DealImpression,
  action:   DealImpressionAction.DealMapCardShown,
  label:    `${company.id}/${deal.id}`,
});

export const newsListCardImpressionEvent = ({
                                              company,
                                              deal,
                                            }: NewsIdentifier): NewsImpressionEvent => ({
  category: EventCategory.NewsImpression,
  action:   NewsImpressionAction.NewsListCardShown,
  label:    `${company.id}/${deal.id}`,
});

export const newsListCardExpandedEvent = ({
                                            company,
                                            deal,
                                          }: NewsIdentifier): NewsImpressionEvent => ({
  category: EventCategory.NewsImpression,
  action:   NewsImpressionAction.NewsListCardExpanded,
  label:    `${company.id}/${deal.id}`,
});

export const newsMapCardImpressionEvent = ({
                                             company,
                                             deal,
                                           }: NewsIdentifier): NewsImpressionEvent => ({
  category: EventCategory.NewsImpression,
  action:   NewsImpressionAction.NewsMapCardShown,
  label:    `${company.id}/${deal.id}`,
});

export const companyMapCardImpressionEvent = ({
                                                company,
                                              }: CompanyIdentifier): CompanyImpressionEvent => ({
  category: EventCategory.CompanyImpression,
  action:   CompanyImpressionAction.CompanyMapCardShown,
  label:    company.id,
});

export const companyListCardImpressionEvent = ({
                                                 company,
                                               }: CompanyIdentifier): CompanyImpressionEvent => ({
  category: EventCategory.CompanyImpression,
  action:   CompanyImpressionAction.CompanyListCardShown,
  label:    company.id,
});

export const marketMapCardImpressionEvent = ({
                                                market,
                                              }: MarketIdentifier): MarketImpressionEvent => ({
  category: EventCategory.MarketImpression,
  action:   MarketImpressionAction.MarketMapCardShown,
  label:    market.id,
});

export const marketListCardImpressionEvent = ({
                                                 market,
                                               }: MarketIdentifier): MarketImpressionEvent => ({
  category: EventCategory.MarketImpression,
  action:   MarketImpressionAction.MarketListCardShown,
  label:    market.id,
});

export const dealNavigationEvent = ({
                                      company,
                                      deal,
                                    }: DealIdentifier): NavigationEvent => ({
  category: EventCategory.NavigationClicked,
  action:   NavigationAction.Deal,
  label:    `${company.id}/${deal.id}`,
});

export const companyDetailsEvent = ({
                                      company,
                                    }: CompanyIdentifier): DetailsEvent => ({
  category: EventCategory.DetailsClicked,
  action:   NavigationAction.Company,
  label:    company.id,
});

export const companyNavigationEvent = ({
                                         company,
                                       }: CompanyIdentifier): NavigationEvent => ({
  category: EventCategory.NavigationClicked,
  action:   NavigationAction.Company,
  label:    company.id,
});

export const marketNavigationEvent = ({
                                        market,
                                      }: MarketIdentifier): NavigationEvent => ({
  category: EventCategory.NavigationClicked,
  action:   NavigationAction.Market,
  label:    market.id,
});

export const dealUrlCopyEvent = ({
                                   company,
                                   deal,
                                 }: DealIdentifier): ShareEvent => ({
  category: EventCategory.Share,
  action:   ShareAction.DealUrlCopy,
  label:    `${company.id}/${deal.id}`,
});

export const dealRichShareEvent = ({
                                     company,
                                     deal,
                                   }: DealIdentifier): ShareEvent => ({
  category: EventCategory.Share,
  action:   ShareAction.DealRichShare,
  label:    `${company.id}/${deal.id}`,
});

export const newsRichShareEvent = ({
                                     company,
                                     deal,
                                   }: NewsIdentifier): ShareEvent => ({
  category: EventCategory.Share,
  action:   ShareAction.NewsRichShare,
  label:    `${company.id}/${deal.id}`,
});

export const companyUrlCopyEvent = ({
                                      company,
                                    }: CompanyIdentifier): ShareEvent => ({
  category: EventCategory.Share,
  action:   ShareAction.CompanyUrlCopy,
  label:    `${company.id}`,
});

export const companyRichShareEvent = ({
                                        company,
                                      }: CompanyIdentifier): ShareEvent => ({
  category: EventCategory.Share,
  action:   ShareAction.CompanyRichShare,
  label:    `${company.id}`,
});

export const noDealsFoundEvent = ({
                                    location,
                                    filter,
                                  }: {
  location: ILocation;
  filter: CompanyFilter;
}): NoDealsFoundEvent => ({
  category: EventCategory.NoDealsFound,
  action:   `${location.coordinates.lat}x${location.coordinates.lng}`,
  label:    JSON.stringify(filter),
});

export type CustomerEvent =
  | AppDownloadEvent
  | DealImpressionEvent
  | NewsImpressionEvent
  | ShareEvent
  | CompanyImpressionEvent
  | MarketImpressionEvent
  | NavigationEvent
  | DetailsEvent
  | NoDealsFoundEvent;

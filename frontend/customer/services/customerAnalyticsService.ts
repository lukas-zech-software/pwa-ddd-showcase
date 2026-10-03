import { GoogleAnalyticsService } from '@my-old-startup/frontend-common/services/GoogleAnalyticsService';
import {
  CompanyIdentifier,
  companyListCardImpressionEvent,
  companyMapCardImpressionEvent,
  CustomerEvent,
  DealIdentifier,
  dealListCardExpandedEvent,
  dealListCardImpressionEvent,
  dealMapCardImpressionEvent,
  MarketIdentifier,
  newsListCardExpandedEvent,
  newsListCardImpressionEvent,
  newsMapCardImpressionEvent,
  marketListCardImpressionEvent,
  marketMapCardImpressionEvent
} from '../common/GAEvent';

class CustomerAnalyticsService extends GoogleAnalyticsService<CustomerEvent> {
  private newsSeen: Set<string> = new Set();
  private newsExpanded: Set<string> = new Set();
  private dealsSeen: Set<string> = new Set();
  private dealsExpanded: Set<string> = new Set();
  private companiesSeen: Set<string> = new Set();

  public dealListImpression({ company, deal }: DealIdentifier): void {
    if (!this.dealsSeen.has(deal.id)) {
      this.dealsSeen.add(deal.id);

      const event = dealListCardImpressionEvent({ company, deal });

      this.trackEvent(event);
    }
  }

  public dealCardExpanded({ company, deal }: DealIdentifier): void {
    if (!this.dealsSeen.has(deal.id)) {
      this.dealsSeen.add(deal.id);

      const event = dealListCardImpressionEvent({ company, deal });

      this.trackEvent(event);
    }

    if (!this.dealsExpanded.has(deal.id)) {
      this.dealsExpanded.add(deal.id);

      const event = dealListCardExpandedEvent({ company, deal });

      this.trackEvent(event);
    }
  }

  public dealMapImpression({ company, deal }: DealIdentifier): void {
    if (!this.dealsSeen.has(deal.id)) {
      this.dealsSeen.add(deal.id);

      const event = dealMapCardImpressionEvent({ company, deal });

      this.trackEvent(event);
    }
  }

  public newsListImpression({ company, deal }: DealIdentifier): void {
    if (!this.newsSeen.has(deal.id)) {
      this.newsSeen.add(deal.id);

      const event = dealListCardImpressionEvent({ company, deal });

      this.trackEvent(event);
    }
  }

  public newsCardExpanded({ company, deal }: DealIdentifier): void {
    if (!this.newsSeen.has(deal.id)) {
      this.newsSeen.add(deal.id);

      const event = newsListCardImpressionEvent({ company, deal });

      this.trackEvent(event);
    }

    if (!this.newsExpanded.has(deal.id)) {
      this.newsExpanded.add(deal.id);

      const event = newsListCardExpandedEvent({ company, deal });

      this.trackEvent(event);
    }
  }

  public newsMapImpression({ company, deal }: DealIdentifier): void {
    if (!this.newsSeen.has(deal.id)) {
      this.newsSeen.add(deal.id);

      const event = newsMapCardImpressionEvent({ company, deal });

      this.trackEvent(event);
    }
  }

  public companyListImpression({ company }: CompanyIdentifier): void {
    if (!this.companiesSeen.has(company.id)) {
      this.companiesSeen.add(company.id);

      const event = companyListCardImpressionEvent({ company });

      this.trackEvent(event);
    }
  }

  public companyMapImpression({ company }: CompanyIdentifier): void {
    if (!this.companiesSeen.has(company.id)) {
      this.companiesSeen.add(company.id);

      const event = companyMapCardImpressionEvent({ company });

      this.trackEvent(event);
    }
  }

  public marketListImpression({ market }: MarketIdentifier): void {
    if (!this.companiesSeen.has(market.id)) {
      this.companiesSeen.add(market.id);

      const event = marketListCardImpressionEvent({ market });

      this.trackEvent(event);
    }
  }

  public marketMapImpression({ market }: MarketIdentifier): void {
    if (!this.companiesSeen.has(market.id)) {
      this.companiesSeen.add(market.id);

      const event = marketMapCardImpressionEvent({ market });

      this.trackEvent(event);
    }
  }
}

export const customerAnalyticsService = new CustomerAnalyticsService();

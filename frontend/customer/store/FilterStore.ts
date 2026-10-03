import { DealTags }       from '@my-old-startup/common/enums/DealTags';
import {
  CompanyType,
  DateFilter,
}                         from '@my-old-startup/common/enums/types';
import { CustomerFilter } from '@my-old-startup/common/interfaces/common';
import { IS_SERVER }      from '@my-old-startup/frontend-common/constants';
import { storageService } from '@my-old-startup/frontend-common/services/StorageService';
import dayjs              from 'dayjs';
import {
  action,
  computed,
  observable,
}                         from 'mobx';
import { TimeInMs }       from '../../../common/datetime';
import { searchService }  from '../services/SearchService';

export const FILTER_AGE_STORAGE_KEY = 'FILTER_AGE_STORAGE_KEY';

export function setLastRefreshedTimestamp(): void {
  storageService.set(FILTER_AGE_STORAGE_KEY, Date.now().toString());
}

function getOutdatedTimeout(): string | null {
  return storageService.get(FILTER_AGE_STORAGE_KEY);
}

function getInitialFilter(): CustomerFilter {
  return {
    date: DateFilter.TODAY,
  };
}

export type SerializedFilterStore = CustomerFilter;

export class FilterStore {
  private interval: any;
  private hydrated: boolean = false;

  public hasLoadedOnce: boolean = false;

  @observable
  private _isDirty = false;

  @computed
  public get isDirty(): boolean {
    return this._isDirty;
  }

  @observable
  private _showIsDirtyDialog = false;

  @computed
  public get showIsDirtyDialog(): boolean {
    return this._showIsDirtyDialog;
  }

  public stopInterval(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = undefined;
    }
  }

  public set showIsDirtyDialog(value: boolean) {
    this._showIsDirtyDialog = value;
  }

  @observable private _filter: CustomerFilter = getInitialFilter();

  @computed
  public get filter(): CustomerFilter {
    // return clone to avoid accidental mutation
    return Object.assign({}, this._filter);
  }

  @observable
  private _newFilter: CustomerFilter = this._filter || getInitialFilter();

  @computed
  public get newFilter(): CustomerFilter {
    return this._newFilter;
  }

  constructor() {
    this.checkFilterOutdated();
  }

  @action
  public setFilter(filter: CustomerFilter | undefined): void {
    this._filter = filter || getInitialFilter();
  }

  @action
  public setDate(date: DateFilter): void {
    this._newFilter.date = date;
    this._isDirty        = true;
  }

  @action
  public setCompanyType(companyTypes: CompanyType[]): void {
    this._newFilter.companyTypes = companyTypes;
    this._isDirty                = true;
  }

  @action
  public setDealTags(dealTags: DealTags[]): void {
    this._newFilter.dealTags = dealTags;
    this._isDirty            = true;
  }

  @action
  public resetChanged(): void {
    this._isDirty           = false;
    this._showIsDirtyDialog = false;
    setLastRefreshedTimestamp();
  }

  @action
  public reset(): void {
    this.resetChanged();
    this._filter    = getInitialFilter();
    this._newFilter = this._filter;
    void this.apply(true);
  }

  @action
  public async apply(force = false): Promise<void> {
    if (this.isDirty === false && force === false) {
      return;
    }

    this.hasLoadedOnce = true;
    this._filter       = this._newFilter;
    this.resetChanged();
    setLastRefreshedTimestamp();

    return searchService.search();
  }

  /**
   * Provide a serialised version of the store, that can be transferred to the client
   */
  public serialise(): SerializedFilterStore | undefined {
    return this._filter;
  }

  /**
   * Rehydrate the current instance of the store with a serialised version
   */
  @action
  public hydrate(initialFilter: SerializedFilterStore): void {
    if (this.hydrated) {
      return;
    }
    this.hydrated   = true;
    this._filter    = initialFilter || getInitialFilter();
    this._newFilter = this._filter;
  }

  private runCheck(): void {
    const refreshTimestamp = getOutdatedTimeout();

    // if no value is set initialise it
    if (!refreshTimestamp) {
      setLastRefreshedTimestamp();
      return;
    }

    const lastTimeRefreshed = dayjs(parseInt(refreshTimestamp, 10));
    const now               = dayjs();

    const diffHours = Math.abs(lastTimeRefreshed.diff(now, 'hour'));
    if (diffHours > 10) {
      // after 10 hours reset filters and refresh
      this.reset();
      return;
    }

    const diffMinutes = Math.abs(lastTimeRefreshed.diff(now, 'minute'));
    if (diffMinutes > 30) {
      // after 30 minutes refresh with current filters
      void this.apply(true);
    }
  }

  /**
   * Periodically check if the current filters are outdated
   * If so show a prompt to ask if the user wants to refresh
   */
  private checkFilterOutdated(): void {
    if (IS_SERVER === true) {
      return;
    }
    window.addEventListener('focus', () => this.runCheck());

    this.interval = setInterval(() => this.runCheck(), TimeInMs.ONE_SECOND * 5);
  }

}

export let filterStore = new FilterStore();

// TODO: Refactor: Instead of reset stores on the server,
//  use Inversify and inject as transient on server and singleton on client
export function resetFilterStore(): void {
  filterStore = new FilterStore();
}

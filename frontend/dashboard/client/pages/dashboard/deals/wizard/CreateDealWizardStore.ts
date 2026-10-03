import {
  IApiDeal,
  IApiDealDate,
  IApiDealDescription,
  IApiDealDetails,
  IApiDealLocation,
  IApiDealValue,
  Timestamp,
}                              from '@my-old-startup/common/interfaces';
import {
  ApiDeal,
  ApiDealDate,
  ApiDealDescription,
  ApiDealDetails,
  ApiDealLocation,
  ApiDealValue,
  EMPTY_DEAL_ID,
}                              from '@my-old-startup/common/validation';
import { DashboardRoutes }     from '@my-old-startup/frontend-common/routes';
import { sanitize }            from 'class-sanitizer';
import { plainToClass }        from 'class-transformer';
import {
  validateSync,
  ValidationError,
}                              from 'class-validator';
import {
  action,
  computed,
  observable,
  toJS,
}                              from 'mobx';
import * as moment             from 'moment';
import { TimeInMs }            from '../../../../../../../common/datetime';
import {
  DealSpecialType,
  DealType,
}                              from '../../../../../../../common/enums';
import {
  getDateTomorrow,
  roundMinutes,
  todayOrAfter,
}                              from '../../../../common/utils/dateUtils';
import { dashboardDealFacade } from '../../../../facade/DashboardDealFacade';
import { routeService }        from '../../../../services/CdbRouteService';
import { DealService }         from '../../../../services/DealService';
import { companyStore }        from '../../../../stores/CompanyStore';
import { dealAccountStore }    from '../../../../stores/DealAccountStore';

class CreateDealWizardStore {
  @observable
  public deal: IApiDeal;

  @observable
  private _publishTimestamps: Timestamp[] = [moment().startOf('day').valueOf()];

  public reset(): void {
    void dealAccountStore.refresh();
    const company = companyStore.currentCompany;
    const now     = roundMinutes(
      moment().valueOf(),
      15) + TimeInMs.ONE_MINUTE * 15;

    const defaultValue: IApiDealValue             = {
            originalValue: 100,
            discountValue: 50,
          },
          defaultDetails: IApiDealDetails         = {
            tags:                [],
            minimumPersonCount:  1,
            reservationRequired: company !== undefined ? company.details.prefersReservations : false,
          },
          defaultDescription: IApiDealDescription = {
            title:       '',
            description: '',
          },
          defaultDate: IApiDealDate               = {
            validFrom: now,
            validTo:   now + TimeInMs.ONE_HOUR,
          };

    this.deal = Object.assign({},
                              new ApiDeal(
                                DealType.DISCOUNT,
                                '',
                                defaultValue,
                                defaultDetails,
                                defaultDate,
                                defaultDescription,
                              ),
    );
  }

  @computed
  public get publishTimestamps(): Timestamp[] {
    return this._publishTimestamps;
  }

  @computed
  public get canBePublished(): boolean {
    const instance = plainToClass(ApiDeal, this.deal);
    sanitize(instance);
    return instance.canBePublished;
  }

  /**
   * Sets the dealFormStore.deal to the current deal, and validFrom/validTo to the defaults for new deals
   * Also enables validation
   */
  @action
  public setTemplate(deal: IApiDeal): void {
    this.reset();
    // only copy data not the observable reference
    this.deal           = Object.assign(this.deal, toJS(deal));
    // do not reuse id of old deal
    this.deal.id        = EMPTY_DEAL_ID;
    // deal is not published yet
    this.deal.published = null;

    this.deal.date.validFrom = getDateTomorrow(this.deal.date.validFrom);
    this.deal.date.validTo   = getDateTomorrow(this.deal.date.validTo);

    this.setType(this.deal.type);
    if (this.deal.specialType !== undefined) {
      this.setSpecialType(this.deal.specialType);
    }

  }

  @action
  public setEditDeal(deal: IApiDeal): void {
    this.reset();
    // only copy data not the observable reference
    this.deal = Object.assign(this.deal, toJS(deal));
  }

  public setTimestamp(timestamp: Timestamp, addDate = 0): void {
    const deal = this.deal;

    const date  = new Date(timestamp);
    const year  = date.getFullYear();
    const month = date.getMonth();
    const day   = date.getDate();

    const validFrom = moment(deal.date.validFrom)
      .set(
        {
          year,
          month,
          'date': day,
        },
      ).valueOf();

    const validTo = moment(deal.date.validTo)
      .set(
        {
          year,
          month,
          'date': day + addDate,
        },
      ).valueOf();

    this.setDate(
      {
        validFrom,
        validTo,
      },
    );
  }

  @action
  public setPublishTimestamps(timestamps: Timestamp[]): void {
    // only take values from today or later
    this._publishTimestamps = todayOrAfter(timestamps);
  }

  @action
  public async createDeal(): Promise<void> {
    if (!companyStore.currentCompany) {
      throw new Error('No current company');
    }
    const newDeal = await dashboardDealFacade.create(this.deal, companyStore.currentCompany.id);

    if (!newDeal) {
      throw new Error('Could not create deal');
    }

    this.deal = newDeal;
  }

  public async updateDeal(): Promise<void> {
    if (!companyStore.currentCompany) {
      throw new Error('No current company');
    }

    const newDeal = await dashboardDealFacade.updateDeal(this.deal, companyStore.currentCompany.id);

    if (!newDeal) {
      throw new Error('Could not create deal');
    }

    this.deal = newDeal;

    routeService.routeTo(DashboardRoutes.Deals,
                         {
                           companyId: companyStore.currentCompany!.id,
                           newDealId: this.deal.id,
                         });

    this.reset();
  }

  public async publishDeal(): Promise<void> {
    const company           = companyStore.currentCompany!;
    const deal              = this.deal;
    const publishTimestamps = this.publishTimestamps;

    await DealService.bulkPublish(deal, company.id, publishTimestamps);

    routeService.routeTo(DashboardRoutes.Deals,
                         {
                           companyId: company.id,
                           newDealId: deal.id,
                         });

    this.reset();
  }

  @action
  public setType(type: DealType): void {
    this.deal.type = type;
    if (type === DealType.SPECIAL) {
      this.deal.value.discountValue = 0;
    }
  }

  @action
  public setSpecialType(specialType: DealSpecialType): void {
    this.deal.specialType = specialType;
  }

  @action
  public setDetails(details: Partial<IApiDealDetails>): void {
    this.deal.details = Object.assign(this.deal.details, details);
  }

  @action
  public setDate(date: Partial<IApiDealDate>): void {
    this.deal.date = Object.assign(this.deal.date, date);
  }

  @action
  public setIsStatic(flag: boolean): void {
    this.deal.isStatic = flag;
    if (flag === false) {
      this.deal.staticDays = undefined;
    }
  }

  @action
  public setSkipHolidays(flag: boolean): void {
    this.deal.skipHolidays = flag;
    if (flag === false) {
      this.deal.skipHolidays = undefined;
    }
  }

  @action
  public setLocation(location: Partial<IApiDealLocation>): void {
    this.deal.location = Object.assign({}, this.deal.location, location);
  }

  @action
  public setValue(value: Partial<IApiDealValue>): void {
    this.deal.value = Object.assign(this.deal.value, value);
  }

  @action
  public setDescription(description: Partial<IApiDealDescription>): void {
    this.deal.description = Object.assign(this.deal.description, description);
  }

  @action
  public setImage(image: string): void {
    this.deal.image = image;
  }

  public validateDeal(): ValidationError[] {
    const instance = plainToClass(ApiDeal, this.deal);
    sanitize(instance);
    return validateSync(instance);
  }

  public validateDescription(): ValidationError[] {
    const instance = plainToClass(ApiDealDescription, this.deal.description);
    sanitize(instance);
    return validateSync(instance);
  }

  public validateImage(): ValidationError[] {
    if (this.deal.image !== '') {
      return [];
    }

    return [{
      property:    'image',
      constraints: {
        isDefined: ' Image is required',
      },
      children:    [],
    }];
  }

  public validateValue(): ValidationError[] {
    const instance = plainToClass(ApiDealValue, this.deal.value);
    sanitize(instance);
    return validateSync(instance);
  }

  public validateLocation(): ValidationError[] {
    const instance = plainToClass(ApiDealLocation, this.deal.location);
    sanitize(instance);
    return validateSync(instance);
  }

  public validateDate(): ValidationError[] {
    const instance = plainToClass(ApiDealDate, this.deal.date);
    sanitize(instance);
    return validateSync(instance);
  }

  public validateDetails(): ValidationError[] {
    const instance = plainToClass(ApiDealDetails, this.deal.details);
    sanitize(instance);
    return validateSync(instance);
  }

}

export let createDealWizardStore = new CreateDealWizardStore();

import {
  IApiCompany,
  IApiCompanyOptionalInfo,
  IApiUserContact,
}                       from '@my-old-startup/common/interfaces';
import {
  ApiCompany,
  ApiCompanyContact,
  ApiCompanyCorona,
  ApiCompanyDetails,
  ApiCompanyDishes,
  ApiUserContact,
} from '@my-old-startup/common/validation';
import { sanitize }     from 'class-sanitizer';
import { plainToClass } from 'class-transformer';
import {
  validateSync,
  ValidationError,
}                       from 'class-validator';
import {
  action,
  computed,
  observable,
}                       from 'mobx';

class CompanyStore {

  @observable
  private _isDirtyKeys: Array<string> = [];

  @observable
  public isValidationEnabled = false;

  @observable
  private _company: IApiCompany | undefined;

  @observable
  private _companyUserContact: IApiUserContact | undefined;

  @computed
  public get companyUserContact(): IApiUserContact | undefined {
    return this._companyUserContact;
  }

  public set companyUserContact(contact: IApiUserContact | undefined) {
    this._companyUserContact = contact;
  }

  /**
   * TODO: Refactor is dirty
   */
  public checkDirty(keys: string[]): boolean {
    return keys.some(x => this._isDirtyKeys.some(y => x === y));
  }

  public checkDirtyString(key: string): boolean {
    return this._isDirtyKeys.some(y => y.toLocaleLowerCase().includes(key.toLocaleLowerCase()));
  }

  @computed
  public get isDirty(): boolean {
    return this._isDirtyKeys.length !== 0;
  }

  @action
  public addDirty(flag: string) {
    this._isDirtyKeys.push(flag);
  }

  @action
  public clearDirty() {
    this._isDirtyKeys = [];
  }

  @computed
  public get currentCompany(): IApiCompany | undefined {
    return this._company;
  }

  public set currentCompany(company: IApiCompany | undefined) {
    this._company = company;
  }

  @computed
  public get validationError(): ValidationError[] {
    if (!this.isValidationEnabled) {
      return [];
    }

    const classInstance = plainToClass(ApiCompany, this.currentCompany);
    sanitize(classInstance);
    return validateSync(classInstance);
  }

  @computed
  public get detailsValidationError(): ValidationError[] {
    if (!this.isValidationEnabled) {
      return [];
    }

    const classInstance = plainToClass(ApiCompanyDetails, this.currentCompany ? this.currentCompany.details : {});
    sanitize(classInstance);
    return validateSync(classInstance);
  }

  @computed
  public get dishesValidationError(): ValidationError[] {
    if (!this.isValidationEnabled) {
      return [];
    }

    const classInstance = plainToClass(ApiCompanyDishes, this.currentCompany);
    sanitize(classInstance);
    return validateSync(classInstance);
  }

  @computed
  public get contactValidationError(): ValidationError[] {
    if (!this.isValidationEnabled) {
      return [];
    }

    const classInstance = plainToClass(ApiCompanyContact, this.currentCompany ? this.currentCompany.contact : {});
    sanitize(classInstance);
    return validateSync(classInstance);
  }

  @computed
  public get companyUserContactValidationError(): ValidationError[] {
    if (!this.isValidationEnabled) {
      return [];
    }

    const classInstance = plainToClass(ApiUserContact, this._companyUserContact);
    sanitize(classInstance);
    return validateSync(classInstance);
  }

  @computed
  public get companyCoronaValidationError(): ValidationError[] {
    if (!this.isValidationEnabled) {
      return [];
    }

    const classInstance = plainToClass(ApiCompanyCorona, this.currentCompany ? this.currentCompany.corona : {});
    sanitize(classInstance);
    return validateSync(classInstance);
  }

  @computed
  public get currentCompanyOptionalInfo(): IApiCompanyOptionalInfo | undefined {
    const company = this.currentCompany;

    if (company === undefined) {
      return undefined;
    }

    return {
      telephone: company.contact.telephone,
      email:     company.contact.email,
      website:   company.contact.website,
    };
  }

  public getErrorMessageForProperty(propertyName: string): string | undefined {

    let error: ValidationError | undefined;

    this.validationError.forEach(e => e.children.forEach(x => {
      if (x.property === propertyName) {
        error = x;
      }
    }));

    let errorMessage: string | undefined;

    if (error !== undefined) {
      errorMessage = Object.values<string>(error.constraints)[0];
    }

    return errorMessage;
  }
}

export const companyStore = new CompanyStore();

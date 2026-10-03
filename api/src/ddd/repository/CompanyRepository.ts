import { Container, inject, injectable } from 'inversify';
import { ErrorCode }                     from '../../../../common/error/ErrorCode';
import { ApiError }                      from '../../common/ApiError';
import { keys }                          from '../../container/inversify.keys';
import { ICompanyFacade }                from '../../datastore/ICompanyFacade';
import { Company }                       from '../entities/Company';
import { IRepository }                   from './IRepository';

@injectable()
export class CompanyRepository implements IRepository<Company> {
  @inject(keys.Container)
  private container: Container;

  @inject(keys.ICompanyFacade)
  private companyFacade: ICompanyFacade;

  public async findById(id: string): Promise<Company> {
    const company = await this.companyFacade.get(id);

    if (company === undefined) {
      throw new ApiError(`Company ${id} not found`, ErrorCode.WEB_SERVER_NO_DATA_FOUND);
    }

    return this.container.get<Company>(Company).setData(company);
  }

  public async findByOwner(ownerAuthId: string): Promise<Company[]> {
    const companies = await this.companyFacade.getAllForUser(ownerAuthId);

    return companies.map((c) => this.container.get<Company>(Company).setData(c));
  }

  public async getAll(): Promise<Company[]> {
    const companies = await this.companyFacade.getAll();

    return companies.map((c) => this.container.get<Company>(Company).setData(c));
  }
}

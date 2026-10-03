import { Container, inject, injectable } from 'inversify';
import { keys }                          from '../../container/inversify.keys';
import { Company }                       from '../entities/Company';
import { ICompany }                      from '../interfaces';
import { IFactory }                      from './IFactory';

@injectable()
export class CompanyFactory implements IFactory<ICompany, Company> {
  @inject(keys.Container)
  private container: Container;

  public async create(): Promise<Company> {
    return this.container.get<Company>(Company);
  }
}

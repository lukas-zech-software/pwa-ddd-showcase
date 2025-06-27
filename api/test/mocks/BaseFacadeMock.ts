/* eslint-disable @typescript-eslint/no-unused-vars */
import { injectable }      from 'inversify';
import { IBaseFacade }     from '../../src/datastore/IBaseFacade';
import { IBaseDataObject } from '../../src/ddd/interfaces';
import { AutoSpy }         from '../utils/autoSpy';

@AutoSpy()
@injectable()
export abstract class BaseFacadeMock<T extends IBaseDataObject> implements IBaseFacade<T> {

  public async create(entity: T): Promise<T> {
    return this.mockData[0];
  }

  public getId(): string {
    return 'newId';
  }

  public async get(id: string): Promise<T> {
    return this.mockData[0];
  }

  public async getAll(): Promise<T[]> {
    return this.mockData;
  }

  public async remove(id: string): Promise<void> {
    return undefined;
  }

  /**
   * Just pass the given value back as if it were updated successfully
   * @param entity
   */
  public async update(entity: T): Promise<T> {
    return entity;
  }

  public abstract mockData: T[];

  public getCachePrefix(): string {
    throw new Error('Method not implemented.');
  }

}

import { Container, inject, injectable } from 'inversify';
import { keys }                          from '../../container/inversify.keys';
import { IMail, Mail }                   from '../entities/Mail';
import { IFactory }                      from './IFactory';

@injectable()
export class MailFactory implements IFactory<IMail, Mail> {
  @inject(keys.Container)
  private container: Container;

  public async create(mail: IMail): Promise<Mail> {
    const newMail = this.container.get<Mail>(keys.IMail).setData(mail);

    return newMail.setData(mail);
  }
}

import { EmailResult, IMail, Mail } from '../../src/ddd/entities/Mail';
import { AutoSpy }                  from '../utils/autoSpy';
import { IMailEntity }              from './types';

@AutoSpy()
export class MailMock implements IMailEntity {
  public data: object;
  public from: string;
  public template: string;
  public to: string;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public addAttachment(attachment: any): void {
  }

  public async send(): Promise<EmailResult> {
    return { status: 'ok' };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public setData(mail: IMail): Mail {
    throw new Error('MailMock.setData');
  }
}

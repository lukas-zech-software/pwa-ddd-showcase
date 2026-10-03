import { injectable } from 'inversify';

@injectable()
export class MailChimpFacadeMock {
  public async register(): Promise<void> {
  }
}

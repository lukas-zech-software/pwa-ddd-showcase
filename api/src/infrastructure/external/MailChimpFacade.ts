import { injectable }        from 'inversify';
import fetch                 from 'node-fetch';
import { HttpRequestMethod } from '../../../../common/http/HttpRequestMethod';
import { IUserContact }      from '../../ddd/interfaces';

type MailChimpContact = {
  email_address: string;
  status: 'subscribed' | 'unsubscribed';
  merge_fields: {
    FNAME: string;
    LNAME: string;
    PHONE: string;
  };
};

export type IMailChimpFacade = {
  register(user: IUserContact): Promise<void>;
};

@injectable()
export class MailChimpFacade implements IMailChimpFacade {
  private static toMailChimpUser(user: IUserContact): MailChimpContact {
    return {
      // eslint-disable-next-line @typescript-eslint/camelcase
      email_address: user.contactEmail,
      status:        'subscribed',
      // eslint-disable-next-line @typescript-eslint/camelcase
      merge_fields:  {
        FNAME: user.contactFirstName,
        LNAME: user.contactName,
        PHONE: user.contactPhone,
      },
    };
  }

  public async register(user: IUserContact): Promise<void> {
    const route = 'https://us20.api.mailchimp.com//3.0/lists/39d5480ea4/members/';
    const data  = MailChimpFacade.toMailChimpUser(user);
    await fetch(route, {
      method:  HttpRequestMethod.POST.toString(),
      headers: {
        'Content-Type':  'application/json',
        // TODO: Get from secret env
        'Authorization': `Basic some-secret`,
      },
      body: JSON.stringify(data),
    },
    );
  }
}

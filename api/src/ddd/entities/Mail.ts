import * as ejs                  from 'ejs';
import * as fs                   from 'fs';
import { Container, injectable } from 'inversify';
import * as juice                from 'juice';
import { Attachment,IAttachmentOptions }            from 'mailgun-js';
import { join }                  from 'path';
import { keys }                  from '../../container/inversify.keys';
import { injectNotEnumerable }   from '../utils/objectUtils';

const mailgun = require('mailgun-js');

const MAILGUN_CONFIG = {
  // FIXME: Regenerate and load from secret and inject
  apiKey: 'some-api-key',
  domain: 'mailgun.my-old-startups-domain.de',
  host:   'api.eu.mailgun.net',
};

type IRenderedMail = {
  subject: string;
  body: string;
};

export type EmailResult = {
  status: 'ok' | 'failed';
};

export type IMail = {
  template: string;
  from: string;
  to: string;
  data: object;
};

@injectable()
export class Mail implements IMail {
  public from: string;
  public to: string;
  public data: object;
  @injectNotEnumerable(keys.Container) private container: Container;
  @injectNotEnumerable(keys.IsProduction) private isProduction: boolean;
  @injectNotEnumerable(keys.ApplicationRoot) private applicationRoot: string;
  // TODO: Module singleton?
  private readonly mailgun: any;
  private attachments: Attachment[] = [];

  public constructor() {
    this.mailgun = mailgun(MAILGUN_CONFIG); // inject?
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  private _template: string;

  public get template(): string {
    return this._template;
  }

  public set template(template: string) {
    this._template = join(this.templateRoot, template);
  }

  private get templateRoot(): string {
    return join(this.applicationRoot, '../resources/templates');
  }

  public setData(mail: IMail): Mail {
    Object.assign(this, mail);
    return this;
  }

  public async send(): Promise<EmailResult> {
    try {
      if (this.isProduction) {
        await this.sendMail();
      } else {
        await this.debugMail();
      }

      return {
        status: 'ok',
      };
    } catch (error) {
      return {
        status: 'failed',
      };
    }
  }

  public addAttachment(attachment: IAttachmentOptions): void {
    this.attachments.push(new this.mailgun.Attachment(attachment));
  }

  private async render(): Promise<IRenderedMail> {
    const renderedMail    = await this.renderFile('html.ejs', this.data);
    const renderedSubject = await this.renderFile('subject.ejs', this.data);

    const inlinedBody = await new Promise<string>((resolve, reject) => {
      juice.juiceResources(
        renderedMail,
        {
          preserveImportant: true,
          webResources:      {
            relativeTo: this.templateRoot,
            images:     false,
          },
        },
        (error: any, html: string) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(html);
        },
      );
    });

    return {
      body:    inlinedBody,
      subject: renderedSubject,
    };
  }

  private async renderFile(file: string, data: object): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      ejs.renderFile(
        join(this.template, file),
        data,
        {
          cache: true,
          root:  this.templateRoot,
        },
        (error, str) => {
          if (error) {
            reject(error);
            return;
          }
          resolve(str);
        },
      );
    });
  }

  private async sendMail(): Promise<void> {
    const renderedMail = await this.render();

    const mail = {
      from:       `my-old-startups-domain <${this.from}>`,
      to:         this.to,
      subject:    renderedMail.subject,
      html:       renderedMail.body,
      attachment: this.attachments,
    };

    return new Promise<void>((resolve, reject) => {
      this.mailgun.messages().send(mail, (err: any) => {
        if (err) {
          // eslint-disable-next-line no-console
          console.error('Error while sending mail: ', err);
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  private async debugMail(): Promise<void> {
    const renderedMail = await this.render();

    const tmpPath  = `/tmp/my-old-startup`,
          subject  = renderedMail.subject.replace(/\W+/g, '_'),
          filename = `${tmpPath}/${this.from}_${
            this.to
          }_${subject}_${Date.now()}.html`;

    if (fs.existsSync(tmpPath) === false) {
      fs.mkdirSync(tmpPath);
    }

    fs.writeFileSync(filename, renderedMail.body);
    console.debug('email written to', filename);
  }
}

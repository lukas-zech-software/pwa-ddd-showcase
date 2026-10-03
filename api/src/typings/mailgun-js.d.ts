/* eslint-disable */
declare namespace mailgun {
  export interface IAttachmentOptions {
    filename: string;
    contentType: string;
    data: string | Buffer;
  }

  class Attachment {
    constructor(attachment: IAttachmentOptions);
  }

  function mailgun(config: any): any;
}

declare module 'mailgun-js' {
  export = mailgun;
}

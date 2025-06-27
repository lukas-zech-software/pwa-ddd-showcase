/* eslint-disable */
declare namespace juice {
  /**
   * Send the Email
   */
  function juiceResources(html: string, options: any, cb: Function): any;
}

declare module 'juice' {
  export = juice;
}

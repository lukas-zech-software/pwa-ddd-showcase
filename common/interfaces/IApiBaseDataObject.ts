export type IApiBaseDataObject = {
  /**
   * Database id of the object
   */
  id: string;

  /**
   * JS timestamp when this was created
   */
  created: number;

  /**
   * JS timestamp when this was last updated
   */
  updated: number;
};

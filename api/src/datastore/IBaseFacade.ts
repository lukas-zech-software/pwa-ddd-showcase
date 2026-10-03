/**
 * Facade to access entity data via API
 */
export type IBaseFacade<T> = {
  /**
   * Get a unique id for this entity
   */
  getId(baseDocumentId?: string): string;

  /**
   * Get the entity data for the entity database id
   *
   * @param {number} id The entity's database id to get the entity data for
   * @param baseDocumentId
   * @returns {Promise<T>} Resolves with entity data
   */
  get(id: string, baseDocumentId?: string): Promise<T>;

  /**
   * Get all entities of one type
   *
   * @returns {Promise<Array<IEntity>>} Resolves with entity data
   */
  getAll(baseDocumentId?: string): Promise<T[]>;

  /**
   * Create the provided entity data in DB and return the new entity
   *
   * @param {IEntity} entity Entity to write in DB
   * @param baseDocumentId
   * @returns {Promise<IEntity>} Resolves with the newly created entity
   */
  create(entity: T, baseDocumentId?: string): Promise<T>;

  /**
   * Update the provided entity data in DB
   *
   * @param {T} entity Partial entity containing the values to update
   * @param baseDocumentId
   * @returns {Promise<IEntity>} Resolves with the updated entity
   */
  update(entity: T, baseDocumentId?: string): Promise<T>;

  /**
   * Delete the entity with the provided id from DB
   *
   * @param {number} id Id to delete
   * @param baseDocumentId
   */
  remove(id: string, baseDocumentId?: string): Promise<void>;

  getCachePrefix(baseDocumentId?: string): string;
};

/**
 * Function to validate the entity to update.
 * Throws if validation fails
 */
type IEntityValidationFn<T> = (entityToUpdate: T) => void;

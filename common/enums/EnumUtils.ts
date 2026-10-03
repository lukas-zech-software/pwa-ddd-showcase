/**
 * Utils to work with Enums
 */
export class EnumUtils {

  /**
   * Return all Values and Keys for the provided Enum
   * @param {any} enumType
   * @returns {{key: string, value: number}[]}
   */
  public static getKeysAndValues(enumType: any): any[] {
    return this.getKeys(enumType).map((enumKey: any) => ({ key: enumKey, value: enumType[enumKey] as number }));
  }

  /**
   * Return all Keys for the provided Enum
   * @param {any} enumType
   * @returns {Array<string>}
   */
  public static getKeys(enumType: any): string[] {
    return Object.values(enumType).filter((enumValue) => typeof enumValue === 'string') as string[];
  }

  /**
   * Return all Values for the provided Enum
   * @param {any} enumType
   * @returns {Array<number>}
   */
  public static getValues(enumType: any): number[] {
    return Object.values<number>(enumType).filter((enumValue) => typeof enumValue === 'number');
  }

  /**
   * Get enum value for provided key
   * @param {any} enumType
   * @param {string} key
   * @returns {number}
   */
  public static getValue(enumType: any, key: string): number {
    return enumType[key];
  }
}

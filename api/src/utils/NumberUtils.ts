/**
 * Utils to work with numbers
 */
export class NumberUtils {

  /**
   * Rounds the given value with the specified precision.
   * @param {number} value The value to round
   * @param {number} decimalPlaces The maximum number of decimal places allowed for the resulting value
   * @returns {number} The rounded value
   */
  public static round(value: number, decimalPlaces: number): number {
    const factor = Math.pow(10, decimalPlaces);

    return Math.round(value * factor) / factor;
  }

  public static getRandomNumber(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}

/**
 * Makes marked property non enumerable
 * @constructor
 */
import { inject }     from 'inversify';
import { interfaces } from 'inversify/dts/interfaces/interfaces';

export function NotEnumerable(): PropertyDecorator {
  return (target: any, key: string | symbol) => {
    let actualValue: any = target[key];

    // Create new property with getter and setter
    Object.defineProperty(target, key, {
      get:          () => actualValue,
      set:          (newVal) => actualValue = newVal,
      enumerable:   false,
      configurable: false,
    });
  };
}

/**
 * Inject inversify dependency and mark property as not enumerable
 * @param injectKey
 * @constructor
 */
export function injectNotEnumerable(injectKey: interfaces.ServiceIdentifier<any>): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    inject(injectKey)(target, propertyKey.toString());
    NotEnumerable()(target, propertyKey);
  };
}

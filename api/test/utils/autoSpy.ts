import 'jest';
import { Omit } from '../../../common/typescript';

export function AutoSpy(): ClassDecorator {
  return (target: any): any => {
    Object.getOwnPropertyNames(target.prototype).forEach((methodName) => {
      if (
        typeof target.prototype[methodName] === 'function' &&
        methodName !== 'constructor'
      ) {
        jest.spyOn(target.prototype, methodName);
      }
    });

    return target;
  };
}

type MockAllExceptData<T> = {
  [key in keyof Omit<T, 'mockData'>]: jest.Mock;
};

type WithMockData<T> = {
  mockData: T[];
};

export type IAutoMock<T> = T extends WithMockData<infer U>
  ? WithMockData<U> & MockAllExceptData<T>
  : MockAllExceptData<T>;

export function getAsMock<T>(mock: T): IAutoMock<T> {
  return mock as any;
}

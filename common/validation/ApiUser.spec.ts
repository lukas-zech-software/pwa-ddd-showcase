import { sanitize }                      from 'class-sanitizer';
import { plainToClass }                  from 'class-transformer';
import { validateSync, ValidationError } from 'class-validator';
import { IApiUserContact }               from '../interfaces';
import { ApiUserContact }                from './ApiUserContact';

const errors = (cls: any, data: any): ValidationError[] => {
  const instance = plainToClass(cls, data);
  sanitize(instance);
  return validateSync(instance);
};

const violatesConstraint = (errors: ValidationError[] | undefined, constraintName: string): boolean => {
  if (errors === undefined) {
    return false;
  }

  // eslint-disable-next-line no-prototype-builtins
  return errors.some((err) => err.constraints.hasOwnProperty(constraintName));
};

describe('ApiUserContact', () => {
  let contact: IApiUserContact;

  beforeEach(() => {
    contact = {
      firstName: 'John',
      lastName:  'Doe',
      telephone: '123456789',
      email:     'test@example.com',
    };
  });

  describe('firstName', () => {
    it('must be at least 2 characters', () => {
      const short     = Object.assign({}, contact);
      short.firstName = 'a';

      const shortErrors = errors(ApiUserContact, short);

      expect(violatesConstraint(shortErrors, 'minLength')).toBe(true);
    });

    it('must be no more than 50 characters', () => {
      const long     = Object.assign({}, contact);
      long.firstName = 'a'.repeat(51);

      const longErrors = errors(ApiUserContact, long);

      expect(violatesConstraint(longErrors, 'maxLength')).toBe(true);
    });
  });

  describe('lastName', () => {
    it('must be at least 2 characters', () => {
      const short    = Object.assign({}, contact);
      short.lastName = 'a';

      const shortErrors = errors(ApiUserContact, short);

      expect(violatesConstraint(shortErrors, 'minLength')).toBe(true);
    });

    it('must be no more than 50 characters', () => {
      const long    = Object.assign({}, contact);
      long.lastName = 'a'.repeat(51);

      const longErrors = errors(ApiUserContact, long);

      expect(violatesConstraint(longErrors, 'maxLength')).toBe(true);
    });
  });

  describe('telephone', () => {
    it('must be at least 3 characters', () => {
      const short     = Object.assign({}, contact);
      short.telephone = 'aa';

      const shortErrors = errors(ApiUserContact, short);

      expect(violatesConstraint(shortErrors, 'minLength')).toBe(true);
    });
  });

  describe('email', () => {
    it('must be an email address', () => {
      const missingAt        = Object.assign({}, contact);
      missingAt.email        = 'testexample.com';
      const missingDomain    = Object.assign({}, contact);
      missingDomain.email    = 'test@';
      const missingRecipient = Object.assign({}, contact);
      missingRecipient.email = '@example.com';

      const missingAtErrors        = errors(ApiUserContact, missingAt);
      const missingDomainErrors    = errors(ApiUserContact, missingDomain);
      const missingRecipientErrors = errors(ApiUserContact, missingRecipient);

      expect(violatesConstraint(missingAtErrors, 'isEmail')).toBe(true);
      expect(violatesConstraint(missingDomainErrors, 'isEmail')).toBe(true);
      expect(violatesConstraint(missingRecipientErrors, 'isEmail')).toBe(true);
    });

    it('must be no more than 120 characters', () => {
      const long = Object.assign({}, contact);
      long.email = 'a'.repeat(115) + '@a.com';

      const longErrors = errors(ApiUserContact, long);

      expect(violatesConstraint(longErrors, 'maxLength')).toBe(true);
    });
  });
});

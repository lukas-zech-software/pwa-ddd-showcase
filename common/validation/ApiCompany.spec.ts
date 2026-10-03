import { sanitize }                             from 'class-sanitizer';
import { plainToClass }                         from 'class-transformer';
import { validateSync, ValidationError }        from 'class-validator';
import { CompanyType }                          from '../enums';
import { IApiCompanyContactWithCity }           from '../interfaces';
import { ApiCompanyContact, ApiCompanyDetails } from './ApiCompany';

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

describe('validation', () => {
  describe('ApiCompanyContact', () => {
    let contact: IApiCompanyContactWithCity;

    beforeEach(() => {
      contact = {
        title:                     'title',
        address:                   'teststraße 1',
        zipCode:                   '12345',
        city:                      'test city',
        telephone:                 '123',
        secondaryTelephone:        '456',
        secondaryTelephoneReason:  'xxx',
        email:                     'test@example.com',
        hasAcceptedTerms:          true,
        hasSubscribedToNewsletter: true,
        type:                      CompanyType.RESTAURANT,
        website:                   'example.com',
      };
    });

    test('the test case default is valid', () => {
      expect(errors(ApiCompanyContact, contact)).toHaveLength(0);
    });

    describe('title', () => {
      it('must be at least 2 characters long', () => {
        const short = Object.assign({}, contact);
        short.title = 'a';

        const shortErrors = errors(ApiCompanyContact, short);

        expect(violatesConstraint(shortErrors, 'minLength')).toBe(true);
      });

      it('must be at most 100 characters long', () => {
        const long = Object.assign({}, contact);
        long.title = 'a'.repeat(101);

        const longErrors = errors(ApiCompanyContact, long);

        expect(violatesConstraint(longErrors, 'maxLength')).toBe(true);
      });
    });

    describe('address', () => {
      it('must be at least 3 characters long', () => {
        const short   = Object.assign({}, contact);
        short.address = 'aa';

        const shortErrors = errors(ApiCompanyContact, short);

        expect(violatesConstraint(shortErrors, 'minLength')).toBe(true);
      });

      it('must be a street then an address', () => {
        const noSpace        = Object.assign({}, contact);
        noSpace.address      = 'a1';
        const noStreetName   = Object.assign({}, contact);
        noStreetName.address = ' 1';
        const noNumber       = Object.assign({}, contact);
        noNumber.address     = 'a ';

        const noSpaceErrors      = errors(ApiCompanyContact, noSpace);
        const noStreetNameErrors = errors(ApiCompanyContact, noStreetName);
        const noNumberErrors     = errors(ApiCompanyContact, noNumber);

        expect(violatesConstraint(noSpaceErrors, 'matches')).toBe(true);
        expect(violatesConstraint(noStreetNameErrors, 'matches')).toBe(true);
        expect(violatesConstraint(noNumberErrors, 'matches')).toBe(true);
      });
    });

    describe('zipCode', () => {
      it('must be at least 5 characters', () => {
        const short   = Object.assign({}, contact);
        short.zipCode = '0'.repeat(4);

        const shortErrors = errors(ApiCompanyContact, short);

        expect(violatesConstraint(shortErrors, 'minLength')).toBe(true);
      });

      it('must be only numbers', () => {
        const withLetter   = Object.assign({}, contact);
        withLetter.zipCode = 'a0000';

        const withLetterErrors = errors(ApiCompanyContact, withLetter);

        expect(violatesConstraint(withLetterErrors, 'matches')).toBe(true);
      });
    });

    describe('telephone', () => {
      it('must be at least 3 characters', () => {
        const short     = Object.assign({}, contact);
        short.telephone = 'aa';

        const shortErrors = errors(ApiCompanyContact, short);

        expect(violatesConstraint(shortErrors, 'minLength')).toBe(true);
      });

      it('is optional', () => {
        const unset     = Object.assign({}, contact);
        unset.telephone = undefined;

        const unsetErrors = errors(ApiCompanyContact, unset);

        expect(unsetErrors).toHaveLength(0);
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

        const missingAtErrors        = errors(ApiCompanyContact, missingAt);
        const missingDomainErrors    = errors(ApiCompanyContact, missingDomain);
        const missingRecipientErrors = errors(ApiCompanyContact, missingRecipient);

        expect(violatesConstraint(missingAtErrors, 'isEmail')).toBe(true);
        expect(violatesConstraint(missingDomainErrors, 'isEmail')).toBe(true);
        expect(violatesConstraint(missingRecipientErrors, 'isEmail')).toBe(true);
      });

      it('must be no more than 120 characters', () => {
        const long = Object.assign({}, contact);
        long.email = 'a'.repeat(115) + '@a.com';

        const longErrors = errors(ApiCompanyContact, long);

        expect(violatesConstraint(longErrors, 'maxLength')).toBe(true);
      });

      it('is optional', () => {
        const unset = Object.assign({}, contact);
        unset.email = undefined;

        const unsetErrors = errors(ApiCompanyContact, unset);

        expect(unsetErrors).toHaveLength(0);
      });
    });

    describe('hasAcceptedTerms', () => {
      it('must be true', () => {
        const isFalse            = Object.assign({}, contact);
        isFalse.hasAcceptedTerms = false;

        const isFalseErrors = errors(ApiCompanyContact, isFalse);

        expect(violatesConstraint(isFalseErrors, 'equals')).toBe(true);
      });
    });

    describe('website', () => {
      it('must be a url', () => {
        const notAUrl   = Object.assign({}, contact);
        notAUrl.website = 'not a website!';

        const notAUrlErrors = errors(ApiCompanyContact, notAUrl);

        expect(violatesConstraint(notAUrlErrors, 'isUrl')).toBe(true);
      });

      it('must be no more than 120 characters', () => {
        const long   = Object.assign({}, contact);
        long.website = 'a'.repeat(117) + '.com';

        const longErrors = errors(ApiCompanyContact, long);

        expect(violatesConstraint(longErrors, 'maxLength')).toBe(true);
      });

      it('is optional', () => {
        const unset   = Object.assign({}, contact);
        unset.website = undefined;

        const unsetErrors = errors(ApiCompanyContact, unset);

        expect(unsetErrors).toHaveLength(0);
      });
    });
  });

  describe('ApiCompanyDetails', () => {
    describe('description', () => {
      it('must be at least 70 characters', () => {
        const short = { description: 'a'.repeat(69), openingHours: undefined };

        const shortErrors = errors(ApiCompanyDetails, short);

        expect(violatesConstraint(shortErrors, 'minLength')).toBe(true);
      });

      it('must be no more than 5000 characters', () => {
        const long = { description: 'a'.repeat(5001), openingHours: undefined };

        const longErrors = errors(ApiCompanyDetails, long);

        expect(violatesConstraint(longErrors, 'maxLength')).toBe(true);
      });
    });
  });
});

import { NamespaceUtils } from './NamespaceUtils';
import { NumberUtils }    from './NumberUtils';

describe(NamespaceUtils.resolve(__filename), () => {
  describe('#round', () => {
    describe('floating point number', () => {
      const value = 123.456789;

      it('should round using the given precision (PRECISION = 2)', () => {
        const result = NumberUtils.round(value, 2);

        expect(result).toBe(123.46);
      });

      it('should round using the given precision (PRECISION = 0)', () => {
        const result = NumberUtils.round(value, 0);

        expect(result).toBe(123);
      });
    });

    describe('integer number', () => {
      const value = 1337;
      it('should round using the given precision (PRECISION = 2)', () => {
        const result = NumberUtils.round(value, 2);

        expect(result).toBe(1337);
      });

      it('should round using the given precision (PRECISION = 0)', () => {
        const result = NumberUtils.round(value, 0);

        expect(result).toBe(1337);
      });
    });
  });
});

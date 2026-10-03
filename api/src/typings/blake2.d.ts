declare module 'blake2' {
  export type Blake2Variant = 'blake2b' | 'blake2bp' | 'blake2s' | 'blake2sp';

  export type Blake2Options = {
    digestLength?: number;
  };

  declare function createHash(variant: Blake2Variant, options?: Blake2Options): Hash;

  export type Hash = {
    update(buf: Buffer): void;
    digest(outputEncoding: 'hex'): string;
  };
}

export type Omit<T, K extends keyof any> = T extends any ? Pick<T, Exclude<keyof T, K>> : never;

export type Public<T> = { [K in keyof T]: T[K] };

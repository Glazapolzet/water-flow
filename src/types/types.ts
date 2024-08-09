export type UnpackedArray<T> = T extends Array<infer U> ? U : T extends ReadonlyArray<infer U> ? U : T;

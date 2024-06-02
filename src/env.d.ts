/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Nullable<T> = { [K in keyof T]: T[K] | null };

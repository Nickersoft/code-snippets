import type { StrictExtract } from "@/snippets/helpers/types";

/**
 * `Array.isArray` but with better type inference.
 *
 * @example
 * isArray([]) // => true
 * isArray('hello') // => false
 */
export const isArray = (() => Array.isArray)() as <Input>(
  value: Input,
) => value is ExtractArray<Input>;

/**
 * An absurdly complicated but accurate type for extracting Array types.
 *
 * It's like `Extract<T, any[]>` but better with edge cases.
 */
export type ExtractArray<T> = T extends any
  ? [StrictExtract<T, readonly any[]>] extends [readonly any[]]
    ? Extract<T, readonly any[]>
    : [StrictExtract<T, any[]>] extends [any[]]
      ? Extract<T, any[]>
      : unknown[] extends T
        ? unknown[]
        : never
  : never;

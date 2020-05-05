import * as changeCaseLib from "change-case";
import { titleCase } from "title-case";

const caseMethods: Record<CaseMethodName, any> = { ...changeCaseLib, titleCase };

type shortCaseMethodName =
  | "camel"
  | "capital"
  | "constant"
  | "dot"
  | "header"
  | "no"
  | "param"
  | "pascal"
  | "path"
  | "sentence"
  | "snake"
  | "title";

type CaseMethodName =
  | "camelCase"
  | "capitalCase"
  | "constantCase"
  | "dotCase"
  | "headerCase"
  | "noCase"
  | "paramCase"
  | "pascalCase"
  | "pathCase"
  | "sentenceCase"
  | "snakeCase"
  | "titleCase";

/**
 * Implements the library [change-case](https://github.com/blakeembrey/change-case).
 *
 * @param to is shorthand or full name for the change-case function.
 * @param string is the string to modify.
 * @returns string with case changed.
 * @example
 * changeCase("camelCase", "test string"); // testString
 */
export function changeCase(string: string, to: shortCaseMethodName | CaseMethodName): string {
  const method = (to.endsWith("Case") ? to : `${to}Case`) as CaseMethodName;
  return caseMethods[method](string) as string;
}

/**
 * Prefixes a string to the beginning of each line in the first string
 *
 * @param string is the string to modify.
 * @param replacer is the string to prefix to each line.
 * @returns prefixed lines.
 * @example
 * prefixLines("abc\nabc", "--");
 * // --abc
 * // --abc
 */
export function prefixLines(string: string, replacer = ""): string {
  return string ? replacer + string.replace(/[\r\n]/g, `$&${replacer}`) : "";
}

/**
 * Returns first defined or non-empty input. This may be useful for `handlebars`, because it does not provide
 * short circuit operator like `nunjucks`
 *
 * @param input is list of inputs to check.
 * @example
 * // Handlebars:
 * {{ firstAvaialbale package.label package.name }}
 *
 * // Equals this in nunjucks
 * {{ package.label or package.name }}
 */
export function firstAvailable(...input: any[]): any {
  return input.find((candidate) => candidate !== undefined && candidate !== "");
}

#!/usr/bin/env node
/* eslint-disable no-console */
import meow, { Options as meowOptions } from "meow";
import { resolve } from "path";
import createReadMe from "../index";

/** @ignore */
interface Result extends meow.Result<any> {
  flags: {
    templateExtension: string;
    contextFiles: string;
    rootContextFiles: string;
    partialDirs: string;
    functionFiles: string;
    rootFunctionFiles: string;
    engine: string;
    debug: boolean;
    [name: string]: any;
  };
}

/** @ignore */
const FLAGS: meowOptions<any>["flags"] = {
  templateExtension: { type: "string" },
  contextFiles: { type: "string", default: "" },
  rootContextFiles: { type: "string", default: "" },
  partialDirs: { type: "string", default: "" },
  functionFiles: { type: "string", default: "" },
  rootFunctionFiles: { type: "string", default: "" },
  engine: { type: "string" },
  debug: { type: "boolean" },
  silence: { type: "boolean" },
};

/** @ignore */
const HELP = `
Usage
  $ readmeasy

Options
  --template-extension                    - File extension of the template.
  --context-files <paths>                 - js, ts, JSON5 or YAML files to get data to be passed to template under a key same as file name.
  --root-context-files                    - js, ts, JSON5 or YAML files to get data to be passed to template.
  --partial-dirs <paths csv>              - Paths of directories which contains partial files.
  --function-files <paths csv>            - Files to get filter/helper functions prefixed with file name. i.e "uc()" func in "path/helper.js" becomes "helperUc" helper/filter.
  --root-function-files <paths csv>       - Files to get filter/helper functions prefixed with file name. i.e "uc()" func in "path/helper.js" becomes "uc" helper/filter.
  --engine <engine name>                  - Template engine to be used. Supports engines supported by consolidate (https://www.npmjs.com/package/consolidate).
  --debug                                 - Print stack trace in errors.

Examples
  $ readmeasy
  $ readmeasy --context-files my-data.js,my-script.js
`;

/**
 * Splites CSV string of paths from CLI into array of absolute paths.
 *
 * @ignore
 * @param pathsCSV is comma split values of paths to split.
 * @returns array of absolute paths converted from relative to cwd().
 */
function splitPaths(pathsCSV: string): string[] {
  return pathsCSV ? pathsCSV.split(/\s*,\s*/).map((f) => resolve(f)) : [];
}

/** @ignore */
async function measy(): Promise<void> {
  const cli = meow(HELP, { flags: FLAGS }) as Result;

  const flags = {
    ...cli.flags,
    contextFiles: splitPaths(cli.flags.contextFiles),
    rootContextFiles: splitPaths(cli.flags.rootContextFiles),
    partialDirs: splitPaths(cli.flags.partialDirs),
    functionFiles: splitPaths(cli.flags.functionFiles),
    rootFunctionFiles: splitPaths(cli.flags.rootFunctionFiles),
  };

  try {
    const unknownOption = Object.keys(flags).find((key) => FLAGS && !FLAGS[key]);
    if (unknownOption) {
      throw new Error(`Unknown option '${unknownOption}'`);
    }

    await createReadMe(flags as any);
  } catch (e) {
    if (flags.debug) {
      throw e;
    } else {
      console.error(`Error: ${e.message}`);
      process.exit(1);
    }
  }

  console.log("README.md created.");
}

measy();

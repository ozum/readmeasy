/* eslint-disable no-console */
import { render, isEngineSupported, engineOfExtension, SupportedEngine } from "measy";
import topPkgDir from "top-pkg-dir";
import { join, extname } from "path";
import { promises as fs } from "fs";
import { findOrCreateTemplateFile, readPackageJson, arrify, advancedSupportedEngines } from "./utils";
import shields from "./shields";

/** @ignore */
const transform = require("doctoc/lib/transform"); // eslint-disable-line @typescript-eslint/no-var-requires

/** @ignore */
const TOC_TAG = "<!-- START doctoc -->\n<!-- END doctoc -->";

/**
 * Creates README.md from REDAME template.
 * @param options are the options.
 */
export default async function createReadMe(
  /* istanbul ignore next: Ignore default parameters. */
  options: {
    /** Directory to serach README template. */
    dir?: string;
    /** js, ts, JSON5 or YAML files to get data to be passed to template under a key same as file name. */
    contextFiles?: string | string[];
    /** js, ts, JSON5 or YAML files to get data to be passed to template. */
    rootContextFiles?: string | string[];
    /** Paths of directories which contains partial files. */
    partialDirs?: string | string[];
    /** Template engine to be used. Supports engines supported by consolidate (https://www.npmjs.com/package/consolidate). Defaults to `partials`. */
    engine?: SupportedEngine;
    /** Files to get filter/helper functions prefixed with file name. i.e "uc()" func in "path/helper.js" becomes "helperUc" helper/filter. */
    functionFiles?: string | string[];
    /** Files to get filter/helper functions prefixed with file name. i.e "uc()" func in "path/helper.js" becomes "uc" helper/filter. */
    rootFunctionFiles?: string | string[];
    /** File extension of the template. */
    templateExtension?: string;
  } = {}
): Promise<void> {
  const dir = options.dir || (await topPkgDir());
  const readmeTemplate = options.templateExtension ? join(dir, `README.${options.templateExtension}`) : await findOrCreateTemplateFile(dir);
  const packageJson = await readPackageJson(dir);
  const engine = options.engine || engineOfExtension(extname(readmeTemplate));

  if (!engine || !isEngineSupported(engine)) {
    throw new Error("Cannot determine template engine.");
  }

  let rendered = await render({
    ...options,
    template: readmeTemplate,
    partialDirs: advancedSupportedEngines.has(engine)
      ? [join(__dirname, "../module-files/partials", engine), ...arrify(options.partialDirs || "partials")]
      : [],
    contextFiles: options.contextFiles,
    rootContextFiles: options.rootContextFiles,
    context: { toc: TOC_TAG, allShields: shields(packageJson), package: packageJson },
    functionFiles: options.functionFiles,
    rootFunctionFiles: [join(__dirname, "helpers"), ...arrify(options.rootFunctionFiles)],
    engine,
  });

  if (rendered.includes(TOC_TAG)) {
    const docTocResult = transform(rendered, "github.com", 3, undefined, true);
    if (docTocResult.transformed) {
      rendered = docTocResult.data;
    }
  }

  await fs.writeFile(join(dir, "README.md"), rendered, { encoding: "utf8" });
}

export { findOrCreateTemplateFile };

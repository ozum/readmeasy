/* eslint-disable no-console */
import { render, isEngineSupported, engineOfExtension } from "measy";
import topPkgDir from "top-pkg-dir";
import { join, extname } from "path";
import fs from "fs";
import { findOrCreateTemplateFile, readPackageJson, arrify, advancedSupportedEngines } from "./utils";
import shields from "./shields";
import { CreateReadMeOptions } from "./types";

const transform = require("doctoc/lib/transform"); // eslint-disable-line @typescript-eslint/no-var-requires

const { writeFile } = fs.promises;

const TOC_TAG = "<!-- START doctoc -->\n<!-- END doctoc -->";

export default async function createReadMe(options: CreateReadMeOptions = {}): Promise<void> {
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
      ? [join(__dirname, "../module-files/partials", engine), ...arrify(options.partialDirs)]
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

  await writeFile(join(dir, "README.md"), rendered, { encoding: "utf8" });
}

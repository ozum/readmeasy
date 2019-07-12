import fs from "fs";
import { extname, basename, join } from "path";
import { SupportedEngine, engineOfExtension } from "measy";

const { readFile, readdir, writeFile } = fs.promises;

export const advancedSupportedEngines: Set<SupportedEngine | undefined> = new Set(["handlebars", "nunjucks"]);

/**
 * Makes given input array and returns it.
 *
 * @param input to construct array from
 * @returns created array.
 */
export function arrify<T>(input: T | T[] = []): T[] {
  return Array.isArray(input) ? input : [input];
}

/**
 * Returns top most `package.json` data as an object.
 *
 * @ignore
 * @returns top most `package.json`s data.
 */
export async function readPackageJson(dir: string): Promise<Record<string, any>> {
  const jsonFile = join(dir, "package.json");
  const content = await readFile(jsonFile, { encoding: "utf8" });
  return JSON.parse(content);
}

export async function findOrCreateTemplateFile(dir: string): Promise<string> {
  const filesInDir = await readdir(dir);
  const templateFiles = filesInDir.filter(file => basename(file, extname(file)).toLowerCase() === "readme" && extname(file) !== ".md");
  const templateFile = templateFiles.find(file => advancedSupportedEngines.has(engineOfExtension(extname(file)))) || templateFiles[0];

  if (!templateFile) {
    await writeFile(join(dir, "README.njk"), `{% include "module-header" %}\n\n# Synopsis\n\n# Details\n\n# API\n\n# Contribution\n\n`);
    return join(dir, "README.njk");
  }

  return join(dir, templateFile);
}

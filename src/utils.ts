import fs from "fs";
import { extname, basename, join } from "path";
import { SupportedEngine, engineOfExtension } from "measy";

const { readFile, readdir, writeFile, unlink } = fs.promises;

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
  const readMeFiles = filesInDir.filter(file => basename(file, extname(file)).toLowerCase() === "readme");
  const templateFiles = readMeFiles.filter(file => extname(file) !== ".md");

  const templateFile = templateFiles.find(file => advancedSupportedEngines.has(engineOfExtension(extname(file)))) || templateFiles[0];

  if (!templateFile) {
    const readMeFile = readMeFiles.find(file => extname(file) === ".md");
    const oldReadMeContent = readMeFile ? await readFile(join(dir, "README.md"), { encoding: "utf8" }) : "";
    const content = readMeFile
      ? `{% include "module-header" %}\n\n${oldReadMeContent}`
      : '{% include "module-header" %}\n\n# Synopsis\n\n# Details\n\n# API\n\n# Contribution\n\n';

    await writeFile(join(dir, "README.njk"), content);

    if (readMeFile) {
      await unlink(join(dir, readMeFile));
    }

    return join(dir, "README.njk");
  }

  return join(dir, templateFile);
}

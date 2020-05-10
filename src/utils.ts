import { extname, basename, join } from "path";
import { SupportedEngine, engineOfExtension } from "measy";
import { promises as fs } from "fs";

/** @ignore */
export const advancedSupportedEngines: Set<SupportedEngine | undefined> = new Set(["handlebars", "nunjucks"]);

/**
 * Makes given input array and returns it.
 *
 * @ignore
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
  const content = await fs.readFile(jsonFile, { encoding: "utf8" });
  return JSON.parse(content);
}

/**
 * Finds or creates README template file and returns the file found or created path.
 *
 * @param dir is the directory to search README template for.
 * @param extension is the extension to be used if template file would be created.
 * @returns path of the README template.
 */
export async function findOrCreateTemplateFile(dir: string, extension = "njk"): Promise<string> {
  const filesInDir = await fs.readdir(dir);
  const readMeFiles = filesInDir.filter((file) => basename(file, extname(file)).toLowerCase() === "readme");
  const templateFiles = readMeFiles.filter((file) => extname(file) !== ".md");

  const templateFile = templateFiles.find((file) => advancedSupportedEngines.has(engineOfExtension(extname(file)))) || templateFiles[0];

  if (!templateFile) {
    const readMeFile = readMeFiles.find((file) => extname(file) === ".md");
    const oldReadMeContent = readMeFile ? await fs.readFile(join(dir, "README.md"), { encoding: "utf8" }) : "";
    const content = readMeFile
      ? `{% include "module-header" %}\n\n${oldReadMeContent}`
      : '{% include "module-header" %}\n\n# Synopsis\n\n# Details\n\n# API\n\n# Contribution\n\n';

    await fs.writeFile(join(dir, `README.${extension}`), content);

    if (readMeFile) {
      await fs.unlink(join(dir, readMeFile));
    }

    return join(dir, `README.${extension}`);
  }

  return join(dir, templateFile);
}

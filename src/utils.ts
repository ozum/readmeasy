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
 * Returns README templates file by searching given directory for supported template extensions.
 *
 * @ignore
 * @param dir is the directory to search README templates for.
 * @returns template file paths.
 */
async function findReadMeFiles(dir: string): Promise<string[]> {
  const filesInDir = await fs.readdir(dir);
  return filesInDir.filter((file) => basename(file, extname(file)).toLowerCase() === "readme");
}

/**
 * Returns README template file by searching given directory for supported template extensions.
 * If more than one found, returns first one.
 *
 * @param dir is the directory to search README template for.
 * @returns template file path.
 */
export async function findTemplateFile(dir: string): Promise<string | undefined> {
  const templateFiles = (await findReadMeFiles(dir)).filter((file) => extname(file) !== ".md");
  return templateFiles.find((file) => advancedSupportedEngines.has(engineOfExtension(extname(file)))) || templateFiles[0];
}

/**
 * Finds or creates README template file and returns the file found or created path.
 *
 * @param dir is the directory to search README template for.
 * @param extension is the extension to be used if template file would be created.
 * @param defaultContent is the default content to create README template with.
 * @returns path of the README template.
 */
export async function findOrCreateTemplateFile(
  /* istanbul ignore next: Ignore default parameters. */
  { dir, templateExtension = "njk", defaultContent }: { dir: string; templateExtension?: string; defaultContent?: string } = {} as any
): Promise<string> {
  const templateFile = await findTemplateFile(dir);

  if (templateFile === undefined) {
    const readMeFile = (await findReadMeFiles(dir)).find((file) => extname(file) === ".md");
    const oldReadMeContent = readMeFile ? await fs.readFile(join(dir, "README.md"), { encoding: "utf8" }) : "";
    const content =
      defaultContent && !oldReadMeContent
        ? defaultContent
        : `{% include "module-header" %}\n\n# Synopsis\n\n# Details\n\n<!-- usage -->\n\n<!-- commands -->\n\n${oldReadMeContent}\n\n# API\n\n# Contribution\n\n`;
    await fs.writeFile(join(dir, `README.${templateExtension}`), content);

    if (readMeFile) {
      await fs.unlink(join(dir, readMeFile));
    }

    return join(dir, `README.${templateExtension}`);
  }

  return join(dir, templateFile);
}

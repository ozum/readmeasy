import { join } from "path";
import { readFile, outputFile, existsSync, remove } from "fs-extra";
import createReadMe, { findOrCreateTemplateFile } from "../src/index";

const read = (file: string): Promise<string> => readFile(join(__dirname, "test-helper", file), { encoding: "utf8" });
const dir = {
  njk: join(__dirname, "test-helper/nunjucks"),
  hbs: join(__dirname, "test-helper/handlebars"),
  mixed: join(__dirname, "test-helper/mixed"),
  mustache: join(__dirname, "test-helper/mustache"),
  none: join(__dirname, "test-helper/none"),
  noneWithDefault: join(__dirname, "test-helper/none-with-default"),
  noneWithReadMe: join(__dirname, "test-helper/none-with-readme"),
};

beforeAll(async () => {
  await outputFile(join(dir.noneWithReadMe, "readme.md"), "OLD README CONTENT\n");
});

afterAll(async () => {
  return Promise.all([
    remove(join(dir.njk, "README.md")),
    remove(join(dir.hbs, "README.md")),
    remove(join(dir.mustache, "README.md")),
    remove(join(dir.mixed, "README.md")),
    remove(join(dir.none, "README.md")),
    remove(join(dir.none, "README.njk")),
    remove(join(dir.noneWithDefault, "README.njk")),
    remove(join(dir.noneWithDefault, "README.md")),
    remove(join(dir.noneWithReadMe, "README.njk")),
    remove(join(dir.noneWithReadMe, "README.md")),
  ]);
});

describe("createRadMe()", () => {
  it("should create README.md from template", async () => {
    await createReadMe({ dir: dir.hbs });
    const expected = await read("handlebars/expected-readme.txt");
    const result = await read("handlebars/README.md");
    expect(result).toBe(expected);
  });

  it("should create README.md from first available template if more than one is available", async () => {
    await createReadMe({ dir: dir.mixed });
    const expected = await read("mixed/expected-readme.txt");
    const result = await read("mixed/README.md");
    expect(result).toBe(expected);
  });

  it("should create README.md from template with given extension", async () => {
    await createReadMe({ dir: dir.njk, templateExtension: "njk" });
    const expected = await read("nunjucks/expected-readme.txt");
    const result = await read("nunjucks/README.md");
    expect(result).toBe(expected);
  });

  it("should throw if engine is not supported", async () => {
    await expect(createReadMe({ engine: "xyz" as any })).rejects.toThrow("Cannot determine");
  });

  it("should create README.md from simple supported template", async () => {
    await createReadMe({ dir: dir.mustache, engine: "mustache" });
    const expected = await read("mustache/expected-readme.txt");
    const result = await read("mustache/README.md");
    expect(result).toBe(expected);
  });

  it("should create template file if not exists", async () => {
    await createReadMe({ dir: dir.none });
    const expected = await read("none/expected-readme.txt");
    const result = await read("none/README.md");
    expect(result).toBe(expected);
  });

  it("should create template file with given default content if not exists", async () => {
    await createReadMe({ dir: dir.noneWithDefault, defaultContent: "DEFAULT CONTENT\n" });
    const expected = await read("none-with-default/expected-readme.txt");
    const result = await read("none-with-default/README.md");
    expect(result).toBe(expected);
  });

  it("should create template file if not exists and copy old readme file's content to template file", async () => {
    await createReadMe({ dir: dir.noneWithReadMe });
    const expected = await read("none-with-readme/expected-readme.txt");
    const result = await read("none-with-readme/README.md");
    expect(result).toBe(expected);
  });
});

describe("findOrCreateTemplateFile", () => {
  it("should find README template", async () => {
    expect(await findOrCreateTemplateFile({ dir: dir.njk })).toBe(join(dir.njk, "README.njk"));
  });
});

import { join } from "path";
import fs, { existsSync } from "fs";
import createReadMe from "../src/index";

const { readFile, unlink } = fs.promises;
const read = (file: string): Promise<string> => readFile(join(__dirname, "test-helper", file), { encoding: "utf8" });
const dir = {
  njk: join(__dirname, "test-helper/nunjucks"),
  hbs: join(__dirname, "test-helper/handlebars"),
  mixed: join(__dirname, "test-helper/mixed"),
  mustache: join(__dirname, "test-helper/mustache"),
  none: join(__dirname, "test-helper/none"),
};

afterAll(async () => {
  return Promise.all([
    unlink(join(dir.njk, "README.md")),
    unlink(join(dir.hbs, "README.md")),
    unlink(join(dir.mustache, "README.md")),
    unlink(join(dir.mixed, "README.md")),
    unlink(join(dir.none, "README.md")),
    unlink(join(dir.none, "README.njk")),
  ]);
});

describe("createRadMe()", () => {
  it("should create README.md for this project", async () => {
    await createReadMe();
    const exists = existsSync(join(__dirname, "../README.md"));
    expect(exists).toBe(true);
  });

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
});

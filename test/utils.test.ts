import { arrify, findTemplateFile, findReadMeFiles } from "../src/utils";

describe("arrify", () => {
  it("should return for non-array input.", () => {
    expect(arrify(1)).toEqual([1]);
  });
});

describe("findReadMeFiles", () => {
  it("should return README file and templates.", async () => {
    expect(await findReadMeFiles()).toEqual(["README.md", "README.njk"]);
  });
});

describe("findTemplateFile", () => {
  it("should return first README template..", async () => {
    expect(await findTemplateFile()).toEqual("README.njk");
  });
});

import { changeCase } from "../src/helpers";

describe("changeCase", () => {
  it("should return capital case for 'capital'.", () => {
    expect(changeCase("my-title", "capital")).toBe("My Title");
  });

  it("should return capital case for 'capitalCase'.", () => {
    expect(changeCase("my-title", "capitalCase")).toBe("My Title");
  });
});

import { arrify } from "../src/utils";

describe("arrify", () => {
  it("should return for non-array input", () => {
    expect(arrify(1)).toEqual([1]);
  });
});

const { generateSqlForUpdate } = require("./sql");

describe("generateSqlForUpdate", function () {
  test("works with a single item", function () {
    const result = generateSqlForUpdate(
        { f1: "v1" },
        { f1: "f1", fF2: "f2" });
    expect(result).toEqual({
      sqlSetCols: "\"f1\"=$1",
      values: ["v1"],
    });
  });

  test("works with multiple items", function () {
    const result = generateSqlForUpdate(
        { f1: "v1", jsF2: "v2" },
        { jsF2: "f2" });
    expect(result).toEqual({
      sqlSetCols: "\"f1\"=$1, \"f2\"=$2",
      values: ["v1", "v2"],
    });
  });
});

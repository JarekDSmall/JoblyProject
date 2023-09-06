const { DataError } = require("../customErrors");

/**
 * Utility function to assist in creating SQL update queries.
 *
 * This function can be utilized to generate the SET clause for an SQL UPDATE
 * command.
 *
 * @param dataToUpdate {Object} {attribute1: newVal, attribute2: newVal, ...}
 * @param jsToSql {Object} translates js-style data attributes to database column identifiers,
 *   e.g., { firstName: "first_name", age: "age" }
 *
 * @returns {Object} {sqlSetCols, dataToUpdate}
 *
 * @example {firstName: 'Aria', age: 30} =>
 *   { sqlSetCols: '"first_name"=$1, "age"=$2',
 *     values: ['Aria', 30] }
 */

function generateSqlForUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new DataError("Missing data");

  // {firstName: 'Aria', age: 30} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
      `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    sqlSetCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { generateSqlForUpdate };


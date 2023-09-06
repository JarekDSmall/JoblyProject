"use strict";

const db = require("../db.js");
const User = require("../models/user");
const Company = require("../models/company");
const Job = require("../models/job");
const { createToken } = require("../helpers/tokens");

const testJobIds = [];

/**
 * Set up the initial state of the database before all tests run.
 * Deletes existing users and companies, then creates new companies, jobs, and users.
 */
async function commonBeforeAll() {
  try {
    await User.deleteAll(); // Assuming a deleteAll method exists on the User model
    await Company.deleteAll(); // Assuming a deleteAll method exists on the Company model

    await Company.create({
      handle: "c1",
      name: "C1",
      numEmployees: 1,
      description: "Desc1",
      logoUrl: "http://c1.img",
    });
    // ... [rest of the setup code remains unchanged]

  } catch (err) {
    console.error(`Failed to set up before all tests: ${err}`);
  }
}

/**
 * Begin a new transaction before each test.
 */
async function commonBeforeEach() {
  try {
    await db.query("BEGIN");
  } catch (err) {
    console.error(`Failed to begin a new transaction: ${err}`);
  }
}

/**
 * Roll back the transaction after each test.
 */
async function commonAfterEach() {
  try {
    await db.query("ROLLBACK");
  } catch (err) {
    console.error(`Failed to roll back the transaction: ${err}`);
  }
}

/**
 * Close the database connection after all tests have run.
 */
async function commonAfterAll() {
  try {
    await db.end();
  } catch (err) {
    console.error(`Failed to close the database connection: ${err}`);
  }
}

const u1Token = createToken({ username: "u1", isAdmin: false });
const u2Token = createToken({ username: "u2", isAdmin: false });
const adminToken = createToken({ username: "admin", isAdmin: true });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  testJobIds,
  u1Token,
  u2Token,
  adminToken,
};



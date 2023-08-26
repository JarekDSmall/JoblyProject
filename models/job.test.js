process.env.NODE_ENV = "test";

const db = require("../db");
const Job = require("../models/job");
const { BadRequestError, NotFoundError } = require("../expressError");

describe("Job model", function () {
  beforeEach(async function () {
    await db.query("DELETE FROM jobs");
    await db.query(
      `INSERT INTO jobs (id, title, salary, equity, company_handle)
       VALUES (1, 'Software Engineer', 100000, 0.1, 'c1'),
              (2, 'Product Manager', 90000, 0.05, 'c2')`
    );
  });

  describe("create", function () {
    it("creates a new job", async function () {
      const job = await Job.create({
        title: "Front-end Developer",
        salary: 80000,
        equity: 0.02,
        companyHandle: "c1",
      });
      expect(job).toEqual({
        id: expect.any(Number),
        title: "Front-end Developer",
        salary: 80000,
        equity: 0.02,
        companyHandle: "c1",
      });
    });

    // Add more test cases for edge cases and error handling
  });

  describe("findAll", function () {
    it("returns all jobs", async function () {
      const jobs = await Job.findAll();
      expect(jobs).toEqual([
        {
          id: 1,
          title: "Software Engineer",
          salary: 100000,
          equity: 0.1,
          companyHandle: "c1",
        },
        {
          id: 2,
          title: "Product Manager",
          salary: 90000,
          equity: 0.05,
          companyHandle: "c2",
        },
      ]);
    });

  });

  describe("get", function () {
    it("returns a single job", async function () {
      const job = await Job.get(1);
      expect(job).toEqual({
        id: 1,
        title: "Software Engineer",
        salary: 100000,
        equity: 0.1,
        companyHandle: "c1",
      });
    });

    it("throws NotFoundError if job not found", async function () {
      try {
        await Job.get(100);
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });

  });

  
});

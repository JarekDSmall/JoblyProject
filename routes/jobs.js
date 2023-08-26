const express = require("express");
const { BadRequestError, NotFoundError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Job = require("../models/job");
const jobNewSchema = require("../schemas/jobNew.json");
const jobUpdateSchema = require("../schemas/jobUpdate.json");
const router = new express.Router();

/** POST /jobs { job } =>  { job }
 *
 * job should be { title, salary, equity, companyHandle }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: login, admin
 */

router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    // Validate request body against jobNewSchema
    const validator = jsonschema.validate(req.body, jobNewSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Create a new job using the Job.create method
    const job = await Job.create(req.body);

    // Return the newly created job data
    return res.status(201).json({ job });
  } catch (err) {
    return next(err);
  }
});

/** GET /jobs  =>  { jobs: [ { id, title, salary, equity, companyHandle }, ...] }
 *
 * Authorization required: none
 */

router.get("/", async function (req, res, next) {
  try {
    // Extract query parameters for filtering
    const { title, minSalary, hasEquity } = req.query;

    // Call Job model method to get filtered jobs
    const jobs = await Job.findAll({ title, minSalary, hasEquity });

    return res.json({ jobs });
  } catch (err) {
    return next(err);
  }
});

/** GET /jobs/:id  =>  { job }
 *
 *  Job is { id, title, salary, equity, companyHandle }
 *
 * Authorization required: none
 */

router.get("/:id", async function (req, res, next) {
  try {
    const job = await Job.get(req.params.id);
    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** PATCH /jobs/:id { fld1, fld2, ... } => { job }
 *
 * Patches job data.
 *
 * fields can be: { title, salary, equity }
 *
 * Returns { id, title, salary, equity, companyHandle }
 *
 * Authorization required: login, admin
 */

router.patch("/:id", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    // Validate the incoming data against the update schema
    const validator = jsonschema.validate(req.body, jobUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Update the job's information
    const job = await Job.update(req.params.id, req.body);

    return res.json({ job });
  } catch (err) {
    return next(err);
  }
});

/** DELETE /jobs/:id  =>  { deleted: id }
 *
 * Authorization required: login, admin
 */

router.delete("/:id", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    // Remove the job from the database
    await Job.remove(req.params.id);

    return res.json({ deleted: req.params.id });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

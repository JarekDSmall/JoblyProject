"use strict";

const jsonschema = require("jsonschema");
const express = require("express");
const { BadRequestError } = require("../expressError");
const { ensureLoggedIn, ensureAdmin } = require("../middleware/auth");
const Company = require("../models/company");
const companyNewSchema = require("../schemas/companyNew");
const companyUpdateSchema = require("../schemas/companyUpdate");

const router = new express.Router();

router.post("/", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, companyNewSchema);
    if (!validator.valid) throw new BadRequestError(validator.errors.map(e => e.stack));

    const company = await Company.create(req.body);
    return res.status(201).json({ company });
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const { name, minEmployees, maxEmployees } = req.query;
    const companies = await Company.findAll({ name, minEmployees, maxEmployees });

    return res.json({ companies });
  } catch (err) {
    return next(err);
  }
});

router.get("/:handle", async function (req, res, next) {
  try {
    const company = await Company.get(req.params.handle);
    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});

// Update a company's information
router.patch("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    // Validate the incoming data against the update schema
    const validator = jsonschema.validate(req.body, companyUpdateSchema);
    if (!validator.valid) {
      const errs = validator.errors.map(e => e.stack);
      throw new BadRequestError(errs);
    }

    // Update the company's information
    const company = await Company.update(req.params.handle, req.body);

    return res.json({ company });
  } catch (err) {
    return next(err);
  }
});


router.delete("/:handle", ensureLoggedIn, ensureAdmin, async function (req, res, next) {
  try {
    await Company.remove(req.params.handle);
    return res.json({ deleted: req.params.handle });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;

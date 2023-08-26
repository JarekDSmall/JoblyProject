const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Job = require("../models/job");

describe("Job Routes Test", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM jobs");
    await Job.create({
      title: "Software Engineer",
      salary: 100000,
      equity: 0.1,
      companyHandle: "apple",
    });
  });

  test("GET /jobs", async () => {
    const response = await request(app).get("/jobs");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      jobs: [
        {
          id: expect.any(Number),
          title: "Software Engineer",
          salary: 100000,
          equity: 0.1,
          companyHandle: "apple",
        },
      ],
    });
  });

  test("GET /jobs/:id", async () => {
    const job = await Job.create({
      title: "Frontend Developer",
      salary: 90000,
      equity: 0,
      companyHandle: "google",
    });

    const response = await request(app).get(`/jobs/${job.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "Frontend Developer",
        salary: 90000,
        equity: 0,
        companyHandle: "google",
      },
    });
  });

  test("POST /jobs", async () => {
    const response = await request(app)
      .post("/jobs")
      .send({
        title: "Backend Developer",
        salary: 95000,
        equity: 0.05,
        companyHandle: "amazon",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      job: {
        id: expect.any(Number),
        title: "Backend Developer",
        salary: 95000,
        equity: 0.05,
        companyHandle: "amazon",
      },
    });
  });

  test("PATCH /jobs/:id", async () => {
    const job = await Job.create({
      title: "Product Manager",
      salary: 110000,
      equity: 0.02,
      companyHandle: "facebook",
    });

    const response = await request(app)
      .patch(`/jobs/${job.id}`)
      .send({
        salary: 120000,
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      job: {
        id: job.id,
        title: "Product Manager",
        salary: 120000,
        equity: 0.02,
        companyHandle: "facebook",
      },
    });
  });

  test("DELETE /jobs/:id", async () => {
    const job = await Job.create({
      title: "Quality Assurance",
      salary: 80000,
      equity: 0.03,
      companyHandle: "microsoft",
    });

    const response = await request(app).delete(`/jobs/${job.id}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      deleted: job.id,
    });
  });

  afterAll(async () => {
    await db.end();
  });
});

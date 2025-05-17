import { describe, it, expect, beforeAll, afterAll } from "@jest/globals";
import request from "supertest";
import { app } from "../main";
import { Pool } from "pg";
import { redisClient } from "../services/redis";

const testPool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DB || "weather",
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
});

describe("Alerts API", () => {
  beforeAll(async () => {
    await testPool.query("DELETE FROM alerts");
  });

  afterAll(async () => {
    await testPool.end();
    await redisClient.quit();
  });

  describe("POST /api/alerts", () => {
    it("should create a valid alert", async () => {
      const validAlert = {
        name: "Test Alert",
        location: "Test Location",
        parameter: "temperature",
        condition: "greater_than",
        threshold: 30,
        latitude: 32.0853,
        longitude: 34.7818,
      };

      const response = await request(app)
        .post("/api/alerts")
        .send(validAlert)
        .expect(201);

      expect(response.body).toMatchObject({
        name: validAlert.name,
        location: validAlert.location,
        parameter: validAlert.parameter,
        condition: validAlert.condition,
        threshold: validAlert.threshold,
        latitude: validAlert.latitude,
        longitude: validAlert.longitude,
      });
    });

    it("should reject invalid weather parameter", async () => {
      const invalidAlert = {
        name: "Test Alert",
        location: "Test Location",
        parameter: "invalid_param",
        condition: "greater_than",
        threshold: 30,
        latitude: 32.0853,
        longitude: 34.7818,
      };

      const response = await request(app)
        .post("/api/alerts")
        .send(invalidAlert)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });

    it("should reject invalid threshold", async () => {
      const invalidAlert = {
        name: "Test Alert",
        location: "Test Location",
        parameter: "temperature",
        condition: "greater_than",
        threshold: 1000,
        latitude: 32.0853,
        longitude: 34.7818,
      };

      const response = await request(app)
        .post("/api/alerts")
        .send(invalidAlert)
        .expect(400);

      expect(response.body).toHaveProperty("error");
    });
  });

  describe("GET /api/alerts", () => {
    it("should list all alerts", async () => {
      const response = await request(app).get("/api/alerts").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe("POST /api/alerts/check-all", () => {
    it("should start alert evaluation", async () => {
      const response = await request(app)
        .post("/api/alerts/check-all")
        .expect(200);

      expect(response.body).toHaveProperty("batchId");
      expect(response.body).toHaveProperty("total");
      expect(response.body).toHaveProperty("message");
    });
  });
});

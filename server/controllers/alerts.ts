import { v4 as uuidv4 } from "uuid";
import { Alert, AlertInput } from "../types/alert";
import { Request, Response } from "express";
import { alertCheckProducer } from "../queues/alertProducer";
import { redisClient } from "../services/redis";
import logger from "../lib/logger";
import { Pool } from "pg";

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DB || "weather",
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
});

let alerts: Alert[] = [];

export const getAlerts = async (req: Request, res: Response) => {
  try {
    const client = await pool.connect();
    try {
      const result = await client.query(
        "SELECT * FROM alerts ORDER BY created_at DESC"
      );
      res.json(result.rows);
    } finally {
      client.release();
    }
  } catch (err) {
    logger.error("Failed to fetch alerts", err);
    res.status(500).json({ error: "Failed to fetch alerts" });
  }
};

export const createAlert = async (req: Request, res: Response) => {
  try {
    const input = req.body as AlertInput;
    const client = await pool.connect();

    try {
      const result = await client.query(
        `INSERT INTO alerts (
          id, name, location, latitude, longitude, 
          parameter, condition, threshold, unit, 
          is_triggered, state, created_at, updated_at, 
          last_checked
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW(), NOW()) 
        RETURNING *`,
        [
          uuidv4(),
          input.name,
          input.location,
          input.latitude,
          input.longitude,
          input.parameter,
          input.condition,
          input.threshold,
          getUnitForParameter(input.parameter),
          false,
          "active",
        ]
      );

      res.status(201).json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (err) {
    logger.error("Failed to create alert", err);
    res.status(500).json({ error: "Failed to create alert" });
  }
};

export const updateAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const client = await pool.connect();

    try {
      const result = await client.query(
        `UPDATE alerts 
         SET name = COALESCE($1, name),
             location = COALESCE($2, location),
             latitude = COALESCE($3, latitude),
             longitude = COALESCE($4, longitude),
             parameter = COALESCE($5, parameter),
             condition = COALESCE($6, condition),
             threshold = COALESCE($7, threshold),
             unit = COALESCE($8, unit),
             updated_at = NOW()
         WHERE id = $9
         RETURNING *`,
        [
          updates.name,
          updates.location,
          updates.latitude,
          updates.longitude,
          updates.parameter,
          updates.condition,
          updates.threshold,
          updates.unit
            ? updates.unit
            : getUnitForParameter(updates.parameter || ""),
          id,
        ]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Alert not found" });
      }

      res.json(result.rows[0]);
    } finally {
      client.release();
    }
  } catch (err) {
    logger.error("Failed to update alert", err);
    res.status(500).json({ error: "Failed to update alert" });
  }
};

export const deleteAlert = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const client = await pool.connect();

    try {
      const result = await client.query(
        "DELETE FROM alerts WHERE id = $1 RETURNING id",
        [id]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Alert not found" });
      }

      res.json({ success: true });
    } finally {
      client.release();
    }
  } catch (err) {
    logger.error("Failed to delete alert", err);
    res.status(500).json({ error: "Failed to delete alert" });
  }
};

export const loadMockAlerts = (mock: Alert[]) => {
  alerts = [...mock];
};

const getUnitForParameter = (param: string) => {
  return (
    {
      temperature: "°C",
      humidity: "%",
      windSpeed: "km/h",
      visibility: "km",
      precipitation: "mm",
    }[param] || ""
  );
};

export const checkAllAlerts = async (req: Request, res: Response) => {
  try {
    const batchId = uuidv4();

    const client = await pool.connect();
    let alerts: Alert[] = [];

    try {
      const result = await client.query(
        "SELECT * FROM alerts WHERE state != $1",
        ["disabled"]
      );
      alerts = result.rows;
    } finally {
      client.release();
    }

    await redisClient.hset(`evaluation:batch:${batchId}`, {
      total: alerts.length,
      processed: 0,
      failed: 0,
      done: false,
      startedAt: new Date().toISOString(),
    });

    for (const alert of alerts) {
      await alertCheckProducer.publish({
        ...alert,
        batchId,
      });
    }

    res.json({
      batchId,
      total: alerts.length,
      message: "Alert check started",
    });
  } catch (err) {
    logger.error("Failed to check all alerts", err);
    res.status(500).json({ error: "Failed to check all alerts" });
  }
};

export const getEvaluationStatus = async (req: Request, res: Response) => {
  try {
    const { batchId } = req.params;
    const status = await redisClient.hgetall(`evaluation:batch:${batchId}`);

    if (!status || Object.keys(status).length === 0) {
      return res.status(404).json({ error: "Evaluation batch not found" });
    }

    const failedAlerts = await redisClient.lrange(
      `evaluation:failed:${batchId}`,
      0,
      -1
    );

    res.json({
      ...status,
      failed: parseInt(status.failed || "0"),
      total: parseInt(status.total || "0"),
      processed: parseInt(status.processed || "0"),
      failedAlerts: failedAlerts.map((alert) => JSON.parse(alert)),
    });
  } catch (err) {
    logger.error("Failed to get evaluation status", err);
    res.status(500).json({ error: "Failed to get evaluation status" });
  }
};

export const retryFailedAlerts = async (req: Request, res: Response) => {
  try {
    const { batchId } = req.params;
    const failedAlerts = await redisClient.lrange(
      `evaluation:failed:${batchId}`,
      0,
      -1
    );

    if (!failedAlerts || failedAlerts.length === 0) {
      return res.status(404).json({ error: "No failed alerts found" });
    }

    const newBatchId = uuidv4();
    await redisClient.hset(`evaluation:batch:${newBatchId}`, {
      total: failedAlerts.length,
      processed: 0,
      failed: 0,
      done: false,
      startedAt: new Date().toISOString(),
      isRetry: true,
      originalBatchId: batchId,
    });

    for (const alertJson of failedAlerts) {
      const alert = JSON.parse(alertJson) as Alert;
      await alertCheckProducer.publish({
        ...alert,
        batchId: newBatchId,
      });
    }

    res.json({
      batchId: newBatchId,
      total: failedAlerts.length,
      message: "Retry started",
    });
  } catch (err) {
    logger.error("Failed to retry failed alerts", err);
    res.status(500).json({ error: "Failed to retry failed alerts" });
  }
};

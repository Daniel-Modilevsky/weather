import { Pool } from "pg";
import fs from "fs";
import path from "path";
import logger from "../lib/logger";

const pool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: parseInt(process.env.POSTGRES_PORT || "5432"),
  database: process.env.POSTGRES_DB || "weather",
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD || "postgres",
});

async function runMigrations() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Read and execute each migration file
    const migrationsDir = path.join(__dirname, "../migrations");
    const files = fs.readdirSync(migrationsDir).sort();

    for (const file of files) {
      if (!file.endsWith(".sql")) continue;

      logger.info(`Running migration: ${file}`);
      const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
      await client.query(sql);
      logger.info(`Completed migration: ${file}`);
    }

    await client.query("COMMIT");
    logger.info("All migrations completed successfully");
  } catch (err) {
    await client.query("ROLLBACK");
    logger.error("Migration failed", err);
    throw err;
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => {
  logger.error("Migration script failed", err);
  process.exit(1);
});

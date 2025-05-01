import { connect } from "amqplib";
import logger from "../lib/logger";
import dotenv from "dotenv";

dotenv.config();

let channel: any = null;

export const initAlertProducer = async () => {
  try {
    const conn = await connect(process.env.RABBITMQ_URL || "amqp://localhost");
    channel = await conn.createChannel();
    await channel.assertQueue("evaluate_alerts");
    logger.info("RabbitMQ producer initialized");
  } catch (err) {
    logger.error("Failed to initialize RabbitMQ producer", err);
    throw err;
  }
};

export const alertCheckProducer = {
  publish: async (alert: any) => {
    if (!channel) throw new Error("Channel not initialized");
    channel.sendToQueue("evaluate_alerts", Buffer.from(JSON.stringify(alert)));
  },
};

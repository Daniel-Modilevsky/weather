import { connect } from "amqplib";
import logger from "../lib/logger";

let channel: any = null;

export const initAlertProducer = async () => {
  try {
    const conn = await connect("amqp://localhost");
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

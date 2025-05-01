import amqp from "amqplib";
import logger from "../lib/logger";

let channel: amqp.Channel;

export let alertCheckProducer: {
  publish: (alert: any) => Promise<void>;
};

export async function initAlertProducer() {
  try {
    const connection = await amqp.connect(process.env.RABBITMQ_URL!);
    channel = await connection.createChannel();
    await channel.assertQueue("evaluate_alerts", { durable: true });

    logger.info("RabbitMQ producer initialized");
  } catch (err) {
    logger.error("Failed to initialize RabbitMQ producer", err);
    throw err;
  }
}

export function publishAlertCheck(alertId: string) {
  if (!channel) throw new Error("RabbitMQ channel not initialized");
  channel.sendToQueue("evaluate_alerts", Buffer.from(alertId));
}

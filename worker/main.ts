import amqp from "amqplib";
import dotenv from "dotenv";
import { evaluateAlertMessage } from "./handlers/evaluateAlertMessage";
import logger from "./lib/logger";

dotenv.config();

async function startWorker() {
  const conn = await amqp.connect("amqp://localhost");
  const channel = await conn.createChannel();

  const QUEUE_NAME = "evaluate_alerts";
  await channel.assertQueue(QUEUE_NAME, { durable: true });

  logger.info(`Worker is listening on queue: ${QUEUE_NAME}`);

  channel.consume(
    QUEUE_NAME,
    async (msg) => {
      if (!msg) return;
      await evaluateAlertMessage(msg.content);
      channel.ack(msg);
    },
    { noAck: false }
  );
}

startWorker().catch((err) => {
  logger.error("Worker crashed", err);
});

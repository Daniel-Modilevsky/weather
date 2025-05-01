import amqp from "amqplib";
import { evaluateAlert } from "../services/evaluateAlert";

const QUEUE = "evaluate_alerts";

export async function startConsumer() {
  const conn = await amqp.connect(
    process.env.RABBITMQ_URL || "amqp://localhost"
  );
  const channel = await conn.createChannel();

  await channel.assertQueue(QUEUE, { durable: true });

  console.log(`✅ Worker is listening on queue: ${QUEUE}`);
  channel.consume(
    QUEUE,
    async (msg) => {
      if (!msg) return;
      const content = msg.content.toString();
      try {
        const { alertId } = JSON.parse(content);
        await evaluateAlert(alertId);
        channel.ack(msg);
      } catch (err) {
        console.error("❌ Failed to process message:", err);
        channel.nack(msg, false, false); // Reject message (no requeue for now)
      }
    },
    { noAck: false }
  );
}

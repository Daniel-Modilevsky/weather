import dotenv from "dotenv";
import { startConsumer } from "./queues/consumer";

dotenv.config();

startConsumer();

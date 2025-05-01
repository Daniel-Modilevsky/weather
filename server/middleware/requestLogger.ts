import morgan from "morgan";
import { stream } from "../lib/logger";

const requestLogger = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream }
);

export default requestLogger;

import winston from "winston";
import path from "path";

const logDir = path.resolve(__dirname, "../logs");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: `${logDir}/combined.log` }),
    new winston.transports.File({
      filename: `${logDir}/error.log`,
      level: "error",
    }),
  ],
});

export default logger;

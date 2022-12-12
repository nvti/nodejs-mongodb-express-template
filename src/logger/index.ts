import { transports, createLogger, format } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.errors({ stack: true }),
    format.timestamp(),
    format.json()
  ),
  defaultMeta: {},
  transports: [new transports.Console({ format: format.simple() })],
});

logger.add(new transports.File({ filename: "logs/combined.log" }));
logger.add(
  new transports.File({
    filename: "logs/error.log",
    level: "error",
  })
);

export default logger;

import pino from "pino";

const isDev = process.env.NODE_ENV !== "production";

export const logger = pino({
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});

export default logger;

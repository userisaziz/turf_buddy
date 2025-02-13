import os from "os";
import winston from "winston";
import "winston-syslog";

const isDev = process.env.NODE_ENV !== "production";

const transports = [];

if (isDev) {
  // In development, log to console
  transports.push(new winston.transports.Console({ format: winston.format.simple() }));
} else {
  // In production, log to Papertrail
  const papertrail = new winston.transports.Syslog({
    host: "logs3.papertrailapp.com",
    port: 19240,
    protocol: "tls4",
    localhost: os.hostname(),
    eol: "\n",
  });

  transports.push(papertrail);
}

const logger = winston.createLogger({
  format: winston.format.simple(),
  levels: winston.config.syslog.levels,
  transports,
});

export default logger;

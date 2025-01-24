
import os from "os"
import winston from 'winston';
// Replace require with import
import 'winston-syslog';

const papertrail = new winston.transports.Syslog({
   host: 'logs3.papertrailapp.com',
   port: 19240,
   protocol: 'tls4',
   localhost: os.hostname(),
   eol: '\n',
});

const logger = winston.createLogger({
   format: winston.format.simple(),
   levels: winston.config.syslog.levels,
   transports: [papertrail],
});
export default logger;
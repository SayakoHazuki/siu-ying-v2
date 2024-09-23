import winston from "winston";

// Using winston to log messages to the console
const logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
    ],
});

export default logger;

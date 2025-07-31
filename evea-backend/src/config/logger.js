// evea-backend/src/config/logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

// Custom format for console
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    if (stack) log += `\n${stack}`;
    if (Object.keys(meta).length > 0) log += `\n${JSON.stringify(meta, null, 2)}`;
    return log;
  })
);

// File format
const fileFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create transports
const transports = [
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || 'debug',
    format: consoleFormat
  })
];

// Add file transports for non-test environments
if (process.env.NODE_ENV !== 'test') {
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      level: 'info',
      format: fileFormat,
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  );
}

// Create logger
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || 'debug',
  transports,
  exitOnError: false
});

// Add colors
winston.addColors({
  error: 'red',
  warn: 'yellow', 
  info: 'green',
  http: 'magenta',
  debug: 'blue'
});

// Enhanced logging methods for EVEA
logger.vendor = {
  registration: (vendorId, email, step, message) => {
    logger.info(`[VENDOR] ${message}`, { vendorId, email, step });
  },
  login: (vendorId, email) => {
    logger.info(`[VENDOR] Login successful`, { vendorId, email });
  },
  approval: (vendorId, status, adminEmail) => {
    logger.info(`[VENDOR] Status: ${status}`, { vendorId, adminEmail });
  }
};

logger.user = {
  registration: (userId, email) => {
    logger.info(`[USER] Registration successful`, { userId, email });
  },
  login: (userId, email) => {
    logger.info(`[USER] Login successful`, { userId, email });
  }
};

logger.email = {
  sent: (to, subject, result) => {
    logger.info(`[EMAIL] Sent: ${subject}`, { to, messageId: result?.messageId });
  },
  failed: (to, subject, error) => {
    logger.error(`[EMAIL] Failed: ${subject}`, { to, error: error.message });
  }
};

// Error logging with context
logger.logError = (error, context = {}) => {
  logger.error(error.message, {
    stack: error.stack,
    ...context
  });
};

// Request middleware
logger.requestMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip
    });
  });
  
  next();
};

module.exports = logger;
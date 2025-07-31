// evea-backend/src/config/logger.js
const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
// const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels and colors
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4
};

const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue'
};

winston.addColors(logColors);

// Custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;
    
    // Add stack trace for errors
    if (stack) {
      log += `\n${stack}`;
    }
    
    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      log += `\n${JSON.stringify(meta, null, 2)}`;
    }
    
    return log;
  })
);

// Custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json(),
  winston.format.prettyPrint()
);

// Define transports based on environment
const transports = [];

// Console transport (always active)
transports.push(
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    format: consoleFormat,
    handleExceptions: true,
    handleRejections: true
  })
);

// File transports for production and development
if (process.env.NODE_ENV !== 'test') {
  // Error logs
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5,
      handleExceptions: true,
      handleRejections: true
    })
  );

  // Combined logs
  transports.push(
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      level: 'info',
      format: fileFormat,
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5
    })
  );

  // HTTP request logs (if enabled)
  if (process.env.LOG_HTTP === 'true') {
    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'http.log'),
        level: 'http',
        format: fileFormat,
        maxsize: 5 * 1024 * 1024, // 5MB
        maxFiles: 3
      })
    );
  }

  // Debug logs (development only)
  if (process.env.NODE_ENV === 'development') {
    transports.push(
      new winston.transports.File({
        filename: path.join(logsDir, 'debug.log'),
        level: 'debug',
        format: fileFormat,
        maxsize: 5 * 1024 * 1024, // 5MB
        maxFiles: 2
      })
    );
  }
}

// Create the logger
const logger = winston.createLogger({
  levels: logLevels,
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true })
  ),
  transports,
  exitOnError: false
});

// ==================== ENHANCED LOGGING METHODS ====================

// Vendor-specific logging methods
logger.vendor = {
  registration: (vendorId, email, step, message) => {
    logger.info(`[VENDOR_REGISTRATION] ${message}`, {
      vendorId,
      email,
      step,
      category: 'vendor_registration'
    });
  },
  
  login: (vendorId, email, method = 'local') => {
    logger.info(`[VENDOR_LOGIN] Vendor logged in via ${method}`, {
      vendorId,
      email,
      method,
      category: 'vendor_auth'
    });
  },
  
  approval: (vendorId, email, status, adminEmail) => {
    logger.info(`[VENDOR_APPROVAL] Vendor ${status}`, {
      vendorId,
      email,
      status,
      adminEmail,
      category: 'vendor_approval'
    });
  },
  
  service: (vendorId, serviceId, action, details) => {
    logger.info(`[VENDOR_SERVICE] ${action}`, {
      vendorId,
      serviceId,
      action,
      details,
      category: 'vendor_service'
    });
  }
};

// User-specific logging methods
logger.user = {
  registration: (userId, email, method = 'local') => {
    logger.info(`[USER_REGISTRATION] New user registered via ${method}`, {
      userId,
      email,
      method,
      category: 'user_registration'
    });
  },
  
  login: (userId, email, method = 'local') => {
    logger.info(`[USER_LOGIN] User logged in via ${method}`, {
      userId,
      email,
      method,
      category: 'user_auth'
    });
  },
  
  booking: (userId, vendorId, bookingId, action) => {
    logger.info(`[USER_BOOKING] ${action}`, {
      userId,
      vendorId,
      bookingId,
      action,
      category: 'user_booking'
    });
  }
};

// Admin-specific logging methods
logger.admin = {
  action: (adminEmail, action, target, details) => {
    logger.info(`[ADMIN_ACTION] ${action}`, {
      adminEmail,
      action,
      target,
      details,
      category: 'admin_action'
    });
  },
  
  login: (adminEmail) => {
    logger.info(`[ADMIN_LOGIN] Admin logged in`, {
      adminEmail,
      category: 'admin_auth'
    });
  }
};

// Security-specific logging methods
logger.security = {
  failedLogin: (email, ip, userAgent, attempts = 1) => {
    logger.warn(`[SECURITY] Failed login attempt`, {
      email,
      ip,
      userAgent,
      attempts,
      category: 'security'
    });
  },
  
  accountLocked: (email, ip, reason) => {
    logger.warn(`[SECURITY] Account locked`, {
      email,
      ip,
      reason,
      category: 'security'
    });
  },
  
  suspiciousActivity: (description, ip, userAgent, details) => {
    logger.warn(`[SECURITY] Suspicious activity: ${description}`, {
      ip,
      userAgent,
      details,
      category: 'security'
    });
  },
  
  unauthorized: (ip, userAgent, endpoint, reason) => {
    logger.warn(`[SECURITY] Unauthorized access attempt`, {
      ip,
      userAgent,
      endpoint,
      reason,
      category: 'security'
    });
  }
};

// Performance logging methods
logger.performance = {
  query: (operation, duration, collection, query) => {
    if (duration > 1000) { // Log slow queries (>1 second)
      logger.warn(`[PERFORMANCE] Slow query detected`, {
        operation,
        duration: `${duration}ms`,
        collection,
        query: JSON.stringify(query),
        category: 'performance'
      });
    }
  },
  
  api: (method, endpoint, duration, statusCode) => {
    const level = duration > 5000 ? 'warn' : duration > 2000 ? 'info' : 'debug';
    logger[level](`[PERFORMANCE] API ${method} ${endpoint}`, {
      method,
      endpoint,
      duration: `${duration}ms`,
      statusCode,
      category: 'api_performance'
    });
  }
};

// Business logic logging methods
logger.business = {
  payment: (amount, vendorId, customerId, status, paymentId) => {
    logger.info(`[BUSINESS] Payment ${status}`, {
      amount,
      vendorId,
      customerId,
      paymentId,
      status,
      category: 'payment'
    });
  },
  
  booking: (bookingId, vendorId, customerId, eventType, amount, status) => {
    logger.info(`[BUSINESS] Booking ${status}`, {
      bookingId,
      vendorId,
      customerId,
      eventType,
      amount,
      status,
      category: 'booking'
    });
  },
  
  recommendation: (customerId, vendorIds, algorithm, score) => {
    logger.debug(`[BUSINESS] Recommendation generated`, {
      customerId,
      vendorCount: vendorIds.length,
      topVendorIds: vendorIds.slice(0, 3),
      algorithm,
      score,
      category: 'recommendation'
    });
  }
};

// ==================== REQUEST LOGGING MIDDLEWARE ====================

// Morgan-style request logging middleware
logger.requestMiddleware = (req, res, next) => {
  const start = Date.now();
  
  // Log request start
  logger.http(`[REQUEST] ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress,
    userAgent: req.get('User-Agent'),
    category: 'http_request'
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(chunk, encoding) {
    const duration = Date.now() - start;
    
    // Log response
    logger.http(`[RESPONSE] ${req.method} ${req.originalUrl} - ${res.statusCode}`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.connection.remoteAddress,
      category: 'http_response'
    });

    // Log performance if slow
    logger.performance.api(req.method, req.originalUrl, duration, res.statusCode);
    
    originalEnd.call(this, chunk, encoding);
  };

  next();
};

// ==================== ERROR LOGGING ====================

// Enhanced error logging with context
logger.logError = (error, context = {}) => {
  const errorInfo = {
    message: error.message,
    stack: error.stack,
    name: error.name,
    code: error.code,
    ...context,
    category: 'error'
  };

  logger.error(`[ERROR] ${error.message}`, errorInfo);
};

// Database error logging
logger.dbError = (operation, error, query = {}) => {
  logger.error(`[DATABASE] ${operation} failed`, {
    operation,
    error: error.message,
    stack: error.stack,
    query: JSON.stringify(query),
    category: 'database_error'
  });
};

// ==================== STARTUP LOGGING ====================

// Log application startup information
logger.startup = () => {
  logger.info('🚀 EVEA Backend Server Starting...', {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    logLevel: logger.level,
    timestamp: new Date().toISOString(),
    category: 'startup'
  });
};

// Log application ready
logger.ready = (port) => {
  logger.info(`✅ EVEA Backend Server Ready on port ${port}`, {
    port,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    category: 'startup'
  });
};

// ==================== CLEANUP AND SHUTDOWN ====================

// Graceful shutdown logging
logger.shutdown = (reason) => {
  logger.info(`🛑 EVEA Backend Server Shutting Down: ${reason}`, {
    reason,
    timestamp: new Date().toISOString(),
    category: 'shutdown'
  });
};

// Clean up resources on exit
process.on('exit', (code) => {
  logger.info(`🔚 Process exiting with code: ${code}`, {
    exitCode: code,
    category: 'shutdown'
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('💥 Uncaught Exception:', {
    error: error.message,
    stack: error.stack,
    category: 'critical_error'
  });
  
  // Give logger time to write before exiting
  setTimeout(() => {
    process.exit(1);
  }, 1000);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('💥 Unhandled Promise Rejection:', {
    reason: reason?.message || reason,
    stack: reason?.stack,
    promise: promise.toString(),
    category: 'critical_error'
  });
});

// ==================== CONFIGURATION VALIDATION ====================

// Validate logging configuration on startup
const validateLogConfig = () => {
  const requiredEnvVars = ['NODE_ENV'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    logger.warn('⚠️ Missing environment variables for logging:', {
      missingVars,
      category: 'config_warning'
    });
  }
  
  // Log current configuration
  logger.info('📋 Logger Configuration:', {
    level: logger.level,
    environment: process.env.NODE_ENV,
    logToFile: process.env.NODE_ENV !== 'test',
    httpLogging: process.env.LOG_HTTP === 'true',
    transports: transports.map(t => t.constructor.name),
    category: 'config'
  });
};

// Run validation
validateLogConfig();

// ==================== EXPORT LOGGER ====================

console.log('✅ Logger initialized successfully');

module.exports = logger;

// ==================== ADDITIONAL UTILITY FUNCTIONS ====================

// Create child logger with context
logger.child = (context) => {
  return {
    error: (message, meta = {}) => logger.error(message, { ...context, ...meta }),
    warn: (message, meta = {}) => logger.warn(message, { ...context, ...meta }),
    info: (message, meta = {}) => logger.info(message, { ...context, ...meta }),
    http: (message, meta = {}) => logger.http(message, { ...context, ...meta }),
    debug: (message, meta = {}) => logger.debug(message, { ...context, ...meta })
  };
};

const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');

// Create logs directory structure
const logsDir = path.join(__dirname, '../../logs');
const dirs = ['error', 'combined', 'debug', 'http', 'vendor', 'user', 'admin'];

dirs.forEach(dir => {
  const dirPath = path.join(logsDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Enhanced logger with daily rotation
const createDailyRotateTransport = (filename, level, maxSize = '20m', maxFiles = '14d') => {
  return new DailyRotateFile({
    filename: path.join(logsDir, filename),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: maxSize,
    maxFiles: maxFiles,
    level: level,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    )
  });
};

// Update your logger configuration with these transports
const rotatingTransports = [
  // Console (always active)
  new winston.transports.Console({
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.colorize({ all: true }),
      winston.format.errors({ stack: true }),
      winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level}]: ${message}`;
        if (stack) log += `\n${stack}`;
        if (Object.keys(meta).length > 0) log += `\n${JSON.stringify(meta, null, 2)}`;
        return log;
      })
    )
  })
];

// Add rotating file transports only for non-test environments
if (process.env.NODE_ENV !== 'test') {
  rotatingTransports.push(
    // Error logs with daily rotation
    createDailyRotateTransport('error/error-%DATE%.log', 'error'),
    
    // Combined logs
    createDailyRotateTransport('combined/combined-%DATE%.log', 'info'),
    
    // Vendor-specific logs
    createDailyRotateTransport('vendor/vendor-%DATE%.log', 'info'),
    
    // User-specific logs
    createDailyRotateTransport('user/user-%DATE%.log', 'info'),
    
    // Admin action logs
    createDailyRotateTransport('admin/admin-%DATE%.log', 'info'),
    
    // HTTP request logs (if enabled)
    ...(process.env.LOG_HTTP === 'true' ? [
      createDailyRotateTransport('http/http-%DATE%.log', 'http')
    ] : []),
    
    // Debug logs (development only)
    ...(process.env.NODE_ENV === 'development' ? [
      createDailyRotateTransport('debug/debug-%DATE%.log', 'debug')
    ] : [])
  );
}
// Log aggregator for metrics (optional integration with monitoring services)
logger.metrics = {
  increment: (metric, value = 1, tags = {}) => {
    logger.debug(`[METRICS] ${metric} incremented by ${value}`, {
      metric,
      value,
      tags,
      category: 'metrics'
    });
    
    // Here you can integrate with monitoring services like:
    // - DataDog
    // - New Relic
    // - Prometheus
    // - Custom metrics endpoint
  },
  
  timing: (metric, duration, tags = {}) => {
    logger.debug(`[METRICS] ${metric} took ${duration}ms`, {
      metric,
      duration,
      tags,
      category: 'metrics'
    });
  },
  
  gauge: (metric, value, tags = {}) => {
    logger.debug(`[METRICS] ${metric} set to ${value}`, {
      metric,
      value,
      tags,
      category: 'metrics'
    });
  }
};

// ==================== USAGE EXAMPLES ====================
/*

// Basic logging
logger.info('Server started successfully');
logger.error('Database connection failed', { error: err.message });

// Vendor-specific logging
logger.vendor.registration('VEN123', 'vendor@example.com', 1, 'Step 1 completed');
logger.vendor.login('VEN123', 'vendor@example.com', 'google');
logger.vendor.approval('VEN123', 'vendor@example.com', 'approved', 'admin@evea.com');

// User-specific logging
logger.user.registration('USER123', 'user@example.com');
logger.user.booking('USER123', 'VEN123', 'BOOK123', 'created');

// Security logging
logger.security.failedLogin('user@example.com', '192.168.1.1', 'Chrome/91.0', 3);
logger.security.accountLocked('user@example.com', '192.168.1.1', 'too_many_attempts');

// Performance logging
logger.performance.query('findVendors', 1500, 'vendors', { category: 'photography' });

// Business logging
logger.business.payment(50000, 'VEN123', 'USER123', 'completed', 'PAY123');
logger.business.booking('BOOK123', 'VEN123', 'USER123', 'wedding', 50000, 'confirmed');

// Error logging with context
logger.logError(new Error('Payment processing failed'), {
  vendorId: 'VEN123',
  bookingId: 'BOOK123',
  paymentMethod: 'card'
});

// Child logger with context
const vendorLogger = logger.child({ vendorId: 'VEN123', email: 'vendor@example.com' });
vendorLogger.info('Profile updated');
vendorLogger.error('Service creation failed');

// Metrics (for monitoring integration)
logger.metrics.increment('vendor.registration.completed');
logger.metrics.timing('api.vendor.profile.update', 250);
logger.metrics.gauge('active.vendors.count', 150);

*/
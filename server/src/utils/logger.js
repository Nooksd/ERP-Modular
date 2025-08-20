// src/utils/structuredLogger.js
import winston from "winston";
import geoip from "geoip-lite";
import { networkInterfaces } from "os";

// Obter IP da máquina
const getLocalIp = () => {
  const interfaces = networkInterfaces();
  for (const interfaceName of Object.keys(interfaces)) {
    for (const iface of interfaces[interfaceName]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "127.0.0.1";
};

// Formato personalizado para logs estruturados
const structuredJsonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format((info) => {
    // Adicionar metadados comuns a todos os logs
    info.service = "backend-app";
    info.environment = process.env.NODE_ENV || "development";
    info.host = getLocalIp();
    info.pid = process.pid;
    return info;
  })(),
  winston.format.json()
);

// Formato para desenvolvimento legível
const devFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let log = `${timestamp} [${level}]: ${message}`;

    if (Object.keys(meta).length > 0) {
      // Remover campos muito grandes para exibição no console
      const { stack, ...filteredMeta } = meta;
      if (Object.keys(filteredMeta).length > 0) {
        log += ` ${JSON.stringify(filteredMeta, null, 2)}`;
      }
      if (stack) {
        log += `\n${stack}`;
      }
    }

    return log;
  })
);

// Criar o logger principal
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  defaultMeta: {
    service: "backend-app",
    environment: process.env.NODE_ENV || "development",
    host: getLocalIp(),
    pid: process.pid,
  },
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production"
          ? structuredJsonFormat
          : devFormat,
    }),
  ],
  exceptionHandlers: [
    new winston.transports.Console({
      format: structuredJsonFormat,
    }),
  ],
  rejectionHandlers: [
    new winston.transports.Console({
      format: structuredJsonFormat,
    }),
  ],
});

// Middleware para logging de requests com metadados enriquecidos
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Extrair informações geográficas do IP
  const clientIp =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  let geo = null;
  if (clientIp) {
    geo = geoip.lookup(clientIp.replace(/^.*:/, "")); // Remover prefixo IPv6 se necessário
  }

  res.on("finish", () => {
    const duration = Date.now() - start;

    const logData = {
      type: "request",
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      user: req.user ? req.user.user._id : "anonymous",
      clientIp,
      userAgent: req.get("User-Agent"),
      referer: req.get("Referer"),
      contentLength: res.get("Content-Length"),
      geo: geo
        ? {
            country: geo.country,
            region: geo.region,
            city: geo.city,
            timezone: geo.timezone,
            ll: geo.ll,
          }
        : null,
    };

    // Log diferente baseado no status code
    if (res.statusCode >= 500) {
      logger.error("HTTP Server Error", logData);
    } else if (res.statusCode >= 400) {
      logger.warn("HTTP Client Error", logData);
    } else {
      logger.info("HTTP Request", logData);
    }
  });

  next();
};

// Middleware para logging de erros
export const errorLogger = (err, req, res, next) => {
  const clientIp =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    (req.connection.socket ? req.connection.socket.remoteAddress : null);

  let geo = null;
  if (clientIp) {
    geo = geoip.lookup(clientIp.replace(/^.*:/, ""));
  }

  logger.error("Unhandled Error", {
    type: "error",
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    user: req.user ? req.user.user._id : "anonymous",
    clientIp,
    userAgent: req.get("User-Agent"),
    geo: geo
      ? {
          country: geo.country,
          region: geo.region,
          city: geo.city,
        }
      : null,
  });

  next(err);
};

// Função para auditoria de segurança
export const securityLogger = (event, metadata = {}) => {
  logger.warn("Security Event", {
    type: "security",
    event,
    ...metadata,
  });
};

// Função para auditoria de negócio
export const auditLogger = (action, resource, metadata = {}) => {
  logger.info("Audit Event", {
    type: "audit",
    action,
    resource,
    ...metadata,
  });
};

export default logger;

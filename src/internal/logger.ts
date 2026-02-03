/**
 * Internal logger utility for the FHEVM SDK.
 *
 * Provides debug logging that is disabled by default in production.
 * Users can enable debug mode via environment variable or programmatically.
 *
 * @internal
 */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LoggerConfig {
  /** Enable debug logging. Default: false in production, true in development */
  enabled: boolean;
  /** Prefix for all log messages */
  prefix: string;
  /** Minimum log level to display */
  level: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

/**
 * Check if we're in a development environment.
 */
function isDevEnvironment(): boolean {
  if (typeof process !== "undefined" && process.env) {
    return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
  }
  return false;
}

/**
 * Check if debug mode is explicitly enabled via environment variable.
 */
function isDebugEnabled(): boolean {
  if (typeof process !== "undefined" && process.env) {
    return process.env.FHEVM_DEBUG === "true" || process.env.FHEVM_DEBUG === "1";
  }
  return false;
}

// Global logger configuration
let config: LoggerConfig = {
  enabled: isDevEnvironment() || isDebugEnabled(),
  prefix: "[fhevm]",
  level: "debug",
};

/**
 * Configure the logger.
 *
 * @example
 * ```ts
 * import { configureLogger } from '@zama-fhe/react-sdk';
 *
 * // Enable debug logging in production
 * configureLogger({ enabled: true });
 *
 * // Change prefix
 * configureLogger({ prefix: '[my-app]' });
 * ```
 */
export function configureLogger(options: Partial<LoggerConfig>): void {
  config = { ...config, ...options };
}

/**
 * Get the current logger configuration.
 */
export function getLoggerConfig(): Readonly<LoggerConfig> {
  return { ...config };
}

/**
 * Internal function to check if a log level should be displayed.
 */
function shouldLog(level: LogLevel): boolean {
  if (!config.enabled && level !== "error") {
    return false;
  }
  return LOG_LEVELS[level] >= LOG_LEVELS[config.level];
}

/**
 * Format a log message with the prefix.
 */
function formatMessage(component: string, message: string): string {
  return `${config.prefix}${component ? ` ${component}` : ""} ${message}`;
}

/**
 * Logger instance for SDK internal use.
 *
 * - `debug`: Detailed debugging information (disabled in production by default)
 * - `info`: General information about SDK operations
 * - `warn`: Warning messages (always shown)
 * - `error`: Error messages (always shown)
 */
export const logger = {
  /**
   * Log debug information.
   * Only shown when debug mode is enabled (development or FHEVM_DEBUG=true).
   */
  debug(component: string, message: string, ...args: unknown[]): void {
    if (shouldLog("debug")) {
      console.log(formatMessage(component, message), ...args);
    }
  },

  /**
   * Log general information.
   * Only shown when debug mode is enabled.
   */
  info(component: string, message: string, ...args: unknown[]): void {
    if (shouldLog("info")) {
      console.log(formatMessage(component, message), ...args);
    }
  },

  /**
   * Log a warning.
   * Always shown regardless of debug mode.
   */
  warn(component: string, message: string, ...args: unknown[]): void {
    if (shouldLog("warn")) {
      console.warn(formatMessage(component, message), ...args);
    }
  },

  /**
   * Log an error.
   * Always shown regardless of debug mode.
   */
  error(component: string, message: string, ...args: unknown[]): void {
    if (shouldLog("error")) {
      console.error(formatMessage(component, message), ...args);
    }
  },
};

export default logger;

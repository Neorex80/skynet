/**
 * Application logging configuration
 * 
 * This module provides a centralized logging mechanism with different log levels,
 * formatting options, and transport configuration (console, remote logging, etc.)
 */

// Log levels in order of severity
export enum LogLevel {
  TRACE = 0,
  DEBUG = 1,
  INFO = 2,
  WARN = 3,
  ERROR = 4,
  FATAL = 5,
  SILENT = 6
}

// Log level names to simplify usage
export const LOG_LEVEL_NAMES: Record<LogLevel, string> = {
  [LogLevel.TRACE]: 'TRACE',
  [LogLevel.DEBUG]: 'DEBUG',
  [LogLevel.INFO]: 'INFO',
  [LogLevel.WARN]: 'WARN',
  [LogLevel.ERROR]: 'ERROR',
  [LogLevel.FATAL]: 'FATAL',
  [LogLevel.SILENT]: 'SILENT'
};

// Configuration interface
export interface LoggerConfig {
  level: LogLevel;
  enabled: boolean;
  prefix?: string;
  enableConsole: boolean;
  enableRemote: boolean;
  remoteUrl?: string;
  formatTimestamp: boolean;
}

// Parse log level from string
export const parseLogLevel = (level: string): LogLevel => {
  const upperLevel = level.toUpperCase();
  const matchingLevel = Object.entries(LOG_LEVEL_NAMES).find(
    ([, name]) => name === upperLevel
  );
  
  return matchingLevel 
    ? parseInt(matchingLevel[0], 10)
    : LogLevel.INFO; // Default to INFO
};

// Default configuration - read from environment variables
export const DEFAULT_CONFIG: LoggerConfig = {
  level: parseLogLevel(import.meta.env.VITE_LOG_LEVEL || 'INFO'),
  enabled: import.meta.env.VITE_ENABLE_LOGGING !== 'false', // Default to true
  prefix: import.meta.env.VITE_LOG_PREFIX || '',
  enableConsole: import.meta.env.VITE_LOG_CONSOLE !== 'false', // Default to true
  enableRemote: import.meta.env.VITE_LOG_REMOTE === 'true', // Default to false
  remoteUrl: import.meta.env.VITE_LOG_REMOTE_URL,
  formatTimestamp: import.meta.env.VITE_LOG_TIMESTAMP !== 'false', // Default to true
};

/**
 * Logger class for application-wide logging
 */
export class Logger {
  private config: LoggerConfig;
  private logBuffer: Array<{level: LogLevel, message: string, data?: any}> = [];
  private isBuffering = false;
  
  /**
   * Create a new logger
   * @param config Logger configuration
   */
  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }
  
  /**
   * Start buffering logs (useful when waiting for remote logging to be ready)
   */
  startBuffering() {
    this.isBuffering = true;
  }
  
  /**
   * Flush buffered logs to all transports
   */
  flushBuffer() {
    if (this.logBuffer.length === 0) return;
    
    const bufferedLogs = [...this.logBuffer];
    this.logBuffer = [];
    
    bufferedLogs.forEach(log => {
      this.logToTransports(log.level, log.message, log.data);
    });
    
    this.isBuffering = false;
  }
  
  /**
   * Update logger configuration
   */
  updateConfig(config: Partial<LoggerConfig>) {
    this.config = { ...this.config, ...config };
  }
  
  /**
   * Check if a log level should be logged based on configuration
   */
  shouldLog(level: LogLevel): boolean {
    return this.config.enabled && level >= this.config.level;
  }
  
  /**
   * Format a log message
   */
  formatMessage(level: LogLevel, message: string): string {
    const parts: string[] = [];
    
    // Add timestamp
    if (this.config.formatTimestamp) {
      parts.push(`[${new Date().toISOString()}]`);
    }
    
    // Add log level
    parts.push(`[${LOG_LEVEL_NAMES[level]}]`);
    
    // Add prefix if configured
    if (this.config.prefix) {
      parts.push(`[${this.config.prefix}]`);
    }
    
    // Add the actual message
    parts.push(message);
    
    return parts.join(' ');
  }
  
  /**
   * Send a log to all configured transports
   */
  private logToTransports(level: LogLevel, message: string, data?: any) {
    const formattedMessage = this.formatMessage(level, message);
    
    // Console transport
    if (this.config.enableConsole) {
      switch(level) {
        case LogLevel.TRACE:
        case LogLevel.DEBUG:
          console.debug(formattedMessage, data || '');
          break;
        case LogLevel.INFO:
          console.info(formattedMessage, data || '');
          break;
        case LogLevel.WARN:
          console.warn(formattedMessage, data || '');
          break;
        case LogLevel.ERROR:
        case LogLevel.FATAL:
          console.error(formattedMessage, data || '');
          break;
        // SILENT level is not logged
      }
    }
    
    // Remote transport
    if (this.config.enableRemote && this.config.remoteUrl) {
      this.sendToRemote(level, message, data);
    }
  }
  
  /**
   * Send a log to remote logging service
   */
  private async sendToRemote(level: LogLevel, message: string, data?: any) {
    if (!this.config.remoteUrl) return;
    
    try {
      // Very basic implementation - in a real application,
      // you might want to use a more sophisticated approach
      await fetch(this.config.remoteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          level: LOG_LEVEL_NAMES[level],
          message,
          data,
          timestamp: new Date().toISOString(),
          application: import.meta.env.VITE_APP_NAME,
          environment: import.meta.env.MODE,
        }),
      });
    } catch (error) {
      // If remote logging fails, log to console but avoid infinite recursion
      if (this.config.enableConsole) {
        console.error('Remote logging failed:', error);
      }
    }
  }
  
  /**
   * Log at a specific level
   */
  log(level: LogLevel, message: string, data?: any) {
    if (!this.shouldLog(level)) return;
    
    if (this.isBuffering) {
      this.logBuffer.push({ level, message, data });
      return;
    }
    
    this.logToTransports(level, message, data);
  }
  
  // Convenience methods for specific log levels
  
  trace(message: string, data?: any) {
    this.log(LogLevel.TRACE, message, data);
  }
  
  debug(message: string, data?: any) {
    this.log(LogLevel.DEBUG, message, data);
  }
  
  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }
  
  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }
  
  error(message: string, data?: any) {
    this.log(LogLevel.ERROR, message, data);
  }
  
  fatal(message: string, data?: any) {
    this.log(LogLevel.FATAL, message, data);
  }
}

// Create and export a default logger instance
export const logger = new Logger();

export default logger;
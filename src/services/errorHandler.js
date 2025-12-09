/**
 * Centralized Error Handler
 * Provides unified error handling and logging across the application
 */

class ErrorHandler {
  constructor() {
    this.errorListeners = [];
    this.logLevel = process.env.NODE_ENV === 'production' ? 'error' : 'debug';
  }

  /**
   * Log levels: debug, info, warn, error
   */
  setLogLevel(level) {
    this.logLevel = level;
  }

  /**
   * Add error listener callback
   * @param {Function} callback - Callback function to receive errors
   */
  addListener(callback) {
    this.errorListeners.push(callback);
  }

  /**
   * Remove error listener callback
   * @param {Function} callback - Callback to remove
   */
  removeListener(callback) {
    this.errorListeners = this.errorListeners.filter(cb => cb !== callback);
  }

  /**
   * Notify all listeners of an error
   * @param {Error} error - The error object
   * @param {Object} context - Additional context information
   */
  notifyListeners(error, context = {}) {
    this.errorListeners.forEach(callback => {
      try {
        callback(error, context);
      } catch (err) {
        console.error('Error in error listener:', err);
      }
    });
  }

  /**
   * Handle and log an error
   * @param {Error|string} error - The error to handle
   * @param {Object} context - Additional context information
   * @param {string} level - Log level (debug, info, warn, error)
   */
  handle(error, context = {}, level = 'error') {
    const errorObj = error instanceof Error ? error : new Error(String(error));
    const timestamp = new Date().toISOString();

    const logData = {
      timestamp,
      level,
      message: errorObj.message,
      stack: errorObj.stack,
      context,
    };

    // Console logging based on level
    if (this.shouldLog(level)) {
      const logMethod = console[level] || console.error;
      logMethod(`[${timestamp}] [${level.toUpperCase()}]`, errorObj.message, context);

      if (errorObj.stack && level === 'error') {
        console.error(errorObj.stack);
      }
    }

    // Notify listeners
    if (level === 'error' || level === 'warn') {
      this.notifyListeners(errorObj, context);
    }

    // In development, you could send to external logging service
    if (process.env.NODE_ENV === 'production') {
      this.sendToLoggingService(logData);
    }

    return errorObj;
  }

  /**
   * Determine if a log level should be printed based on current log level setting
   * @param {string} level - The log level to check
   * @returns {boolean}
   */
  shouldLog(level) {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    const currentLevel = levels[this.logLevel] || 0;
    const messageLevel = levels[level] || 0;
    return messageLevel >= currentLevel;
  }

  /**
   * Send error data to external logging service (stub for now)
   * @param {Object} logData - The log data to send
   */
  sendToLoggingService(logData) {
    // TODO: Implement integration with external logging service
    // (e.g., Sentry, LogRocket, etc.)
  }

  /**
   * Convenience methods for different log levels
   */
  debug(message, context = {}) {
    return this.handle(message, context, 'debug');
  }

  info(message, context = {}) {
    return this.handle(message, context, 'info');
  }

  warn(message, context = {}) {
    return this.handle(message, context, 'warn');
  }

  error(message, context = {}) {
    return this.handle(message, context, 'error');
  }

  /**
   * Wrap an async function with error handling
   * @param {Function} fn - The async function to wrap
   * @param {Object} context - Additional context for errors
   * @returns {Function} Wrapped function
   */
  wrapAsync(fn, context = {}) {
    return async (...args) => {
      try {
        return await fn(...args);
      } catch (error) {
        this.handle(error, { ...context, args }, 'error');
        throw error;
      }
    };
  }

  /**
   * Wrap a sync function with error handling
   * @param {Function} fn - The function to wrap
   * @param {Object} context - Additional context for errors
   * @returns {Function} Wrapped function
   */
  wrapSync(fn, context = {}) {
    return (...args) => {
      try {
        return fn(...args);
      } catch (error) {
        this.handle(error, { ...context, args }, 'error');
        throw error;
      }
    };
  }
}

// Export singleton instance
const errorHandler = new ErrorHandler();

export default errorHandler;
export { ErrorHandler };

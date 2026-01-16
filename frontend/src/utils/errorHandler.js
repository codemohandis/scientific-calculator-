/**
 * Error handling and user feedback utilities.
 * Provides user-friendly error messages and logging.
 */

import { announceToScreenReader, createAlert } from './accessibility.js';

// Error codes to user-friendly messages
const ERROR_MESSAGES = {
  CONVERSION_FAILED: 'Could not perform the conversion. Please check your units.',
  INVALID_UNIT: 'One or more units are not recognized. Please select valid units.',
  INCOMPATIBLE_UNITS: 'These units cannot be converted to each other. (e.g., kilometers to kilograms)',
  INVALID_EXPRESSION: 'The expression you entered is not valid. Please check your syntax.',
  DIVISION_BY_ZERO: 'Cannot divide by zero.',
  DOMAIN_ERROR: 'The value is outside the valid domain for this operation.',
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  TIMEOUT: 'Request timed out. Please try again.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
};

/**
 * Formats an error for display to the user.
 *
 * @param {Error|string|Object} error - The error to format
 * @returns {Object} - Formatted error with message and type
 */
export function formatError(error) {
  let message = ERROR_MESSAGES.UNKNOWN_ERROR;
  let type = 'error';
  let details = {};

  if (typeof error === 'string') {
    message = error;
  } else if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('conversion')) {
      message = ERROR_MESSAGES.CONVERSION_FAILED;
      type = 'conversion_error';
    } else if (error.message.includes('unit')) {
      message = ERROR_MESSAGES.INVALID_UNIT;
      type = 'unit_error';
    } else if (error.message.includes('syntax')) {
      message = ERROR_MESSAGES.INVALID_EXPRESSION;
      type = 'syntax_error';
    } else {
      message = error.message;
    }
    details.originalError = error;
  } else if (typeof error === 'object' && error !== null) {
    // Handle response objects
    if (error.response?.status === 400) {
      message = error.response.data?.error || ERROR_MESSAGES.INVALID_EXPRESSION;
      type = 'validation_error';
    } else if (error.response?.status === 404) {
      message = 'Resource not found.';
      type = 'not_found';
    } else if (error.response?.status >= 500) {
      message = ERROR_MESSAGES.SERVER_ERROR;
      type = 'server_error';
    } else if (error.code === 'ECONNABORTED') {
      message = ERROR_MESSAGES.TIMEOUT;
      type = 'timeout';
    } else if (error.message === 'Network Error') {
      message = ERROR_MESSAGES.NETWORK_ERROR;
      type = 'network_error';
    } else {
      message = error.error || ERROR_MESSAGES.UNKNOWN_ERROR;
    }
    details = { ...error, originalError: error };
  }

  return {
    message,
    type,
    details,
  };
}

/**
 * Displays an error message to the user and logs it.
 * Announces to screen readers and shows visual alert.
 *
 * @param {Error|string|Object} error - The error to display
 * @param {HTMLElement} container - Container to display error in
 * @param {Object} options - Additional options
 * @returns {HTMLElement} - The error element that was created
 */
export function displayError(error, container, options = {}) {
  const formatted = formatError(error);
  const { message, type, details } = formatted;

  // Log error for debugging
  console.error(`[${type}]`, message, details);

  // Announce to screen readers
  announceToScreenReader(`Error: ${message}`, 'assertive');

  // Create visual error element
  const errorElement = document.createElement('div');
  errorElement.className = `error-message error-${type}`;
  errorElement.setAttribute('role', 'alert');
  errorElement.setAttribute('aria-live', 'assertive');

  const titleElement = document.createElement('strong');
  titleElement.textContent = options.title || 'Error';

  const messageElement = document.createElement('p');
  messageElement.textContent = message;

  errorElement.appendChild(titleElement);
  errorElement.appendChild(messageElement);

  // Add to container
  if (container) {
    container.insertBefore(errorElement, container.firstChild);

    // Auto-remove after delay if specified
    if (options.autoRemove) {
      setTimeout(
        () => errorElement.remove(),
        options.autoRemoveDelay || 5000
      );
    }
  }

  return errorElement;
}

/**
 * Clears all error messages from a container.
 *
 * @param {HTMLElement} container - Container to clear errors from
 */
export function clearErrors(container) {
  if (!container) return;

  const errors = container.querySelectorAll('[role="alert"]');
  errors.forEach((error) => error.remove());
}

/**
 * Validates input and shows user-friendly error messages.
 *
 * @param {Object} input - Input to validate
 * @param {string} input.value - The value to validate
 * @param {string} input.type - Type of validation ('unit', 'expression', 'number')
 * @returns {Object} - Validation result { valid: boolean, error?: string }
 */
export function validateInput(input) {
  const { value, type } = input;

  if (!value || value.trim() === '') {
    return { valid: false, error: 'Please enter a value.' };
  }

  switch (type) {
    case 'number': {
      const num = parseFloat(value);
      if (isNaN(num)) {
        return { valid: false, error: 'Please enter a valid number.' };
      }
      return { valid: true };
    }

    case 'unit': {
      // Basic unit validation - can be enhanced
      if (value.length < 1 || value.length > 20) {
        return { valid: false, error: 'Unit name must be between 1 and 20 characters.' };
      }
      if (!/^[a-zA-Z0-9/_-]+$/.test(value)) {
        return { valid: false, error: 'Unit contains invalid characters.' };
      }
      return { valid: true };
    }

    case 'expression': {
      // Check for unbalanced parentheses
      const openParens = (value.match(/\(/g) || []).length;
      const closeParens = (value.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        return { valid: false, error: 'Unbalanced parentheses in expression.' };
      }

      // Check for invalid characters
      if (!/^[0-9+\-*/(). a-zA-Z]*$/.test(value)) {
        return { valid: false, error: 'Expression contains invalid characters.' };
      }

      return { valid: true };
    }

    default:
      return { valid: true };
  }
}

/**
 * Retry logic for failed operations.
 *
 * @param {function} operation - Async operation to retry
 * @param {Object} options - Retry options
 * @param {number} options.maxAttempts - Maximum number of attempts (default: 3)
 * @param {number} options.delay - Delay between attempts in ms (default: 1000)
 * @param {function} options.onRetry - Callback when retrying
 * @returns {Promise} - Result of operation
 *
 * Example:
 * ```
 * try {
 *   const result = await retryOperation(() => convert(value, from, to), {
 *     maxAttempts: 3,
 *     delay: 500,
 *   });
 * } catch (error) {
 *   // All retries failed
 * }
 * ```
 */
export async function retryOperation(operation, options = {}) {
  const {
    maxAttempts = 3,
    delay = 1000,
    onRetry = null,
  } = options;

  let lastError;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;

      if (attempt < maxAttempts) {
        if (onRetry) {
          onRetry(attempt, error);
        }
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}

/**
 * Creates a user-friendly error message for specific error codes.
 *
 * @param {string} code - Error code
 * @param {Object} context - Additional context for the error
 * @returns {string} - User-friendly message
 */
export function getUserFriendlyMessage(code, context = {}) {
  const messages = {
    CONVERSION_FAILED: `Could not convert ${context.from} to ${context.to}. Please try again.`,
    INVALID_UNIT: `"${context.unit}" is not a recognized unit. Please check and try again.`,
    INCOMPATIBLE_UNITS: `Cannot convert from ${context.from} to ${context.to} - these are different types of measurements.`,
    INVALID_EXPRESSION: 'The expression you entered could not be evaluated. Please check the syntax.',
    DIVISION_BY_ZERO: 'Cannot divide by zero. Please modify your expression.',
    DOMAIN_ERROR: 'The value is outside the valid range for this operation.',
    NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
    SERVER_ERROR: 'The server encountered an error. Please try again later.',
  };

  return messages[code] || ERROR_MESSAGES.UNKNOWN_ERROR;
}

/**
 * Logs an error with structured data for debugging.
 *
 * @param {Error} error - The error to log
 * @param {Object} context - Additional context
 */
export function logError(error, context = {}) {
  const errorLog = {
    timestamp: new Date().toISOString(),
    message: error.message,
    stack: error.stack,
    context,
  };

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.error('Error Log:', errorLog);
  }

  // Could send to error tracking service here
  // e.g., Sentry, LogRocket, etc.
}

export default {
  formatError,
  displayError,
  clearErrors,
  validateInput,
  retryOperation,
  getUserFriendlyMessage,
  logError,
  ERROR_MESSAGES,
};

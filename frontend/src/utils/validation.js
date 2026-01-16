/**
 * Form validation utilities for calculator inputs.
 * Handles input sanitization, expression validation, and user feedback.
 */

/**
 * Sanitizes user input to prevent injection attacks.
 * Removes potentially dangerous characters and scripts.
 *
 * @param {string} input - Raw user input
 * @returns {string} - Sanitized input
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return '';
  }

  // Remove null bytes
  let sanitized = input.replace(/\0/g, '');

  // Remove script tags and event handlers
  sanitized = sanitized.replace(/<script[^>]*>.*?<\/script>/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*"[^"]*"/gi, '');
  sanitized = sanitized.replace(/on\w+\s*=\s*'[^']*'/gi, '');

  return sanitized.trim();
}

/**
 * Validates an expression for proper syntax before sending to backend.
 *
 * @param {string} expression - Expression to validate
 * @returns {Object} - Validation result { valid: boolean, errors: string[] }
 */
export function validateExpression(expression) {
  const errors = [];

  if (!expression || expression.trim() === '') {
    errors.push('Expression cannot be empty');
    return { valid: false, errors };
  }

  // Check length
  if (expression.length > 1000) {
    errors.push('Expression is too long (maximum 1000 characters)');
  }

  // Check balanced parentheses
  let parenCount = 0;
  for (const char of expression) {
    if (char === '(') parenCount++;
    if (char === ')') parenCount--;
    if (parenCount < 0) {
      errors.push('Unbalanced parentheses: too many closing parentheses');
      break;
    }
  }
  if (parenCount > 0) {
    errors.push('Unbalanced parentheses: too many opening parentheses');
  }

  // Check for invalid characters
  const validChars = /^[0-9+\-*/().pi \t\n]*$/i;
  if (!validChars.test(expression)) {
    // Check for common function names
    const withFunctions = expression.replace(/\b(sin|cos|tan|log|ln|sqrt|exp|mean|median|stdev|asin|acos|atan)\b/gi, '');
    if (!/^[0-9+\-*/().pie \t\n]*$/i.test(withFunctions)) {
      errors.push('Expression contains invalid characters or unknown functions');
    }
  }

  // Check for consecutive operators
  if (/[+\-*/]{2,}/.test(expression)) {
    errors.push('Expression has consecutive operators (e.g., "++", "**")');
  }

  // Check for operators at start/end
  if (/^[+*/%]/.test(expression.trim())) {
    errors.push('Expression cannot start with an operator');
  }
  if (/[+\-*/%]$/.test(expression.trim())) {
    errors.push('Expression cannot end with an operator');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a unit identifier.
 *
 * @param {string} unit - Unit to validate
 * @returns {Object} - Validation result { valid: boolean, error?: string }
 */
export function validateUnit(unit) {
  if (!unit || unit.trim() === '') {
    return { valid: false, error: 'Unit cannot be empty' };
  }

  // Unit must be 1-50 characters
  if (unit.length > 50) {
    return { valid: false, error: 'Unit is too long' };
  }

  // Unit should be alphanumeric with allowed symbols (_, /, -)
  if (!/^[a-zA-Z0-9_/\-^2^3]*$/.test(unit)) {
    return { valid: false, error: 'Unit contains invalid characters' };
  }

  return { valid: true };
}

/**
 * Validates a numeric value.
 *
 * @param {string|number} value - Value to validate
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum allowed value
 * @param {number} options.max - Maximum allowed value
 * @param {boolean} options.allowNegative - Whether negative values are allowed
 * @returns {Object} - Validation result { valid: boolean, error?: string }
 */
export function validateNumber(value, options = {}) {
  const { min, max, allowNegative = true } = options;

  if (value === '' || value === null || value === undefined) {
    return { valid: false, error: 'Value cannot be empty' };
  }

  const num = parseFloat(value);

  if (isNaN(num)) {
    return { valid: false, error: 'Value must be a valid number' };
  }

  if (!allowNegative && num < 0) {
    return { valid: false, error: 'Value cannot be negative' };
  }

  if (min !== undefined && num < min) {
    return { valid: false, error: `Value must be at least ${min}` };
  }

  if (max !== undefined && num > max) {
    return { valid: false, error: `Value cannot exceed ${max}` };
  }

  return { valid: true };
}

/**
 * Escapes special HTML characters to prevent XSS.
 *
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
export function escapeHTML(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };

  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Formats a number for display with specified precision.
 *
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places (default: 5)
 * @param {boolean} removeTrailing - Remove trailing zeros (default: true)
 * @returns {string} - Formatted number
 */
export function formatNumber(value, decimals = 5, removeTrailing = true) {
  if (!isFinite(value)) {
    return 'Invalid number';
  }

  // Handle very small or very large numbers
  if (Math.abs(value) < 0.00001 || Math.abs(value) > 1000000) {
    return value.toExponential(decimals);
  }

  let formatted = value.toFixed(decimals);

  if (removeTrailing) {
    // Remove trailing zeros
    formatted = formatted.replace(/\.?0+$/, '');
  }

  return formatted;
}

/**
 * Validates a form with multiple fields.
 *
 * @param {Object} formData - Form data to validate
 * @param {Object} schema - Validation schema
 * @returns {Object} - Validation result { valid: boolean, errors: Object }
 *
 * Example:
 * ```
 * const result = validateForm(
 *   { value: '5', fromUnit: 'km', toUnit: 'miles' },
 *   {
 *     value: { type: 'number', required: true },
 *     fromUnit: { type: 'unit', required: true },
 *     toUnit: { type: 'unit', required: true },
 *   }
 * );
 * ```
 */
export function validateForm(formData, schema) {
  const errors = {};
  let valid = true;

  for (const [field, fieldSchema] of Object.entries(schema)) {
    const value = formData[field];
    const { type, required = false, min, max } = fieldSchema;

    // Check required
    if (required && (!value || value.trim() === '')) {
      errors[field] = `${field} is required`;
      valid = false;
      continue;
    }

    // Skip validation if not required and empty
    if (!required && (!value || value.trim() === '')) {
      continue;
    }

    // Validate based on type
    let result;
    switch (type) {
      case 'number':
        result = validateNumber(value, { min, max });
        break;
      case 'unit':
        result = validateUnit(value);
        break;
      case 'expression':
        result = validateExpression(value);
        if (!result.valid) {
          errors[field] = result.errors[0];
        }
        continue;
      default:
        result = { valid: true };
    }

    if (!result.valid) {
      errors[field] = result.error;
      valid = false;
    }
  }

  return { valid, errors };
}

/**
 * Parses a conversion input like "5 km in miles" or "5 km to miles".
 *
 * @param {string} input - Input to parse
 * @returns {Object} - Parsed values { value: number, fromUnit: string, toUnit: string, error?: string }
 */
export function parseConversionInput(input) {
  const sanitized = sanitizeInput(input);

  // Match patterns like "5 km in miles" or "5 km to miles"
  const pattern = /^([0-9.]+)\s*([a-zA-Z0-9_\-/^2^3]+)\s+(?:in|to)\s+([a-zA-Z0-9_\-/^2^3]+)$/i;
  const match = sanitized.match(pattern);

  if (!match) {
    return {
      value: null,
      fromUnit: null,
      toUnit: null,
      error: 'Invalid format. Use: "value unit in target_unit" (e.g., "5 km in miles")',
    };
  }

  const value = parseFloat(match[1]);
  const fromUnit = match[2];
  const toUnit = match[3];

  if (isNaN(value)) {
    return {
      value: null,
      fromUnit: null,
      toUnit: null,
      error: 'Invalid number format',
    };
  }

  return {
    value,
    fromUnit,
    toUnit,
    error: null,
  };
}

/**
 * Creates a whitelist of allowed characters for a field.
 *
 * @param {string} input - Input to filter
 * @param {string} allowedChars - Regex pattern of allowed characters
 * @returns {string} - Filtered input
 */
export function filterAllowedChars(input, allowedChars = '[0-9.+-/*()]') {
  return input.replace(new RegExp(`[^${allowedChars}]`, 'g'), '');
}

export default {
  sanitizeInput,
  validateExpression,
  validateUnit,
  validateNumber,
  escapeHTML,
  formatNumber,
  validateForm,
  parseConversionInput,
  filterAllowedChars,
};

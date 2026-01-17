/**
 * Calculator API client service.
 * Handles communication with the backend calculator API.
 */

import axios from 'axios';

// Default API base URL
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Converts a value from one unit to another.
 *
 * @param {number} value - The value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {Promise<Object>} - Result with converted value
 * @throws {Error} - If conversion fails
 *
 * Example:
 * ```
 * const result = await convert(5, 'km', 'miles');
 * // { result: 3.10686, from_unit: 'km', to_unit: 'miles', error: null }
 * ```
 */
export async function convert(value, fromUnit, toUnit) {
  try {
    const response = await apiClient.post('/convert', {
      value,
      from_unit: fromUnit,
      to_unit: toUnit,
    });

    return response.data;
  } catch (error) {
    return {
      result: null,
      from_unit: fromUnit,
      to_unit: toUnit,
      error: error.response?.data?.error || 'Conversion failed',
    };
  }
}

/**
 * Evaluates a mathematical expression.
 *
 * @param {string} expression - The expression to evaluate
 * @param {Object} context - Optional variables for the expression
 * @returns {Promise<Object>} - Result with evaluation result
 * @throws {Error} - If evaluation fails
 *
 * Example:
 * ```
 * const result = await evaluateExpression('2 + 3 * 4');
 * // { result: 14, error: null }
 * ```
 */
export async function evaluateExpression(expression, context = null) {
  try {
    const response = await apiClient.post('/evaluate', {
      expression,
      context,
    });

    return response.data;
  } catch (error) {
    return {
      result: null,
      error: error.response?.data?.error || 'Expression evaluation failed',
    };
  }
}

/**
 * Gets list of available units.
 *
 * @returns {Promise<Object>} - Units organized by category
 *
 * Example:
 * ```
 * const units = await getUnits();
 * // { distance: [...], mass: [...], ... }
 * ```
 */
export async function getUnits() {
  try {
    const response = await apiClient.get('/units');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch units:', error);
    return {};
  }
}

/**
 * Gets list of available functions.
 *
 * @returns {Promise<Object>} - Functions organized by category
 *
 * Example:
 * ```
 * const functions = await getFunctions();
 * // { trigonometric: [...], logarithmic: [...], ... }
 * ```
 */
export async function getFunctions() {
  try {
    const response = await apiClient.get('/functions');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch functions:', error);
    return {};
  }
}

/**
 * Gets information about a specific function.
 *
 * @param {string} functionName - Name of the function
 * @returns {Promise<Object>} - Function information
 *
 * Example:
 * ```
 * const info = await getFunctionInfo('sin');
 * // { name: 'sin', description: 'Sine function...' }
 * ```
 */
export async function getFunctionInfo(functionName) {
  try {
    const response = await apiClient.get(`/functions/${functionName}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch info for function ${functionName}:`, error);
    return null;
  }
}

/**
 * Checks if two units are compatible for conversion.
 *
 * @param {string} fromUnit - First unit
 * @param {string} toUnit - Second unit
 * @returns {Promise<Object>} - Compatibility information
 *
 * Example:
 * ```
 * const compatible = await checkUnitCompatibility('km', 'miles');
 * // { compatible: true, from_unit: 'km', to_unit: 'miles', error: null }
 * ```
 */
export async function checkUnitCompatibility(fromUnit, toUnit) {
  try {
    const response = await apiClient.post('/units/check-compatibility', {
      from_unit: fromUnit,
      to_unit: toUnit,
    });

    return response.data;
  } catch (error) {
    return {
      compatible: false,
      from_unit: fromUnit,
      to_unit: toUnit,
      error: error.response?.data?.error || 'Compatibility check failed',
    };
  }
}

/**
 * Gets the conversion factor between two units.
 *
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {Promise<Object>} - Conversion factor
 *
 * Example:
 * ```
 * const factor = await getConversionFactor('km', 'miles');
 * // { factor: 0.621371, from_unit: 'km', to_unit: 'miles', error: null }
 * ```
 */
export async function getConversionFactor(fromUnit, toUnit) {
  try {
    const response = await apiClient.post('/units/conversion-factor', {
      from_unit: fromUnit,
      to_unit: toUnit,
    });

    return response.data;
  } catch (error) {
    return {
      factor: null,
      from_unit: fromUnit,
      to_unit: toUnit,
      error: error.response?.data?.error || 'Failed to get conversion factor',
    };
  }
}

/**
 * Evaluates a scientific function.
 *
 * @param {string} functionName - Name of the function to evaluate
 * @param {Array} args - Arguments to pass to the function
 * @returns {Promise<Object>} - Result with evaluated value
 * @throws {Error} - If function evaluation fails
 *
 * Example:
 * ```
 * const result = await evaluateFunction('sin', [30]);
 * // { result: 0.5, error: null }
 * ```
 */
export async function evaluateFunction(functionName, args) {
  try {
    const response = await apiClient.post('/functions', {
      function: functionName,
      arguments: args,
    });

    return response.data;
  } catch (error) {
    return {
      result: null,
      error: error.response?.data?.error || 'Function evaluation failed',
    };
  }
}

/**
 * Health check - verifies backend is available.
 *
 * @returns {Promise<boolean>} - True if backend is healthy
 */
export async function healthCheck() {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

/**
 * Sets the base URL for API requests.
 * Useful for switching environments or test servers.
 *
 * @param {string} baseURL - New base URL
 */
export function setApiBaseURL(baseURL) {
  apiClient.defaults.baseURL = baseURL;
}

/**
 * Gets the current base URL for API requests.
 *
 * @returns {string} - Current base URL
 */
export function getApiBaseURL() {
  return apiClient.defaults.baseURL;
}

/**
 * Adds a request interceptor to handle auth headers, etc.
 *
 * @param {function} interceptor - Interceptor function
 * @returns {number} - Interceptor ID (for removal)
 */
export function addRequestInterceptor(interceptor) {
  return apiClient.interceptors.request.use(interceptor);
}

/**
 * Adds a response interceptor for error handling, etc.
 *
 * @param {function} onSuccess - Success handler
 * @param {function} onError - Error handler
 * @returns {number} - Interceptor ID (for removal)
 */
export function addResponseInterceptor(onSuccess, onError) {
  return apiClient.interceptors.response.use(onSuccess, onError);
}

export default {
  convert,
  evaluateExpression,
  evaluateFunction,
  getUnits,
  getFunctions,
  getFunctionInfo,
  checkUnitCompatibility,
  getConversionFactor,
  healthCheck,
  setApiBaseURL,
  getApiBaseURL,
  addRequestInterceptor,
  addResponseInterceptor,
};

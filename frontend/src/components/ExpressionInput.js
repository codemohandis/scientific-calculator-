/**
 * Expression Input Component (US3).
 *
 * Allows users to enter complex mathematical expressions and submit them
 * for evaluation. Features:
 * - Text input field with syntax highlighting hints
 * - Submit button
 * - Real-time validation feedback
 * - Error display
 * - History management
 * - Accessibility support (WCAG 2.1 AA)
 */

import { evaluateExpression } from '../services/calculatorApi.js';

/**
 * Create and render the expression input form
 * @returns {HTMLElement} The form element with result display elements
 */
export function createExpressionInput() {
    const outerContainer = document.createElement('div');
    outerContainer.className = 'expression-container';

    const container = document.createElement('div');
    container.id = 'expression-input-container';

    // Create result display element
    const resultElement = document.createElement('div');
    resultElement.id = 'expression-result';
    resultElement.className = 'result-display';
    resultElement.setAttribute('aria-live', 'polite');
    resultElement.setAttribute('aria-atomic', 'true');
    resultElement.setAttribute('aria-hidden', 'true');

    // Create error message element
    const errorElement = document.createElement('div');
    errorElement.id = 'error-message';
    errorElement.className = 'error-display';
    errorElement.setAttribute('aria-hidden', 'true');

    // Create screen reader announcement element
    const srElement = document.createElement('div');
    srElement.id = 'sr-announcement';
    srElement.className = 'sr-only';
    srElement.setAttribute('aria-live', 'assertive');
    srElement.setAttribute('aria-atomic', 'true');

    // Assemble container
    outerContainer.appendChild(container);
    outerContainer.appendChild(resultElement);
    outerContainer.appendChild(errorElement);
    outerContainer.appendChild(srElement);

    // Instantiate ExpressionInput after returning (it will initialize on next tick)
    setTimeout(() => {
        if (container.parentElement) {
            new ExpressionInput('expression-input-container', {
                onEvaluate: (data) => handleExpressionEvaluate(data),
                onError: (error) => handleExpressionError(error),
            });
        }
    }, 0);

    return outerContainer;
}

/**
 * Handle expression evaluation - call backend API
 * @param {Object} data - Evaluation data with expression and timestamp
 */
async function handleExpressionEvaluate(data) {
    try {
        const result = await evaluateExpression(data.expression, {});

        if (result.error) {
            handleExpressionError(result.error);
            return;
        }

        displayExpressionResult(result.result, data.expression);
    } catch (error) {
        handleExpressionError(`Error: ${error.message}`);
    }
}

/**
 * Display expression evaluation result
 * @param {number} result - The evaluated result
 * @param {string} expression - The original expression
 */
function displayExpressionResult(result, expression) {
    const resultElement = document.getElementById('expression-result');
    if (resultElement) {
        const resultText = typeof result === 'number' ?
            (result.toFixed(6).replace(/\.?0+$/, '')) :
            String(result);

        resultElement.innerHTML = `
            <div class="result-content">
                <p class="result-label">Expression: ${expression}</p>
                <p class="result-value">${resultText}</p>
                <button class="btn btn-secondary" id="copy-expression-result-btn">
                    Copy Result
                </button>
            </div>
        `;
        resultElement.removeAttribute('aria-hidden');

        // Attach copy button handler
        const copyBtn = document.getElementById('copy-expression-result-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(resultText).then(() => {
                    announceExpressionToScreenReader('Result copied to clipboard');
                }).catch(err => {
                    handleExpressionError('Failed to copy to clipboard');
                });
            });
        }

        // Announce result to screen readers
        announceExpressionToScreenReader(`Expression evaluated: ${expression} equals ${resultText}`);
    }
}

/**
 * Handle expression evaluation error
 * @param {string} message - The error message
 */
function handleExpressionError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        errorElement.removeAttribute('aria-hidden');
        announceExpressionToScreenReader(`Error: ${message}`);
    }
}

/**
 * Announce a message to screen readers for expression evaluator
 * @param {string} message - The message to announce
 */
function announceExpressionToScreenReader(message) {
    const announcement = document.getElementById('sr-announcement');
    if (announcement) {
        announcement.textContent = message;
    }
}

class ExpressionInput {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    this.options = {
      maxLength: options.maxLength || 1000,
      placeholder: options.placeholder || 'e.g., 2 + 3 * 4, sin(30), sqrt(16)',
      examples: options.examples || [
        '2 + 3 * 4',
        'sin(30) + cos(0)',
        'sqrt(16) * 2',
        '(5 + 3) ** 2',
        'log(100) + sqrt(16)',
      ],
      onEvaluate: options.onEvaluate || (() => {}),
      onError: options.onError || (() => {}),
      onValidationChange: options.onValidationChange || (() => {}),
    };

    this.state = {
      currentExpression: '',
      isValid: null, // null = not validated, true = valid, false = invalid
      errorMessage: '',
      history: [],
      historyIndex: -1,
    };

    this.render();
    this.attachEventListeners();
  }

  /**
   * Render the component HTML structure.
   */
  render() {
    this.container.innerHTML = `
      <div class="expression-input-container">
        <!-- Label -->
        <label for="expression-input" class="expression-input-label">
          Mathematical Expression
        </label>

        <!-- Input wrapper with validation indicator -->
        <div class="expression-input-wrapper">
          <input
            type="text"
            id="expression-input"
            class="expression-input-field"
            placeholder="${this.options.placeholder}"
            maxlength="${this.options.maxLength}"
            aria-label="Enter mathematical expression to evaluate"
            aria-describedby="expression-help expression-error"
            aria-invalid="false"
          />
          <div class="expression-input-status" aria-hidden="true">
            <span class="status-icon"></span>
          </div>
        </div>

        <!-- Help text -->
        <div id="expression-help" class="expression-help-text">
          Supports: +, -, *, /, **, (), sin, cos, tan, log, sqrt, mean, median, and more
        </div>

        <!-- Error message (only shown when invalid) -->
        <div
          id="expression-error"
          class="expression-error-message"
          role="alert"
          aria-live="polite"
          style="display: none;"
        ></div>

        <!-- Character count -->
        <div class="expression-char-count">
          <span class="current-count">0</span>/<span class="max-count">${this.options.maxLength}</span> characters
        </div>

        <!-- Action buttons -->
        <div class="expression-actions">
          <button
            id="expression-clear-btn"
            class="expression-clear-btn"
            type="button"
            aria-label="Clear expression input"
          >
            Clear
          </button>
          <button
            id="expression-evaluate-btn"
            class="expression-evaluate-btn"
            type="button"
            aria-label="Evaluate expression"
          >
            Evaluate
          </button>
        </div>

        <!-- Examples section -->
        <details class="expression-examples">
          <summary>Show Examples</summary>
          <div class="expression-examples-list">
            ${this.options.examples
              .map(
                (example, index) => `
              <button
                type="button"
                class="expression-example-btn"
                data-example="${example}"
                aria-label="Insert example: ${example}"
              >
                ${example}
              </button>
            `
              )
              .join('')}
          </div>
        </details>

        <!-- History section (if history enabled) -->
        <details class="expression-history" id="expression-history" style="display: none;">
          <summary>Recent Expressions</summary>
          <div class="expression-history-list" id="expression-history-list">
            <!-- History items will be inserted here -->
          </div>
        </details>
      </div>
    `;

    this.attachInputField();
  }

  /**
   * Store references to key DOM elements.
   */
  attachInputField() {
    this.inputElement = document.getElementById('expression-input');
    this.errorElement = document.getElementById('expression-error');
    this.evaluateBtn = document.getElementById('expression-evaluate-btn');
    this.clearBtn = document.getElementById('expression-clear-btn');
    this.statusIcon = this.container.querySelector('.status-icon');
    this.charCountSpan = this.container.querySelector('.current-count');
    this.historyContainer = document.getElementById('expression-history');
    this.historyList = document.getElementById('expression-history-list');
  }

  /**
   * Attach event listeners to input field and buttons.
   */
  attachEventListeners() {
    // Input field events
    this.inputElement.addEventListener('input', (e) => this.onInputChange(e));
    this.inputElement.addEventListener('keydown', (e) => this.onKeyDown(e));
    this.inputElement.addEventListener('focus', (e) => this.onInputFocus(e));
    this.inputElement.addEventListener('blur', (e) => this.onInputBlur(e));

    // Button events
    this.evaluateBtn.addEventListener('click', () => this.evaluate());
    this.clearBtn.addEventListener('click', () => this.clear());

    // Example buttons
    this.container.querySelectorAll('.expression-example-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => this.insertExample(e.target.dataset.example));
    });

    // History buttons (if any)
    this.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('expression-history-btn')) {
        this.insertExample(e.target.dataset.expression);
      }
    });
  }

  /**
   * Handle input field change - validate and update UI.
   */
  onInputChange(event) {
    const newValue = event.target.value;
    this.state.currentExpression = newValue;

    // Update character count
    this.updateCharCount();

    // Validate expression
    this.validateExpression(newValue);

    // Call validation change callback
    this.options.onValidationChange({
      expression: newValue,
      isValid: this.state.isValid,
      error: this.state.errorMessage,
    });
  }

  /**
   * Handle Enter key to submit, Escape to clear.
   */
  onKeyDown(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.evaluate();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.clear();
      this.inputElement.focus();
    }
  }

  /**
   * Handle input focus.
   */
  onInputFocus(event) {
    event.target.parentElement.classList.add('focused');
  }

  /**
   * Handle input blur.
   */
  onInputBlur(event) {
    event.target.parentElement.classList.remove('focused');
  }

  /**
   * Validate expression syntax without evaluation.
   */
  validateExpression(expression) {
    // Clear previous error
    this.state.errorMessage = '';
    this.hideError();

    if (!expression.trim()) {
      this.state.isValid = null;
      this.updateStatusIcon('neutral');
      return;
    }

    // Check length
    if (expression.length > this.options.maxLength) {
      this.state.isValid = false;
      this.state.errorMessage = `Expression is too long (max ${this.options.maxLength} characters)`;
      this.updateStatusIcon('invalid');
      this.options.onError(this.state.errorMessage);
      return;
    }

    // Check for balanced parentheses
    let parenCount = 0;
    let isBalanced = true;
    for (const char of expression) {
      if (char === '(') {
        parenCount++;
      } else if (char === ')') {
        parenCount--;
      }
      if (parenCount < 0) {
        isBalanced = false;
        break;
      }
    }

    if (!isBalanced || parenCount !== 0) {
      this.state.isValid = false;
      this.state.errorMessage = 'Unmatched parentheses';
      this.updateStatusIcon('invalid');
      this.options.onError(this.state.errorMessage);
      return;
    }

    // If we get here, syntax looks OK (basic validation)
    this.state.isValid = true;
    this.updateStatusIcon('valid');
  }

  /**
   * Update character count display.
   */
  updateCharCount() {
    const count = this.state.currentExpression.length;
    this.charCountSpan.textContent = count;

    const countContainer = this.charCountSpan.parentElement;
    if (count > this.options.maxLength * 0.9) {
      countContainer.classList.add('warning');
    } else {
      countContainer.classList.remove('warning');
    }
  }

  /**
   * Update validation status icon.
   */
  updateStatusIcon(status) {
    this.statusIcon.className = 'status-icon';
    if (status === 'valid') {
      this.statusIcon.classList.add('valid');
      this.statusIcon.setAttribute('aria-label', 'Expression syntax is valid');
    } else if (status === 'invalid') {
      this.statusIcon.classList.add('invalid');
      this.statusIcon.setAttribute('aria-label', 'Expression has syntax errors');
    } else {
      this.statusIcon.classList.add('neutral');
    }
  }

  /**
   * Show error message.
   */
  showError(message) {
    this.errorElement.textContent = message;
    this.errorElement.style.display = 'block';
    this.inputElement.setAttribute('aria-invalid', 'true');
  }

  /**
   * Hide error message.
   */
  hideError() {
    this.errorElement.textContent = '';
    this.errorElement.style.display = 'none';
    this.inputElement.setAttribute('aria-invalid', 'false');
  }

  /**
   * Evaluate the current expression.
   */
  evaluate() {
    const expression = this.state.currentExpression.trim();

    if (!expression) {
      this.showError('Please enter an expression');
      return;
    }

    if (this.state.isValid === false) {
      this.showError(this.state.errorMessage || 'Please fix the expression syntax');
      return;
    }

    // Call the evaluation callback
    this.hideError();
    this.options.onEvaluate({
      expression,
      timestamp: new Date().toISOString(),
    });

    // Add to history
    this.addToHistory(expression);
  }

  /**
   * Clear the input field.
   */
  clear() {
    this.inputElement.value = '';
    this.state.currentExpression = '';
    this.state.isValid = null;
    this.state.errorMessage = '';
    this.hideError();
    this.updateCharCount();
    this.updateStatusIcon('neutral');
    this.inputElement.focus();
  }

  /**
   * Insert an example expression.
   */
  insertExample(example) {
    this.inputElement.value = example;
    this.state.currentExpression = example;
    this.validateExpression(example);
    this.updateCharCount();
    this.inputElement.focus();
    this.options.onValidationChange({
      expression: example,
      isValid: this.state.isValid,
      error: this.state.errorMessage,
    });
  }

  /**
   * Add expression to history.
   */
  addToHistory(expression) {
    // Avoid duplicates
    if (this.state.history.length > 0 && this.state.history[0] === expression) {
      return;
    }

    // Add to beginning of history
    this.state.history.unshift(expression);

    // Limit history size
    if (this.state.history.length > 10) {
      this.state.history.pop();
    }

    // Show history container if hidden
    if (this.state.history.length === 1) {
      this.historyContainer.style.display = 'block';
    }

    // Update history list
    this.renderHistory();

    // Reset history index
    this.state.historyIndex = -1;
  }

  /**
   * Render history items.
   */
  renderHistory() {
    if (this.state.history.length === 0) {
      this.historyList.innerHTML = '<p>No recent expressions</p>';
      return;
    }

    this.historyList.innerHTML = this.state.history
      .map(
        (expr, index) => `
      <button
        type="button"
        class="expression-history-btn"
        data-expression="${this.escapeHtml(expr)}"
        aria-label="Use expression: ${expr}"
      >
        ${this.escapeHtml(expr)}
      </button>
    `
      )
      .join('');
  }

  /**
   * Get the current expression value.
   */
  getValue() {
    return this.state.currentExpression;
  }

  /**
   * Set the expression value programmatically.
   */
  setValue(expression) {
    this.inputElement.value = expression;
    this.state.currentExpression = expression;
    this.validateExpression(expression);
    this.updateCharCount();
  }

  /**
   * Check if the current expression is valid.
   */
  isValid() {
    return this.state.isValid === true;
  }

  /**
   * Get error message if invalid.
   */
  getError() {
    return this.state.errorMessage;
  }

  /**
   * Get history of evaluated expressions.
   */
  getHistory() {
    return [...this.state.history];
  }

  /**
   * Escape HTML special characters for safe display.
   */
  escapeHtml(text) {
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
   * Destroy the component and clean up.
   */
  destroy() {
    this.container.innerHTML = '';
    this.inputElement = null;
    this.errorElement = null;
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExpressionInput;
}

/**
 * Expression Result Display Component (US3).
 *
 * Displays the result of expression evaluation with:
 * - Formatted numerical output
 * - Unit information (if applicable)
 * - Copy-to-clipboard functionality
 * - Precision control
 * - Accessibility support
 */

class ExpressionResult {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      throw new Error(`Container with id "${containerId}" not found`);
    }

    this.options = {
      precision: options.precision || 5,
      maxDigits: options.maxDigits || 15,
      useScientific: options.useScientific || false,
      onCopy: options.onCopy || (() => {}),
    };

    this.state = {
      result: null,
      expression: '',
      error: null,
      isLoading: false,
    };

    this.render();
  }

  /**
   * Render the component HTML structure.
   */
  render() {
    this.container.innerHTML = `
      <div class="expression-result-container">
        <!-- Loading state -->
        <div class="expression-result-loading" style="display: none;" aria-live="polite">
          <span class="loading-spinner" aria-label="Evaluating expression"></span>
          Evaluating...
        </div>

        <!-- Result display (hidden initially) -->
        <div class="expression-result-display" style="display: none;" role="region" aria-live="polite" aria-atomic="true">
          <!-- Original expression -->
          <div class="expression-result-input">
            <label class="expression-result-label">Expression:</label>
            <code class="expression-result-expression" aria-label="Your expression"></code>
          </div>

          <!-- Result value -->
          <div class="expression-result-value">
            <label class="expression-result-label">Result:</label>
            <div class="expression-result-output">
              <span class="result-number" aria-label="Result value"></span>
              <span class="result-unit" style="display: none;" aria-label="Result unit"></span>
            </div>
          </div>

          <!-- Precision control -->
          <div class="expression-result-precision">
            <label for="result-precision" class="expression-result-label">Precision:</label>
            <select
              id="result-precision"
              class="result-precision-select"
              aria-label="Select decimal precision"
            >
              <option value="2">2 decimals</option>
              <option value="3">3 decimals</option>
              <option value="4">4 decimals</option>
              <option value="5" selected>5 decimals</option>
              <option value="6">6 decimals</option>
              <option value="8">8 decimals</option>
              <option value="10">10 decimals</option>
            </select>
          </div>

          <!-- Actions -->
          <div class="expression-result-actions">
            <button
              class="expression-result-copy-btn"
              type="button"
              aria-label="Copy result to clipboard"
            >
              📋 Copy Result
            </button>
            <button
              class="expression-result-use-btn"
              type="button"
              aria-label="Use this result in a new expression"
              style="display: none;"
            >
              ➕ Use in Expression
            </button>
          </div>

          <!-- Copy notification -->
          <div class="expression-result-copy-notification" style="display: none;" role="status" aria-live="polite">
            Copied to clipboard!
          </div>

          <!-- Additional info -->
          <div class="expression-result-info">
            <details class="expression-result-details">
              <summary>More Information</summary>
              <div class="expression-result-details-content">
                <div class="result-info-row">
                  <span class="info-label">Type:</span>
                  <span class="info-value result-type">Number</span>
                </div>
                <div class="result-info-row">
                  <span class="info-label">Scientific Notation:</span>
                  <span class="info-value result-scientific" style="display: none;"></span>
                  <span class="info-no-scientific" style="display: none;">N/A</span>
                </div>
                <div class="result-info-row">
                  <span class="info-label">Magnitude:</span>
                  <span class="info-value result-magnitude">~0</span>
                </div>
              </div>
            </details>
          </div>
        </div>

        <!-- Empty state -->
        <div class="expression-result-empty" style="display: flex;">
          <p class="expression-result-placeholder">
            Enter an expression and click "Evaluate" to see the result here.
          </p>
        </div>

        <!-- Error display -->
        <div class="expression-result-error" style="display: none;" role="alert" aria-live="assertive">
          <div class="error-icon" aria-hidden="true">⚠️</div>
          <div class="error-content">
            <div class="error-title">Evaluation Error</div>
            <div class="error-message"></div>
          </div>
        </div>
      </div>
    `;

    this.attachElements();
    this.attachEventListeners();
  }

  /**
   * Attach references to DOM elements.
   */
  attachElements() {
    this.loadingElement = this.container.querySelector('.expression-result-loading');
    this.displayElement = this.container.querySelector('.expression-result-display');
    this.emptyElement = this.container.querySelector('.expression-result-empty');
    this.errorElement = this.container.querySelector('.expression-result-error');

    this.expressionSpan = this.container.querySelector('.expression-result-expression');
    this.resultNumberSpan = this.container.querySelector('.result-number');
    this.resultUnitSpan = this.container.querySelector('.result-unit');
    this.copyBtn = this.container.querySelector('.expression-result-copy-btn');
    this.useBtn = this.container.querySelector('.expression-result-use-btn');
    this.precisionSelect = this.container.querySelector('#result-precision');
    this.copyNotification = this.container.querySelector('.expression-result-copy-notification');

    this.errorMessage = this.container.querySelector('.error-message');
  }

  /**
   * Attach event listeners.
   */
  attachEventListeners() {
    this.copyBtn.addEventListener('click', () => this.copyToClipboard());
    this.precisionSelect.addEventListener('change', (e) => this.changePrecision(parseInt(e.target.value)));
  }

  /**
   * Show loading state.
   */
  showLoading() {
    this.state.isLoading = true;
    this.emptyElement.style.display = 'none';
    this.displayElement.style.display = 'none';
    this.errorElement.style.display = 'none';
    this.loadingElement.style.display = 'flex';
  }

  /**
   * Display a successful result.
   */
  displayResult(expression, result) {
    this.state.isLoading = false;
    this.state.result = result;
    this.state.expression = expression;
    this.state.error = null;

    // Update expression display
    this.expressionSpan.textContent = expression;

    // Format and display result
    const formatted = this.formatResult(result);
    this.resultNumberSpan.textContent = formatted.display;
    this.resultNumberSpan.setAttribute('aria-label', `Result: ${formatted.full}`);

    // Update additional info
    this.updateAdditionalInfo(result);

    // Show result display
    this.loadingElement.style.display = 'none';
    this.emptyElement.style.display = 'none';
    this.errorElement.style.display = 'none';
    this.displayElement.style.display = 'block';
  }

  /**
   * Display an error message.
   */
  displayError(error) {
    this.state.isLoading = false;
    this.state.result = null;
    this.state.error = error;

    this.errorMessage.textContent = error;

    this.loadingElement.style.display = 'none';
    this.emptyElement.style.display = 'none';
    this.displayElement.style.display = 'none';
    this.errorElement.style.display = 'flex';
  }

  /**
   * Format a numerical result for display.
   */
  formatResult(value) {
    if (typeof value !== 'number' || !isFinite(value)) {
      return { display: 'Invalid result', full: 'Invalid result' };
    }

    const precision = this.options.precision;

    // For very large or very small numbers, use scientific notation
    const absValue = Math.abs(value);
    let displayValue;
    let fullValue;

    if (absValue === 0) {
      displayValue = '0';
      fullValue = '0';
    } else if (absValue >= 1e10 || (absValue < 1e-4 && absValue !== 0)) {
      // Use scientific notation
      fullValue = value.toExponential(precision);
      displayValue = value.toExponential(Math.min(precision, 6));
    } else {
      // Use fixed notation
      fullValue = value.toFixed(precision);
      displayValue = value.toFixed(precision);

      // Remove trailing zeros
      displayValue = displayValue.replace(/\.?0+$/, '');
    }

    return {
      display: displayValue,
      full: fullValue,
    };
  }

  /**
   * Update additional information display.
   */
  updateAdditionalInfo(value) {
    if (typeof value !== 'number') {
      return;
    }

    // Magnitude
    const magnitude = value === 0 ? 0 : Math.floor(Math.log10(Math.abs(value)));
    this.container.querySelector('.result-magnitude').textContent = `10^${magnitude}`;

    // Scientific notation
    const scientificSpan = this.container.querySelector('.result-scientific');
    if (Math.abs(value) < 1e-4 || Math.abs(value) >= 1e10) {
      scientificSpan.textContent = value.toExponential(5);
      scientificSpan.style.display = 'inline';
      this.container.querySelector('.info-no-scientific').style.display = 'none';
    } else {
      scientificSpan.style.display = 'none';
      this.container.querySelector('.info-no-scientific').style.display = 'inline';
      this.container.querySelector('.info-no-scientific').textContent = 'N/A';
    }
  }

  /**
   * Copy result to clipboard.
   */
  copyToClipboard() {
    const text = this.resultNumberSpan.textContent;
    if (!text) {
      return;
    }

    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Show notification
        this.copyNotification.style.display = 'block';
        setTimeout(() => {
          this.copyNotification.style.display = 'none';
        }, 2000);

        // Call callback
        this.options.onCopy(text);
      })
      .catch((err) => {
        console.error('Failed to copy to clipboard:', err);
        // Fallback to old method
        this.copyToClipboardFallback(text);
      });
  }

  /**
   * Fallback clipboard copy for older browsers.
   */
  copyToClipboardFallback(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }

  /**
   * Change precision of displayed result.
   */
  changePrecision(precision) {
    this.options.precision = precision;

    if (this.state.result !== null) {
      const formatted = this.formatResult(this.state.result);
      this.resultNumberSpan.textContent = formatted.display;
      this.resultNumberSpan.setAttribute('aria-label', `Result: ${formatted.full}`);
    }
  }

  /**
   * Clear the result display.
   */
  clear() {
    this.state.result = null;
    this.state.expression = '';
    this.state.error = null;

    this.loadingElement.style.display = 'none';
    this.displayElement.style.display = 'none';
    this.errorElement.style.display = 'none';
    this.emptyElement.style.display = 'flex';
  }

  /**
   * Get the current result value.
   */
  getResult() {
    return this.state.result;
  }

  /**
   * Get the expression that was evaluated.
   */
  getExpression() {
    return this.state.expression;
  }

  /**
   * Destroy the component.
   */
  destroy() {
    this.container.innerHTML = '';
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ExpressionResult;
}

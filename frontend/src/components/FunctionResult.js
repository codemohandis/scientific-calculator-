/**
 * FunctionResult component for displaying scientific function results.
 *
 * Displays results with formatting, precision control, and copy-to-clipboard functionality.
 */

/**
 * Create and render the function result display
 * @returns {HTMLElement} The result display element
 */
function createFunctionResult() {
    const container = document.createElement('div');
    container.id = 'function-result';
    container.className = 'result-container';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-hidden', 'true');

    const resultContent = document.createElement('div');
    resultContent.className = 'result-content';

    const resultLabel = document.createElement('p');
    resultLabel.className = 'result-label';
    resultLabel.id = 'result-label';

    const resultValue = document.createElement('p');
    resultValue.className = 'result-value';
    resultValue.id = 'result-value';

    const resultActions = document.createElement('div');
    resultActions.className = 'result-actions';

    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'btn btn-secondary';
    copyButton.textContent = 'Copy Result';
    copyButton.setAttribute('aria-label', 'Copy result to clipboard');
    copyButton.addEventListener('click', copyResultToClipboard);

    const precisionGroup = document.createElement('div');
    precisionGroup.className = 'precision-control';

    const precisionLabel = document.createElement('label');
    precisionLabel.htmlFor = 'precision-input';
    precisionLabel.textContent = 'Decimal places:';

    const precisionInput = document.createElement('input');
    precisionInput.id = 'precision-input';
    precisionInput.type = 'number';
    precisionInput.min = '0';
    precisionInput.max = '15';
    precisionInput.value = '6';
    precisionInput.className = 'precision-input';
    precisionInput.setAttribute('aria-label', 'Number of decimal places to display');
    precisionInput.addEventListener('change', updateResultPrecision);

    precisionGroup.appendChild(precisionLabel);
    precisionGroup.appendChild(precisionInput);

    resultActions.appendChild(copyButton);
    resultActions.appendChild(precisionGroup);

    resultContent.appendChild(resultLabel);
    resultContent.appendChild(resultValue);
    resultContent.appendChild(resultActions);

    container.appendChild(resultContent);

    return container;
}

/**
 * Display a function result
 * @param {number} result - The result value
 * @param {string} functionName - The function name
 * @param {Array} args - The function arguments
 */
function displayFunctionResult(result, functionName, args) {
    const container = document.getElementById('function-result');
    if (!container) return;

    // Store result data for precision control
    container._resultData = {
        result,
        functionName,
        args,
    };

    const precision = parseInt(document.getElementById('precision-input').value, 10);

    // Build label
    const argsStr = formatArguments(args);
    const labelElement = document.getElementById('result-label');
    if (labelElement) {
        labelElement.textContent = `${functionName}(${argsStr})`;
    }

    // Format and display result
    const valueElement = document.getElementById('result-value');
    if (valueElement) {
        valueElement.textContent = formatNumber(result, precision);
    }

    container.removeAttribute('aria-hidden');
}

/**
 * Format arguments for display
 * @param {Array} args - The arguments
 * @returns {string} Formatted arguments string
 */
function formatArguments(args) {
    return args.map(a => {
        if (typeof a === 'number') {
            return a.toFixed(6).replace(/\.?0+$/, '');
        }
        return String(a);
    }).join(', ');
}

/**
 * Format a number with the specified precision
 * @param {number} value - The value to format
 * @param {number} precision - Number of decimal places
 * @returns {string} Formatted number
 */
function formatNumber(value, precision = 6) {
    // Handle special cases
    if (value === Infinity) return '∞';
    if (value === -Infinity) return '-∞';
    if (isNaN(value)) return 'NaN';

    // Use exponential notation for very large or very small numbers
    if (Math.abs(value) !== 0 && (Math.abs(value) < Math.pow(10, -precision) || Math.abs(value) > Math.pow(10, precision + 5))) {
        return value.toExponential(precision);
    }

    // Use fixed notation for normal numbers
    const formatted = value.toFixed(precision);

    // Remove trailing zeros
    return formatted.replace(/\.?0+$/, '');
}

/**
 * Update result display with new precision
 * @param {Event} event - The change event
 */
function updateResultPrecision(event) {
    const container = document.getElementById('function-result');
    if (!container || !container._resultData) return;

    const precision = parseInt(event.target.value, 10);
    const { result } = container._resultData;

    const valueElement = document.getElementById('result-value');
    if (valueElement) {
        valueElement.textContent = formatNumber(result, precision);
    }

    announceToScreenReader(`Result updated to ${precision} decimal places: ${formatNumber(result, precision)}`);
}

/**
 * Copy result to clipboard
 */
function copyResultToClipboard() {
    const valueElement = document.getElementById('result-value');
    if (!valueElement) return;

    const text = valueElement.textContent;
    navigator.clipboard.writeText(text).then(() => {
        announceToScreenReader(`Result copied: ${text}`);

        // Show visual feedback
        const button = document.querySelector('.result-actions .btn-secondary');
        if (button) {
            const originalText = button.textContent;
            button.textContent = 'Copied!';
            button.classList.add('copied');

            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 2000);
        }
    }).catch(err => {
        announceToScreenReader('Failed to copy result to clipboard');
        console.error('Failed to copy:', err);
    });
}

/**
 * Clear the result display
 */
function clearResult() {
    const container = document.getElementById('function-result');
    if (container) {
        container.setAttribute('aria-hidden', 'true');
        container._resultData = null;

        const labelElement = document.getElementById('result-label');
        if (labelElement) {
            labelElement.textContent = '';
        }

        const valueElement = document.getElementById('result-value');
        if (valueElement) {
            valueElement.textContent = '';
        }
    }
}

/**
 * Export result in different formats
 * @param {string} format - Export format ('json', 'csv', 'txt')
 * @returns {string} Exported data
 */
function exportResult(format = 'json') {
    const container = document.getElementById('function-result');
    if (!container || !container._resultData) return '';

    const { result, functionName, args } = container._resultData;
    const precision = parseInt(document.getElementById('precision-input').value, 10);

    switch (format) {
        case 'json':
            return JSON.stringify({
                function: functionName,
                arguments: args,
                result: formatNumber(result, precision),
                timestamp: new Date().toISOString(),
            }, null, 2);

        case 'csv':
            return `Function,Arguments,Result\n${functionName},"${args.join(', ')}",${formatNumber(result, precision)}`;

        case 'txt':
            return `${functionName}(${args.join(', ')}) = ${formatNumber(result, precision)}`;

        default:
            return '';
    }
}

/**
 * Announce a message to screen readers
 * @param {string} message - The message to announce
 */
function announceToScreenReader(message) {
    const announcement = document.getElementById('sr-announcement');
    if (announcement) {
        announcement.textContent = message;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createFunctionResult,
        displayFunctionResult,
        formatArguments,
        formatNumber,
        updateResultPrecision,
        copyResultToClipboard,
        clearResult,
        exportResult,
        announceToScreenReader,
    };
}

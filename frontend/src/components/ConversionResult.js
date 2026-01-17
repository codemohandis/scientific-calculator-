/**
 * ConversionResult component for displaying conversion results.
 *
 * Displays the conversion result with proper formatting and accessibility.
 */

/**
 * Create and render the conversion result display
 * @returns {HTMLElement} The result display element
 */
function createConversionResult() {
    const container = document.createElement('div');
    container.id = 'conversion-result';
    container.className = 'conversion-result';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-label', 'Conversion result');
    container.setAttribute('aria-hidden', 'true');

    const content = document.createElement('div');
    content.className = 'result-content';
    content.textContent = 'Enter values and select units to see the conversion result here.';

    container.appendChild(content);

    return container;
}

/**
 * Update the conversion result display
 * @param {number} result - The converted value
 * @param {number} originalValue - The original value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 */
function updateConversionResult(result, originalValue, fromUnit, toUnit) {
    const resultElement = document.getElementById('conversion-result');
    if (!resultElement) return;

    // Format the result with proper precision
    const formattedResult = formatNumber(result);

    // Create the result display
    resultElement.innerHTML = `
        <div class="result-content">
            <div class="result-equation">
                <span class="original-value" aria-label="Original value">${originalValue}</span>
                <span class="original-unit">${formatUnitName(fromUnit)}</span>
                <span class="equals">=</span>
                <span class="converted-value" aria-label="Converted value">${formattedResult}</span>
                <span class="converted-unit">${formatUnitName(toUnit)}</span>
            </div>
            <div class="result-actions">
                <button class="btn btn-secondary" onclick="copyResultToClipboard('${formattedResult} ${toUnit}')" aria-label="Copy result to clipboard">
                    Copy
                </button>
                <button class="btn btn-secondary" onclick="swapUnits()" aria-label="Swap source and target units">
                    Swap Units
                </button>
            </div>
        </div>
    `;

    // Remove the hidden state
    resultElement.removeAttribute('aria-hidden');

    // Announce to screen readers
    announceResult(originalValue, fromUnit, formattedResult, toUnit);
}

/**
 * Format a number for display
 * @param {number} num - The number to format
 * @returns {string} The formatted number
 */
function formatNumber(num) {
    // Handle very large or very small numbers with scientific notation
    if (Math.abs(num) > 1e10 || (Math.abs(num) < 0.00001 && num !== 0)) {
        return num.toExponential(5);
    }

    // Otherwise use fixed decimal places (5)
    return num.toFixed(5).replace(/\.?0+$/, '');
}

/**
 * Format a unit name for display
 * @param {string} unit - The unit name
 * @returns {string} The formatted unit name
 */
function formatUnitName(unit) {
    const unitDisplay = {
        'meter': 'm',
        'kilometer': 'km',
        'mile': 'mi',
        'foot': 'ft',
        'inch': 'in',
        'yard': 'yd',
        'centimeter': 'cm',
        'millimeter': 'mm',
        'kilogram': 'kg',
        'gram': 'g',
        'pound': 'lb',
        'ounce': 'oz',
        'ton': 't',
        'celsius': '°C',
        'fahrenheit': '°F',
        'kelvin': 'K',
        'liter': 'L',
        'milliliter': 'mL',
        'gallon': 'gal',
        'quart': 'qt',
        'pint': 'pt',
    };

    return unitDisplay[unit] || unit;
}

/**
 * Announce the result to screen readers
 * @param {number} originalValue - The original value
 * @param {string} fromUnit - Source unit
 * @param {string} result - The converted value (as string)
 * @param {string} toUnit - Target unit
 */
function announceResult(originalValue, fromUnit, result, toUnit) {
    const message = `Conversion result: ${originalValue} ${fromUnit} equals ${result} ${toUnit}`;
    announceToScreenReader(message);
}

/**
 * Swap the source and target units
 */
function swapUnits() {
    const fromSelect = document.getElementById('from-unit');
    const toSelect = document.getElementById('to-unit');

    if (fromSelect && toSelect) {
        const temp = fromSelect.value;
        fromSelect.value = toSelect.value;
        toSelect.value = temp;

        // Trigger conversion with swapped units
        const valueInput = document.getElementById('value-input');
        if (valueInput && valueInput.value) {
            const event = new Event('submit');
            document.getElementById('conversion-form').dispatchEvent(event);
        }

        announceToScreenReader('Units swapped. Please convert again to see the result.');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createConversionResult,
        updateConversionResult,
        formatNumber,
        formatUnitName,
        announceResult,
        swapUnits,
    };
}

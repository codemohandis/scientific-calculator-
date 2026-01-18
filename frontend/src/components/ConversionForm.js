/**
 * ConversionForm component for unit conversions.
 *
 * Provides input fields for value and unit selection, with validation
 * and API integration for converting between units.
 */

/**
 * Create and render the conversion form
 * @returns {HTMLElement} A container with the form and result display elements
 */
export function createConversionForm() {
    const container = document.createElement('div');
    container.className = 'conversion-container';

    const form = document.createElement('form');
    form.id = 'conversion-form';
    form.className = 'conversion-form';
    form.setAttribute('aria-label', 'Unit conversion form');

    // Value input group
    const valueGroup = document.createElement('div');
    valueGroup.className = 'form-group';

    const valueLabel = document.createElement('label');
    valueLabel.htmlFor = 'value-input';
    valueLabel.textContent = 'Value to convert';
    valueLabel.className = 'form-label';

    const valueInput = document.createElement('input');
    valueInput.id = 'value-input';
    valueInput.type = 'number';
    valueInput.placeholder = 'Enter a number';
    valueInput.className = 'form-input';
    valueInput.setAttribute('aria-label', 'Value to convert');
    valueInput.setAttribute('aria-describedby', 'value-help');
    valueInput.required = true;
    valueInput.step = 'any';

    const valueHelp = document.createElement('span');
    valueHelp.id = 'value-help';
    valueHelp.className = 'form-help';
    valueHelp.textContent = 'Enter any number, including decimals and negative values';

    valueGroup.appendChild(valueLabel);
    valueGroup.appendChild(valueInput);
    valueGroup.appendChild(valueHelp);

    // Source unit selection group
    const fromUnitGroup = document.createElement('div');
    fromUnitGroup.className = 'form-group';

    const fromLabel = document.createElement('label');
    fromLabel.htmlFor = 'from-unit';
    fromLabel.textContent = 'From unit';
    fromLabel.className = 'form-label';

    const fromUnitSelect = document.createElement('select');
    fromUnitSelect.id = 'from-unit';
    fromUnitSelect.className = 'form-input';
    fromUnitSelect.setAttribute('aria-label', 'Source unit');
    fromUnitSelect.required = true;
    populateUnitSelect(fromUnitSelect);

    fromUnitGroup.appendChild(fromLabel);
    fromUnitGroup.appendChild(fromUnitSelect);

    // Target unit selection group
    const toUnitGroup = document.createElement('div');
    toUnitGroup.className = 'form-group';

    const toLabel = document.createElement('label');
    toLabel.htmlFor = 'to-unit';
    toLabel.textContent = 'To unit';
    toLabel.className = 'form-label';

    const toUnitSelect = document.createElement('select');
    toUnitSelect.id = 'to-unit';
    toUnitSelect.className = 'form-input';
    toUnitSelect.setAttribute('aria-label', 'Target unit');
    toUnitSelect.required = true;
    populateUnitSelect(toUnitSelect);

    toUnitGroup.appendChild(toLabel);
    toUnitGroup.appendChild(toUnitSelect);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary';
    submitButton.textContent = 'Convert';
    submitButton.setAttribute('aria-label', 'Convert the unit value');

    // Assemble form
    form.appendChild(valueGroup);
    form.appendChild(fromUnitGroup);
    form.appendChild(toUnitGroup);
    form.appendChild(submitButton);

    // Create result display element
    const resultElement = document.createElement('div');
    resultElement.id = 'conversion-result';
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
    container.appendChild(form);
    container.appendChild(resultElement);
    container.appendChild(errorElement);
    container.appendChild(srElement);

    // Add form submission handler
    form.addEventListener('submit', handleConversionSubmit);

    return container;
}

/**
 * Populate a unit select element with available units
 * @param {HTMLSelectElement} selectElement - The select element to populate
 */
function populateUnitSelect(selectElement) {
    const unitCategories = {
        'Distance': ['meter', 'kilometer', 'mile', 'foot', 'inch', 'yard', 'centimeter'],
        'Mass': ['kilogram', 'gram', 'pound', 'ounce', 'ton'],
        'Temperature': ['celsius', 'fahrenheit', 'kelvin'],
        'Volume': ['liter', 'milliliter', 'gallon', 'quart', 'pint'],
    };

    for (const [category, units] of Object.entries(unitCategories)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;

        units.forEach(unit => {
            const option = document.createElement('option');
            option.value = unit;
            option.textContent = unit.charAt(0).toUpperCase() + unit.slice(1);
            optgroup.appendChild(option);
        });

        selectElement.appendChild(optgroup);
    }

    // Set default selections
    selectElement.value = selectElement.id === 'from-unit' ? 'kilometer' : 'mile';
}

/**
 * Handle form submission for conversion
 * @param {Event} event - The form submission event
 */
async function handleConversionSubmit(event) {
    event.preventDefault();

    const value = parseFloat(document.getElementById('value-input').value);
    const fromUnit = document.getElementById('from-unit').value;
    const toUnit = document.getElementById('to-unit').value;

    if (isNaN(value)) {
        showErrorMessage('Please enter a valid number');
        return;
    }

    try {
        const result = await convertUnits(value, fromUnit, toUnit);
        displayConversionResult(result, value, fromUnit, toUnit);
    } catch (error) {
        showErrorMessage(`Error: ${error.message}`);
    }
}

/**
 * Convert units using the backend API
 * @param {number} value - The value to convert
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 * @returns {Promise<number>} The converted value
 */
async function convertUnits(value, fromUnit, toUnit) {
    const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            value: value,
            from_unit: fromUnit,
            to_unit: toUnit,
        }),
    });

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
        throw new Error(data.error);
    }

    return data.result;
}

/**
 * Display the conversion result
 * @param {number} result - The converted value
 * @param {number} originalValue - The original value
 * @param {string} fromUnit - Source unit
 * @param {string} toUnit - Target unit
 */
function displayConversionResult(result, originalValue, fromUnit, toUnit) {
    const resultElement = document.getElementById('conversion-result');
    if (resultElement) {
        const resultText = `${result.toFixed(5)} ${toUnit}`;
        resultElement.innerHTML = `
            <div class="result-content">
                <p class="result-text">
                    <strong>${originalValue}</strong> ${fromUnit} =
                    <strong>${result.toFixed(5)}</strong> ${toUnit}
                </p>
                <button class="btn btn-secondary" id="copy-result-btn">
                    Copy Result
                </button>
            </div>
        `;
        resultElement.removeAttribute('aria-hidden');

        // Attach copy button handler
        const copyBtn = document.getElementById('copy-result-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(resultText).then(() => {
                    announceToScreenReader('Result copied to clipboard');
                }).catch(err => {
                    showErrorMessage('Failed to copy to clipboard');
                });
            });
        }

        // Announce result to screen readers
        announceToScreenReader(`Conversion complete: ${originalValue} ${fromUnit} equals ${result.toFixed(5)} ${toUnit}`);
    }
}

/**
 * Show an error message
 * @param {string} message - The error message to display
 */
function showErrorMessage(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        errorElement.removeAttribute('aria-hidden');

        // Announce error to screen readers
        announceToScreenReader(`Error: ${message}`);
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


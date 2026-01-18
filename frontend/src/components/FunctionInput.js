/**
 * FunctionInput component for scientific function calculations.
 *
 * Provides function selector and argument inputs for trigonometric,
 * logarithmic, exponential, and statistical functions.
 */

/**
 * Create and render the function input form
 * @returns {HTMLElement} A container with the form and result display elements
 */
export function createFunctionInput() {
    const container = document.createElement('div');
    container.className = 'function-container';

    const form = document.createElement('form');
    form.id = 'function-form';
    form.className = 'function-form';
    form.setAttribute('aria-label', 'Scientific function calculator');

    // Function selector group
    const functionGroup = document.createElement('div');
    functionGroup.className = 'form-group';

    const functionLabel = document.createElement('label');
    functionLabel.htmlFor = 'function-select';
    functionLabel.textContent = 'Select a function';
    functionLabel.className = 'form-label';

    const functionSelect = document.createElement('select');
    functionSelect.id = 'function-select';
    functionSelect.className = 'form-input';
    functionSelect.setAttribute('aria-label', 'Select a function');
    functionSelect.setAttribute('aria-describedby', 'function-help');
    functionSelect.required = true;

    // Add function options
    populateFunctionSelect(functionSelect);

    const functionHelp = document.createElement('span');
    functionHelp.id = 'function-help';
    functionHelp.className = 'form-help';
    functionHelp.textContent = 'Choose a scientific function to evaluate';

    functionGroup.appendChild(functionLabel);
    functionGroup.appendChild(functionSelect);
    functionGroup.appendChild(functionHelp);

    // Arguments container (dynamically populated based on function)
    const argsContainer = document.createElement('div');
    argsContainer.id = 'args-container';
    argsContainer.className = 'args-container';

    // Default single argument input
    addArgumentInput(argsContainer, 1, 'x');

    // Help text box
    const helpBox = document.createElement('div');
    helpBox.id = 'function-hint';
    helpBox.className = 'help-box';
    helpBox.setAttribute('aria-live', 'polite');

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary';
    submitButton.textContent = 'Calculate';
    submitButton.setAttribute('aria-label', 'Calculate function result');

    // Assemble form
    form.appendChild(functionGroup);
    form.appendChild(argsContainer);
    form.appendChild(helpBox);
    form.appendChild(submitButton);

    // Create result display element
    const resultElement = document.createElement('div');
    resultElement.id = 'function-result';
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

    // Add event listeners
    functionSelect.addEventListener('change', (e) => handleFunctionChange(e, argsContainer, helpBox));
    form.addEventListener('submit', handleFunctionSubmit);

    return container;
}

/**
 * Populate function select with available functions
 * @param {HTMLSelectElement} selectElement - The select element to populate
 */
function populateFunctionSelect(selectElement) {
    const functions = {
        'Trigonometric': [
            { name: 'sin', label: 'sin(x) - Sine', args: 1 },
            { name: 'cos', label: 'cos(x) - Cosine', args: 1 },
            { name: 'tan', label: 'tan(x) - Tangent', args: 1 },
            { name: 'asin', label: 'asin(x) - Arcsine', args: 1 },
            { name: 'acos', label: 'acos(x) - Arccosine', args: 1 },
            { name: 'atan', label: 'atan(x) - Arctangent', args: 1 },
        ],
        'Logarithmic': [
            { name: 'log10', label: 'log₁₀(x) - Base-10 Logarithm', args: 1 },
            { name: 'ln', label: 'ln(x) - Natural Logarithm', args: 1 },
            { name: 'logn', label: 'logₙ(x, base) - Arbitrary Base Log', args: 2 },
        ],
        'Exponential': [
            { name: 'exp', label: 'e^x - Exponential', args: 1 },
            { name: 'power', label: 'x^y - Power', args: 2 },
            { name: 'sqrt', label: '√x - Square Root', args: 1 },
            { name: 'nthroot', label: 'ⁿ√x - nth Root', args: 2 },
        ],
        'Statistical': [
            { name: 'mean', label: 'mean(data) - Average', args: 'multi' },
            { name: 'median', label: 'median(data) - Median', args: 'multi' },
            { name: 'mode', label: 'mode(data) - Most Frequent', args: 'multi' },
            { name: 'stdev', label: 'stdev(data) - Standard Deviation', args: 'multi' },
            { name: 'variance', label: 'variance(data) - Variance', args: 'multi' },
        ],
    };

    for (const [category, funcList] of Object.entries(functions)) {
        const optgroup = document.createElement('optgroup');
        optgroup.label = category;

        funcList.forEach(func => {
            const option = document.createElement('option');
            option.value = func.name;
            option.textContent = func.label;
            option.dataset.argCount = func.args;
            optgroup.appendChild(option);
        });

        selectElement.appendChild(optgroup);
    }

    // Set default
    selectElement.value = 'sin';
}

/**
 * Handle function selection change
 * @param {Event} event - The change event
 * @param {HTMLElement} argsContainer - The arguments container
 * @param {HTMLElement} helpBox - The help box element
 */
async function handleFunctionChange(event, argsContainer, helpBox) {
    const selectedOption = event.target.options[event.target.selectedIndex];
    const functionName = event.target.value;
    const argCount = selectedOption.dataset.argCount;

    // Clear previous arguments
    argsContainer.innerHTML = '';

    // Add argument inputs based on function type
    if (argCount === 'multi') {
        // Statistical functions - allow multiple inputs
        addArgumentInput(argsContainer, 1, 'Value 1');
        addArgumentInput(argsContainer, 2, 'Value 2');
        const addMoreBtn = document.createElement('button');
        addMoreBtn.type = 'button';
        addMoreBtn.className = 'btn btn-secondary btn-small';
        addMoreBtn.textContent = '+ Add Value';
        addMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const inputs = argsContainer.querySelectorAll('.arg-input');
            addArgumentInput(argsContainer, inputs.length + 1, `Value ${inputs.length + 1}`);
        });
        argsContainer.appendChild(addMoreBtn);
    } else {
        // Fixed-argument functions
        const count = parseInt(argCount, 10);
        const labels = getArgumentLabels(functionName, count);
        for (let i = 1; i <= count; i++) {
            addArgumentInput(argsContainer, i, labels[i - 1] || `Argument ${i}`);
        }
    }

    // Update help text
    try {
        const info = await getFunctionInfo(functionName);
        if (info) {
            helpBox.innerHTML = `
                <div class="hint-content">
                    <strong>${info.name}</strong>
                    <p>${info.description}</p>
                </div>
            `;
        }
    } catch (error) {
        helpBox.textContent = `Function: ${functionName}`;
    }
}

/**
 * Get argument labels for a function
 * @param {string} functionName - The function name
 * @param {number} count - Number of arguments
 * @returns {Array<string>} Array of argument labels
 */
function getArgumentLabels(functionName, count) {
    const labels = {
        'sin': ['Angle (degrees)'],
        'cos': ['Angle (degrees)'],
        'tan': ['Angle (degrees)'],
        'asin': ['Value (-1 to 1)'],
        'acos': ['Value (-1 to 1)'],
        'atan': ['Value'],
        'log10': ['Value (x > 0)'],
        'ln': ['Value (x > 0)'],
        'logn': ['Value (x > 0)', 'Base (> 0, ≠ 1)'],
        'exp': ['Exponent'],
        'power': ['Base', 'Exponent'],
        'sqrt': ['Value (x ≥ 0)'],
        'nthroot': ['Value', 'Root Degree'],
    };

    return labels[functionName] || Array.from({ length: count }, (_, i) => `Argument ${i + 1}`);
}

/**
 * Add an argument input field
 * @param {HTMLElement} container - The container to add to
 * @param {number} index - The argument index
 * @param {string} label - The label for the argument
 */
function addArgumentInput(container, index, label) {
    const group = document.createElement('div');
    group.className = 'form-group arg-input';

    const inputLabel = document.createElement('label');
    inputLabel.htmlFor = `arg-${index}`;
    inputLabel.textContent = label;
    inputLabel.className = 'form-label';

    const input = document.createElement('input');
    input.id = `arg-${index}`;
    input.type = 'text';
    input.className = 'form-input';
    input.placeholder = `Enter ${label.toLowerCase()}`;
    input.setAttribute('aria-label', label);
    input.required = true;

    group.appendChild(inputLabel);
    group.appendChild(input);
    container.appendChild(group);
}

/**
 * Handle form submission
 * @param {Event} event - The form submission event
 */
async function handleFunctionSubmit(event) {
    event.preventDefault();

    const functionName = document.getElementById('function-select').value;
    const argInputs = document.querySelectorAll('.arg-input input');
    const args = Array.from(argInputs).map(input => {
        const value = input.value.trim();
        // Try to parse as number, otherwise keep as string
        const num = parseFloat(value);
        return !isNaN(num) ? num : value;
    });

    if (args.length === 0) {
        showFunctionError('Please enter at least one argument');
        return;
    }

    try {
        const result = await evaluateFunction(functionName, args);
        displayFunctionResult(result, functionName, args);
    } catch (error) {
        showFunctionError(`Error: ${error.message}`);
    }
}

/**
 * Evaluate a function using the backend API
 * @param {string} functionName - The function name
 * @param {Array} args - The function arguments
 * @returns {Promise<number>} The function result
 */
async function evaluateFunction(functionName, args) {
    // For statistical functions with multiple args, pass as array
    const isStatistical = ['mean', 'median', 'mode', 'stdev', 'variance'].includes(functionName);
    const payload = isStatistical ? args : args;

    const response = await fetch('/api/functions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            function: functionName,
            arguments: payload,
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
 * Display function result
 * @param {number} result - The result value
 * @param {string} functionName - The function name
 * @param {Array} args - The function arguments
 */
function displayFunctionResult(result, functionName, args) {
    const resultElement = document.getElementById('function-result');
    if (resultElement) {
        const argsStr = args.map(a => {
            if (typeof a === 'number') {
                return a.toFixed(6).replace(/\.?0+$/, '');
            }
            return a;
        }).join(', ');

        const resultText = formatResult(result);

        resultElement.innerHTML = `
            <div class="result-content">
                <p class="result-label">${functionName}(${argsStr})</p>
                <p class="result-value">${resultText}</p>
                <button class="btn btn-secondary" id="copy-function-result-btn">
                    Copy Result
                </button>
            </div>
        `;
        resultElement.removeAttribute('aria-hidden');

        // Attach copy button handler
        const copyBtn = document.getElementById('copy-function-result-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(resultText).then(() => {
                    announceToScreenReader('Result copied to clipboard');
                }).catch(err => {
                    showFunctionError('Failed to copy to clipboard');
                });
            });
        }

        // Announce result to screen readers
        announceToScreenReader(`Function result: ${functionName} of ${argsStr} equals ${resultText}`);
    }
}

/**
 * Format result for display
 * @param {number} result - The result value
 * @returns {string} Formatted result
 */
function formatResult(result) {
    // Handle special cases
    if (result === Infinity) return '∞';
    if (result === -Infinity) return '-∞';
    if (isNaN(result)) return 'NaN';

    // Format with appropriate precision
    if (Math.abs(result) < 0.0001 && result !== 0) {
        return result.toExponential(6);
    }
    if (Math.abs(result) > 1e10) {
        return result.toExponential(6);
    }

    return result.toFixed(6).replace(/\.?0+$/, '');
}

/**
 * Show a function error
 * @param {string} message - The error message
 */
function showFunctionError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        errorElement.removeAttribute('aria-hidden');
        announceToScreenReader(`Error: ${message}`);
    }
}


/**
 * Get function information from the backend
 * @param {string} functionName - The function name
 * @returns {Promise<Object>} Function information
 */
async function getFunctionInfo(functionName) {
    try {
        const response = await fetch(`/api/functions/${functionName}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch function info:', error);
        return null;
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


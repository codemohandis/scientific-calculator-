/**
 * StatisticalInput component for entering datasets for statistical functions.
 *
 * Supports multiple input methods: individual values, comma-separated, space-separated, or CSV.
 */

/**
 * Create and render the statistical input form
 * @returns {HTMLElement} The form element
 */
function createStatisticalInput() {
    const form = document.createElement('form');
    form.id = 'statistical-form';
    form.className = 'statistical-form';
    form.setAttribute('aria-label', 'Statistical dataset input form');

    // Input method tabs
    const methodTabs = document.createElement('div');
    methodTabs.className = 'input-method-tabs';
    methodTabs.setAttribute('role', 'tablist');

    const methods = ['Individual Values', 'Comma-separated', 'CSV Upload'];
    methods.forEach((method, index) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'method-tab';
        if (index === 0) tab.classList.add('active');
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', index === 0);
        tab.setAttribute('aria-controls', `method-${index}`);
        tab.textContent = method;
        tab.addEventListener('click', (e) => switchInputMethod(e, index));
        methodTabs.appendChild(tab);
    });

    form.appendChild(methodTabs);

    // Method 0: Individual Values
    const method0 = document.createElement('div');
    method0.id = 'method-0';
    method0.className = 'method-panel active';
    method0.setAttribute('role', 'tabpanel');

    const addValueBtn = document.createElement('button');
    addValueBtn.type = 'button';
    addValueBtn.className = 'btn btn-secondary btn-small';
    addValueBtn.textContent = '+ Add Value';
    addValueBtn.setAttribute('aria-label', 'Add a new value field');
    addValueBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addIndividualValueInput(method0);
    });

    const valuesList = document.createElement('div');
    valuesList.id = 'values-list';
    valuesList.className = 'values-list';

    // Add initial value inputs
    addIndividualValueInput(valuesList);
    addIndividualValueInput(valuesList);

    method0.appendChild(valuesList);
    method0.appendChild(addValueBtn);

    // Method 1: Comma-separated
    const method1 = document.createElement('div');
    method1.id = 'method-1';
    method1.className = 'method-panel';
    method1.setAttribute('role', 'tabpanel');

    const csvLabel = document.createElement('label');
    csvLabel.htmlFor = 'csv-input';
    csvLabel.textContent = 'Enter values (separated by commas or spaces):';
    csvLabel.className = 'form-label';

    const csvInput = document.createElement('textarea');
    csvInput.id = 'csv-input';
    csvInput.className = 'form-input textarea-input';
    csvInput.placeholder = 'e.g., 1, 2, 3, 4, 5 or 10 20 30 40';
    csvInput.setAttribute('aria-label', 'Dataset values');
    csvInput.setAttribute('aria-describedby', 'csv-help');
    csvInput.rows = '6';

    const csvHelp = document.createElement('span');
    csvHelp.id = 'csv-help';
    csvHelp.className = 'form-help';
    csvHelp.textContent = 'Separate values with commas or spaces. One or multiple rows are accepted.';

    method1.appendChild(csvLabel);
    method1.appendChild(csvInput);
    method1.appendChild(csvHelp);

    // Method 2: File Upload
    const method2 = document.createElement('div');
    method2.id = 'method-2';
    method2.className = 'method-panel';
    method2.setAttribute('role', 'tabpanel');

    const fileLabel = document.createElement('label');
    fileLabel.htmlFor = 'file-input';
    fileLabel.textContent = 'Upload CSV file:';
    fileLabel.className = 'form-label';

    const fileInput = document.createElement('input');
    fileInput.id = 'file-input';
    fileInput.type = 'file';
    fileInput.accept = '.csv,.txt';
    fileInput.className = 'form-input file-input';
    fileInput.setAttribute('aria-label', 'CSV or text file');
    fileInput.setAttribute('aria-describedby', 'file-help');
    fileInput.addEventListener('change', handleFileSelect);

    const fileHelp = document.createElement('span');
    fileHelp.id = 'file-help';
    fileHelp.className = 'form-help';
    fileHelp.textContent = 'Upload a CSV or text file with values separated by commas or newlines.';

    const filePreview = document.createElement('div');
    filePreview.id = 'file-preview';
    filePreview.className = 'file-preview';
    filePreview.setAttribute('aria-live', 'polite');

    method2.appendChild(fileLabel);
    method2.appendChild(fileInput);
    method2.appendChild(fileHelp);
    method2.appendChild(filePreview);

    // Add all method panels to form
    form.appendChild(method0);
    form.appendChild(method1);
    form.appendChild(method2);

    // Function selector group
    const functionGroup = document.createElement('div');
    functionGroup.className = 'form-group';

    const functionLabel = document.createElement('label');
    functionLabel.htmlFor = 'stat-function-select';
    functionLabel.textContent = 'Statistical Function';
    functionLabel.className = 'form-label';

    const functionSelect = document.createElement('select');
    functionSelect.id = 'stat-function-select';
    functionSelect.className = 'form-input';
    functionSelect.setAttribute('aria-label', 'Select a statistical function');

    const functions = ['mean', 'median', 'mode', 'stdev', 'variance'];
    functions.forEach(func => {
        const option = document.createElement('option');
        option.value = func;
        option.textContent = func.charAt(0).toUpperCase() + func.slice(1);
        functionSelect.appendChild(option);
    });

    functionGroup.appendChild(functionLabel);
    functionGroup.appendChild(functionSelect);

    // Submit button
    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.className = 'btn btn-primary';
    submitButton.textContent = 'Calculate';
    submitButton.setAttribute('aria-label', 'Calculate statistical function');

    form.appendChild(functionGroup);
    form.appendChild(submitButton);

    // Add form submission handler
    form.addEventListener('submit', handleStatisticalSubmit);

    return form;
}

/**
 * Add an individual value input field
 * @param {HTMLElement} container - The container to add to
 */
function addIndividualValueInput(container) {
    const group = document.createElement('div');
    group.className = 'value-input-group';

    const label = document.createElement('label');
    const inputCount = container.querySelectorAll('input').length + 1;
    label.htmlFor = `value-${inputCount}`;
    label.textContent = `Value ${inputCount}`;

    const input = document.createElement('input');
    input.id = `value-${inputCount}`;
    input.type = 'number';
    input.step = 'any';
    input.placeholder = 'Enter a number';
    input.className = 'form-input';
    input.setAttribute('aria-label', `Value ${inputCount}`);
    input.required = true;

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'btn btn-small btn-danger';
    removeBtn.textContent = '✕';
    removeBtn.setAttribute('aria-label', `Remove value ${inputCount}`);
    removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (container.querySelectorAll('input').length > 1) {
            group.remove();
        }
    });

    group.appendChild(label);
    group.appendChild(input);
    group.appendChild(removeBtn);
    container.appendChild(group);
}

/**
 * Switch input method
 * @param {Event} event - The click event
 * @param {number} methodIndex - The method index
 */
function switchInputMethod(event, methodIndex) {
    // Update tab states
    const tabs = document.querySelectorAll('.method-tab');
    tabs.forEach((tab, index) => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });

    event.target.classList.add('active');
    event.target.setAttribute('aria-selected', 'true');

    // Update panel visibility
    const panels = document.querySelectorAll('.method-panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`method-${methodIndex}`);
    if (activePanel) {
        activePanel.classList.add('active');
    }

    const methodNames = ['Individual Values', 'Comma-separated', 'CSV Upload'];
    announceToScreenReader(`${methodNames[methodIndex]} input method selected`);
}

/**
 * Handle file selection
 * @param {Event} event - The file input change event
 */
function handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const content = e.target.result;
        const preview = document.getElementById('file-preview');

        // Parse file content
        const values = parseFileContent(content);

        // Display preview
        preview.innerHTML = `
            <div class="preview-info">
                <p><strong>File:</strong> ${file.name}</p>
                <p><strong>Values found:</strong> ${values.length}</p>
                <p><strong>Preview:</strong> ${values.slice(0, 5).join(', ')}${values.length > 5 ? '...' : ''}</p>
            </div>
        `;

        // Store values for later use
        event.target._parsedValues = values;

        announceToScreenReader(`File loaded: ${values.length} values found`);
    };

    reader.readAsText(file);
}

/**
 * Parse file content to extract numerical values
 * @param {string} content - The file content
 * @returns {Array<number>} Array of parsed values
 */
function parseFileContent(content) {
    // Remove whitespace and split
    const lines = content.split('\n');
    const values = [];

    lines.forEach(line => {
        // Split by comma or whitespace
        const parts = line.replace(/,/g, ' ').split(/\s+/).filter(p => p);

        parts.forEach(part => {
            const num = parseFloat(part);
            if (!isNaN(num)) {
                values.push(num);
            }
        });
    });

    return values;
}

/**
 * Get values from the current input method
 * @returns {Array<number>} Array of values
 */
function getInputValues() {
    // Find active method panel
    const activePanel = document.querySelector('.method-panel.active');
    if (!activePanel) return [];

    const methodId = activePanel.id;

    if (methodId === 'method-0') {
        // Individual values
        const inputs = activePanel.querySelectorAll('input[type="number"]');
        return Array.from(inputs)
            .map(input => parseFloat(input.value))
            .filter(val => !isNaN(val));
    } else if (methodId === 'method-1') {
        // Comma/space-separated
        const textarea = document.getElementById('csv-input');
        const content = textarea.value;
        return parseFileContent(content);
    } else if (methodId === 'method-2') {
        // File upload
        const fileInput = document.getElementById('file-input');
        return fileInput._parsedValues || [];
    }

    return [];
}

/**
 * Handle form submission
 * @param {Event} event - The form submission event
 */
async function handleStatisticalSubmit(event) {
    event.preventDefault();

    const values = getInputValues();
    const functionName = document.getElementById('stat-function-select').value;

    if (values.length === 0) {
        showStatError('Please enter at least one value');
        return;
    }

    if ((functionName === 'stdev' || functionName === 'variance') && values.length < 2) {
        showStatError(`${functionName} requires at least 2 values`);
        return;
    }

    try {
        const result = await evaluateStatisticalFunction(functionName, values);
        displayStatisticalResult(result, functionName, values);
    } catch (error) {
        showStatError(`Error: ${error.message}`);
    }
}

/**
 * Evaluate a statistical function
 * @param {string} functionName - The function name
 * @param {Array<number>} values - The dataset
 * @returns {Promise<number>} The result
 */
async function evaluateStatisticalFunction(functionName, values) {
    const response = await fetch('/api/functions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            function: functionName,
            arguments: [values],
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
 * Display statistical result
 * @param {number} result - The result
 * @param {string} functionName - The function name
 * @param {Array<number>} values - The dataset
 */
function displayStatisticalResult(result, functionName, values) {
    const resultElement = document.getElementById('function-result');
    if (!resultElement) return;

    const summary = `${functionName}([${values.slice(0, 3).join(', ')}${values.length > 3 ? ', ...' : ''}])`;

    resultElement.innerHTML = `
        <div class="result-content">
            <p class="result-label">${summary}</p>
            <p class="result-value">${formatStatisticalResult(result)}</p>
            <p class="result-stats">
                <small>
                    n = ${values.length} |
                    min = ${Math.min(...values)} |
                    max = ${Math.max(...values)} |
                    sum = ${values.reduce((a, b) => a + b, 0).toFixed(2)}
                </small>
            </p>
            <button class="btn btn-secondary" onclick="copyStatisticalResult('${result}')">
                Copy Result
            </button>
        </div>
    `;
    resultElement.removeAttribute('aria-hidden');

    announceToScreenReader(`Statistical calculation: ${functionName} = ${formatStatisticalResult(result)}`);
}

/**
 * Format statistical result
 * @param {number} result - The result
 * @returns {string} Formatted result
 */
function formatStatisticalResult(result) {
    if (isNaN(result)) return 'NaN';
    if (result === Infinity) return '∞';
    if (result === -Infinity) return '-∞';

    return result.toFixed(6).replace(/\.?0+$/, '');
}

/**
 * Copy statistical result to clipboard
 * @param {number} result - The result to copy
 */
function copyStatisticalResult(result) {
    navigator.clipboard.writeText(result).then(() => {
        announceToScreenReader('Result copied to clipboard');
    }).catch(() => {
        showStatError('Failed to copy to clipboard');
    });
}

/**
 * Show a statistical error
 * @param {string} message - The error message
 */
function showStatError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.setAttribute('role', 'alert');
        errorElement.removeAttribute('aria-hidden');
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

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createStatisticalInput,
        addIndividualValueInput,
        switchInputMethod,
        handleFileSelect,
        parseFileContent,
        getInputValues,
        handleStatisticalSubmit,
        evaluateStatisticalFunction,
        displayStatisticalResult,
        formatStatisticalResult,
        copyStatisticalResult,
        showStatError,
        announceToScreenReader,
    };
}

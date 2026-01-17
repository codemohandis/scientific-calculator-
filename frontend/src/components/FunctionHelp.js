/**
 * FunctionHelp component for displaying function reference and examples.
 *
 * Shows available functions, parameters, examples, and usage guidelines.
 */

/**
 * Create and render the function help panel
 * @returns {HTMLElement} The help panel element
 */
function createFunctionHelp() {
    const container = document.createElement('div');
    container.id = 'function-help';
    container.className = 'function-help';
    container.setAttribute('aria-label', 'Function reference guide');

    const header = document.createElement('h2');
    header.textContent = 'Function Reference';
    header.className = 'help-header';

    const tabs = document.createElement('div');
    tabs.className = 'help-tabs';
    tabs.setAttribute('role', 'tablist');

    const categories = ['Trigonometric', 'Logarithmic', 'Exponential', 'Statistical'];

    categories.forEach((category, index) => {
        const tab = document.createElement('button');
        tab.type = 'button';
        tab.className = 'help-tab';
        if (index === 0) tab.classList.add('active');
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', index === 0);
        tab.setAttribute('aria-controls', `help-${category.toLowerCase()}`);
        tab.textContent = category;
        tab.addEventListener('click', (e) => switchHelpTab(e, category.toLowerCase()));
        tabs.appendChild(tab);
    });

    const content = document.createElement('div');
    content.className = 'help-content';

    // Add content for each category
    categories.forEach((category, index) => {
        const panel = document.createElement('div');
        panel.id = `help-${category.toLowerCase()}`;
        panel.className = 'help-panel';
        panel.setAttribute('role', 'tabpanel');
        if (index === 0) {
            panel.classList.add('active');
        }

        const funcList = getFunctionList(category.toLowerCase());
        funcList.forEach(func => {
            const funcElement = createFunctionHelpItem(func);
            panel.appendChild(funcElement);
        });

        content.appendChild(panel);
    });

    container.appendChild(header);
    container.appendChild(tabs);
    container.appendChild(content);

    return container;
}

/**
 * Get function list for a category
 * @param {string} category - The category name
 * @returns {Array<Object>} Array of function definitions
 */
function getFunctionList(category) {
    const functions = {
        'trigonometric': [
            {
                name: 'sin',
                description: 'Sine function',
                syntax: 'sin(x)',
                params: [{ name: 'x', desc: 'Angle in degrees' }],
                range: '[-1, 1]',
                examples: ['sin(30) = 0.5', 'sin(90) = 1', 'sin(45) ≈ 0.707'],
            },
            {
                name: 'cos',
                description: 'Cosine function',
                syntax: 'cos(x)',
                params: [{ name: 'x', desc: 'Angle in degrees' }],
                range: '[-1, 1]',
                examples: ['cos(0) = 1', 'cos(60) = 0.5', 'cos(90) = 0'],
            },
            {
                name: 'tan',
                description: 'Tangent function',
                syntax: 'tan(x)',
                params: [{ name: 'x', desc: 'Angle in degrees' }],
                range: '(-∞, ∞)',
                examples: ['tan(0) = 0', 'tan(45) = 1', 'tan(30) ≈ 0.577'],
            },
            {
                name: 'asin',
                description: 'Inverse sine (arcsine)',
                syntax: 'asin(x)',
                params: [{ name: 'x', desc: 'Value between -1 and 1' }],
                range: '[-90°, 90°]',
                examples: ['asin(0) = 0°', 'asin(0.5) = 30°', 'asin(1) = 90°'],
            },
            {
                name: 'acos',
                description: 'Inverse cosine (arccosine)',
                syntax: 'acos(x)',
                params: [{ name: 'x', desc: 'Value between -1 and 1' }],
                range: '[0°, 180°]',
                examples: ['acos(1) = 0°', 'acos(0.5) = 60°', 'acos(0) = 90°'],
            },
            {
                name: 'atan',
                description: 'Inverse tangent (arctangent)',
                syntax: 'atan(x)',
                params: [{ name: 'x', desc: 'Any real number' }],
                range: '(-90°, 90°)',
                examples: ['atan(0) = 0°', 'atan(1) = 45°', 'atan(-1) = -45°'],
            },
        ],
        'logarithmic': [
            {
                name: 'log10',
                description: 'Base-10 logarithm',
                syntax: 'log₁₀(x)',
                params: [{ name: 'x', desc: 'Positive number (x > 0)' }],
                range: '(-∞, ∞)',
                examples: ['log₁₀(1) = 0', 'log₁₀(10) = 1', 'log₁₀(100) = 2'],
            },
            {
                name: 'ln',
                description: 'Natural logarithm (base e)',
                syntax: 'ln(x)',
                params: [{ name: 'x', desc: 'Positive number (x > 0)' }],
                range: '(-∞, ∞)',
                examples: ['ln(1) = 0', 'ln(e) = 1', 'ln(e²) = 2'],
            },
            {
                name: 'logn',
                description: 'Logarithm with arbitrary base',
                syntax: 'logₙ(x, base)',
                params: [
                    { name: 'x', desc: 'Positive number (x > 0)' },
                    { name: 'base', desc: 'Base (> 0, ≠ 1)' },
                ],
                range: '(-∞, ∞)',
                examples: ['log₂(8) = 3', 'log₃(27) = 3', 'log₅(125) = 3'],
            },
        ],
        'exponential': [
            {
                name: 'exp',
                description: 'Exponential function (e^x)',
                syntax: 'exp(x)',
                params: [{ name: 'x', desc: 'Any real number' }],
                range: '(0, ∞)',
                examples: ['exp(0) = 1', 'exp(1) ≈ 2.718', 'exp(2) ≈ 7.389'],
            },
            {
                name: 'power',
                description: 'Power function (x^y)',
                syntax: 'power(x, y)',
                params: [
                    { name: 'x', desc: 'Base number' },
                    { name: 'y', desc: 'Exponent' },
                ],
                range: 'Depends on inputs',
                examples: ['power(2, 3) = 8', 'power(5, -1) = 0.2', 'power(4, 0.5) = 2'],
            },
            {
                name: 'sqrt',
                description: 'Square root',
                syntax: '√x',
                params: [{ name: 'x', desc: 'Non-negative number (x ≥ 0)' }],
                range: '[0, ∞)',
                examples: ['√4 = 2', '√9 = 3', '√2 ≈ 1.414'],
            },
            {
                name: 'nthroot',
                description: 'Nth root',
                syntax: 'ⁿ√x',
                params: [
                    { name: 'x', desc: 'Real number' },
                    { name: 'n', desc: 'Root degree (positive integer)' },
                ],
                range: 'Depends on inputs',
                examples: ['³√8 = 2', '⁴√16 = 2', '⁵√32 = 2'],
            },
        ],
        'statistical': [
            {
                name: 'mean',
                description: 'Arithmetic mean (average)',
                syntax: 'mean(x₁, x₂, ...)',
                params: [{ name: 'values', desc: 'Two or more numbers' }],
                range: 'Same as input range',
                examples: ['mean(1, 2, 3, 4, 5) = 3', 'mean(10, 20) = 15'],
            },
            {
                name: 'median',
                description: 'Median (middle value)',
                syntax: 'median(x₁, x₂, ...)',
                params: [{ name: 'values', desc: 'One or more numbers' }],
                range: 'Same as input values',
                examples: ['median(1, 2, 3) = 2', 'median(1, 2, 3, 4) = 2.5'],
            },
            {
                name: 'mode',
                description: 'Mode (most frequent value)',
                syntax: 'mode(x₁, x₂, ...)',
                params: [{ name: 'values', desc: 'One or more numbers' }],
                range: 'One of the input values',
                examples: ['mode(1, 1, 2, 3) = 1', 'mode(5, 5, 5) = 5'],
            },
            {
                name: 'stdev',
                description: 'Sample standard deviation',
                syntax: 'stdev(x₁, x₂, ...)',
                params: [{ name: 'values', desc: 'Two or more numbers' }],
                range: '[0, ∞)',
                examples: ['stdev(1, 2, 3, 4, 5) ≈ 1.581', 'stdev(5, 5, 5) = 0'],
            },
            {
                name: 'variance',
                description: 'Sample variance',
                syntax: 'variance(x₁, x₂, ...)',
                params: [{ name: 'values', desc: 'Two or more numbers' }],
                range: '[0, ∞)',
                examples: ['variance(1, 2, 3, 4, 5) = 2.5', 'variance(1, 3) = 2'],
            },
        ],
    };

    return functions[category] || [];
}

/**
 * Create a single function help item
 * @param {Object} func - Function definition
 * @returns {HTMLElement} Function help element
 */
function createFunctionHelpItem(func) {
    const container = document.createElement('div');
    container.className = 'function-help-item';

    const nameElement = document.createElement('h3');
    nameElement.className = 'function-name';
    nameElement.textContent = `${func.name}()`;

    const descElement = document.createElement('p');
    descElement.className = 'function-desc';
    descElement.textContent = func.description;

    const syntaxElement = document.createElement('div');
    syntaxElement.className = 'function-syntax';
    const syntaxLabel = document.createElement('strong');
    syntaxLabel.textContent = 'Syntax: ';
    const syntaxCode = document.createElement('code');
    syntaxCode.textContent = func.syntax;
    syntaxElement.appendChild(syntaxLabel);
    syntaxElement.appendChild(syntaxCode);

    const paramsElement = document.createElement('div');
    paramsElement.className = 'function-params';
    const paramsLabel = document.createElement('strong');
    paramsLabel.textContent = 'Parameters:';
    paramsElement.appendChild(paramsLabel);

    const paramsList = document.createElement('ul');
    func.params.forEach(param => {
        const li = document.createElement('li');
        li.innerHTML = `<code>${param.name}</code> - ${param.desc}`;
        paramsList.appendChild(li);
    });
    paramsElement.appendChild(paramsList);

    const rangeElement = document.createElement('p');
    rangeElement.className = 'function-range';
    rangeElement.innerHTML = `<strong>Output range:</strong> ${func.range}`;

    const examplesElement = document.createElement('div');
    examplesElement.className = 'function-examples';
    const examplesLabel = document.createElement('strong');
    examplesLabel.textContent = 'Examples:';
    examplesElement.appendChild(examplesLabel);

    const examplesList = document.createElement('ul');
    func.examples.forEach(example => {
        const li = document.createElement('li');
        li.textContent = example;
        examplesList.appendChild(li);
    });
    examplesElement.appendChild(examplesList);

    container.appendChild(nameElement);
    container.appendChild(descElement);
    container.appendChild(syntaxElement);
    container.appendChild(paramsElement);
    container.appendChild(rangeElement);
    container.appendChild(examplesElement);

    return container;
}

/**
 * Switch help tab
 * @param {Event} event - The click event
 * @param {string} category - The category to show
 */
function switchHelpTab(event, category) {
    // Update tab states
    const tabs = document.querySelectorAll('.help-tab');
    tabs.forEach(tab => {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
    });

    event.target.classList.add('active');
    event.target.setAttribute('aria-selected', 'true');

    // Update panel visibility
    const panels = document.querySelectorAll('.help-panel');
    panels.forEach(panel => {
        panel.classList.remove('active');
    });

    const activePanel = document.getElementById(`help-${category}`);
    if (activePanel) {
        activePanel.classList.add('active');
    }

    // Announce to screen readers
    const categoryName = event.target.textContent;
    const announcement = document.getElementById('sr-announcement');
    if (announcement) {
        announcement.textContent = `${categoryName} functions reference displayed`;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        createFunctionHelp,
        getFunctionList,
        createFunctionHelpItem,
        switchHelpTab,
    };
}

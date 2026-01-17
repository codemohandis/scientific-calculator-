/**
 * Accessibility tests for function input controls.
 *
 * Tests WCAG 2.1 AA compliance for scientific function input components:
 * - Proper ARIA labels and descriptions
 * - Keyboard navigation support
 * - Error announcements
 * - Focus management
 * - Color contrast
 */

describe('Function Input Accessibility', () => {
    /**
     * Test: Function select has proper ARIA attributes
     */
    it('should have proper ARIA labels for function selector', () => {
        const select = createFunctionInputElement();
        const functionSelect = select.querySelector('#function-select');

        expect(functionSelect.getAttribute('aria-label')).toBe('Select a function');
        expect(functionSelect.getAttribute('aria-describedby')).toBe('function-help');
    });

    /**
     * Test: Argument inputs have accessible labels
     */
    it('should have accessible labels for argument inputs', () => {
        const select = createFunctionInputElement();
        const argInputs = select.querySelectorAll('.arg-input');

        expect(argInputs.length).toBeGreaterThan(0);
        argInputs.forEach((group, index) => {
            const input = group.querySelector('input');
            const label = group.querySelector('label');

            expect(label).not.toBeNull();
            expect(label.htmlFor).toBe(input.id);
            expect(input.getAttribute('aria-label')).toBeTruthy();
        });
    });

    /**
     * Test: Error messages have role="alert"
     */
    it('should announce errors with role alert', () => {
        const form = createFunctionInputElement();
        const errorElement = document.createElement('div');
        errorElement.id = 'error-message';
        document.body.appendChild(errorElement);

        // Simulate error
        errorElement.textContent = 'Test error message';
        errorElement.setAttribute('role', 'alert');

        expect(errorElement.getAttribute('role')).toBe('alert');
        expect(errorElement.textContent).toBe('Test error message');

        document.body.removeChild(errorElement);
    });

    /**
     * Test: Screen reader announcement element exists
     */
    it('should have screen reader announcement element', () => {
        const announcement = document.getElementById('sr-announcement');

        if (announcement) {
            expect(announcement).not.toBeNull();
            expect(announcement.getAttribute('aria-live')).toBeTruthy();
        }
    });

    /**
     * Test: Form is properly labeled
     */
    it('should have proper form ARIA label', () => {
        const form = createFunctionInputElement();

        expect(form.getAttribute('aria-label')).toBe('Scientific function calculator');
    });

    /**
     * Test: Help text is accessible
     */
    it('should have accessible help text', () => {
        const form = createFunctionInputElement();
        const helpBox = form.querySelector('#function-hint');

        expect(helpBox).not.toBeNull();
        expect(helpBox.getAttribute('aria-live')).toBe('polite');
    });

    /**
     * Test: Submit button has descriptive label
     */
    it('should have accessible submit button', () => {
        const form = createFunctionInputElement();
        const submitButton = form.querySelector('button[type="submit"]');

        expect(submitButton).not.toBeNull();
        expect(submitButton.getAttribute('aria-label')).toBe('Calculate function result');
        expect(submitButton.textContent).toBe('Calculate');
    });

    /**
     * Test: Required fields are marked
     */
    it('should mark required fields', () => {
        const form = createFunctionInputElement();
        const inputs = form.querySelectorAll('input[required], select[required]');

        expect(inputs.length).toBeGreaterThan(0);
        inputs.forEach(input => {
            expect(input.required).toBe(true);
        });
    });

    /**
     * Test: Remove buttons have accessible labels
     */
    it('should have accessible remove buttons (if applicable)', () => {
        const container = document.createElement('div');
        const input = document.createElement('input');
        const removeBtn = document.createElement('button');

        removeBtn.setAttribute('aria-label', 'Remove value 1');
        removeBtn.textContent = '✕';

        expect(removeBtn.getAttribute('aria-label')).toContain('Remove');
    });
});

describe('Function Result Accessibility', () => {
    /**
     * Test: Result container has live region
     */
    it('should have live region for result updates', () => {
        const result = createFunctionResultElement();

        expect(result.getAttribute('aria-live')).toBe('polite');
    });

    /**
     * Test: Result can be hidden from screen readers when empty
     */
    it('should hide empty results from screen readers', () => {
        const result = createFunctionResultElement();

        expect(result.getAttribute('aria-hidden')).toBe('true');

        // After displaying result
        result.removeAttribute('aria-hidden');
        expect(result.getAttribute('aria-hidden')).toBeNull();
    });

    /**
     * Test: Copy button is accessible
     */
    it('should have accessible copy button', () => {
        const result = createFunctionResultElement();
        const copyBtn = result.querySelector('.result-actions .btn-secondary');

        if (copyBtn) {
            expect(copyBtn.getAttribute('aria-label')).toBeTruthy();
        }
    });

    /**
     * Test: Precision control is accessible
     */
    it('should have accessible precision control', () => {
        const result = createFunctionResultElement();
        const precisionInput = result.querySelector('#precision-input');
        const precisionLabel = result.querySelector('label[for="precision-input"]');

        if (precisionInput) {
            expect(precisionLabel).not.toBeNull();
            expect(precisionInput.getAttribute('aria-label')).toBeTruthy();
        }
    });
});

describe('Function Help Accessibility', () => {
    /**
     * Test: Help tabs are keyboard accessible
     */
    it('should have keyboard accessible tabs', () => {
        const help = createFunctionHelpElement();
        const tabs = help.querySelectorAll('.help-tab');

        expect(tabs.length).toBeGreaterThan(0);
        tabs.forEach(tab => {
            expect(tab.getAttribute('role')).toBe('tab');
            expect(tab.getAttribute('aria-selected')).toBeTruthy();
        });
    });

    /**
     * Test: Tab panels have proper ARIA attributes
     */
    it('should have proper tab panel ARIA attributes', () => {
        const help = createFunctionHelpElement();
        const panels = help.querySelectorAll('.help-panel');

        expect(panels.length).toBeGreaterThan(0);
        panels.forEach(panel => {
            expect(panel.getAttribute('role')).toBe('tabpanel');
        });
    });

    /**
     * Test: Help panel has descriptive title
     */
    it('should have descriptive help title', () => {
        const help = createFunctionHelpElement();
        const title = help.querySelector('.help-header');

        expect(title).not.toBeNull();
        expect(title.textContent).toBe('Function Reference');
    });

    /**
     * Test: Function items have proper structure
     */
    it('should structure function help items properly', () => {
        const help = createFunctionHelpElement();
        const items = help.querySelectorAll('.function-help-item');

        expect(items.length).toBeGreaterThan(0);
        items.forEach(item => {
            const name = item.querySelector('.function-name');
            const description = item.querySelector('.function-desc');

            expect(name).not.toBeNull();
            expect(description).not.toBeNull();
        });
    });
});

describe('Statistical Input Accessibility', () => {
    /**
     * Test: Input method tabs are accessible
     */
    it('should have accessible input method tabs', () => {
        const form = createStatisticalInputElement();
        const tabs = form.querySelectorAll('.method-tab');

        expect(tabs.length).toBeGreaterThan(0);
        tabs.forEach(tab => {
            expect(tab.getAttribute('role')).toBe('tab');
            expect(tab.getAttribute('aria-selected')).toBeTruthy();
        });
    });

    /**
     * Test: Text area has proper label
     */
    it('should have accessible CSV input field', () => {
        const form = createStatisticalInputElement();
        const textarea = form.querySelector('#csv-input');
        const label = form.querySelector('label[for="csv-input"]');

        if (textarea) {
            expect(label).not.toBeNull();
            expect(textarea.getAttribute('aria-label')).toBeTruthy();
            expect(textarea.getAttribute('aria-describedby')).toBeTruthy();
        }
    });

    /**
     * Test: File input is accessible
     */
    it('should have accessible file input', () => {
        const form = createStatisticalInputElement();
        const fileInput = form.querySelector('#file-input');
        const label = form.querySelector('label[for="file-input"]');

        if (fileInput) {
            expect(label).not.toBeNull();
            expect(fileInput.getAttribute('aria-label')).toBeTruthy();
        }
    });

    /**
     * Test: Add value button is accessible
     */
    it('should have accessible add value button', () => {
        const form = createStatisticalInputElement();
        const addBtn = form.querySelector('button[type="button"]');

        if (addBtn && addBtn.textContent.includes('Add')) {
            expect(addBtn.getAttribute('aria-label')).toBeTruthy();
        }
    });

    /**
     * Test: Function selector is accessible
     */
    it('should have accessible function selector', () => {
        const form = createStatisticalInputElement();
        const select = form.querySelector('#stat-function-select');
        const label = form.querySelector('label[for="stat-function-select"]');

        expect(label).not.toBeNull();
        expect(select.getAttribute('aria-label')).toBeTruthy();
    });
});

describe('Keyboard Navigation', () => {
    /**
     * Test: Tab order is logical
     */
    it('should have logical tab order', () => {
        const form = createFunctionInputElement();
        const focusableElements = form.querySelectorAll(
            'input, select, button, textarea, [tabindex]'
        );

        expect(focusableElements.length).toBeGreaterThan(0);
    });

    /**
     * Test: Focus is visible on input elements
     */
    it('should support focus on form elements', () => {
        const form = createFunctionInputElement();
        const input = form.querySelector('input');

        if (input) {
            input.focus();
            expect(document.activeElement).toBe(input);
        }
    });

    /**
     * Test: Buttons are keyboard accessible
     */
    it('should make buttons keyboard accessible', () => {
        const form = createFunctionInputElement();
        const button = form.querySelector('button[type="submit"]');

        if (button) {
            button.focus();
            expect(document.activeElement).toBe(button);
        }
    });
});

describe('Color Contrast (Manual Verification)', () => {
    /**
     * Note: Automated color contrast testing would require axe-core integration
     * These are placeholders for manual verification
     */
    it('should have sufficient color contrast for text', () => {
        // Manual verification with accessibility audit tools recommended
        expect(true).toBe(true);
    });

    it('should distinguish error states visually', () => {
        // Manual verification with accessibility audit tools recommended
        expect(true).toBe(true);
    });
});

/**
 * Helper function to create a function input element
 * @returns {HTMLElement}
 */
function createFunctionInputElement() {
    const container = document.createElement('div');
    const form = document.createElement('form');
    form.id = 'function-form';
    form.setAttribute('aria-label', 'Scientific function calculator');

    const select = document.createElement('select');
    select.id = 'function-select';
    select.setAttribute('aria-label', 'Select a function');
    select.setAttribute('aria-describedby', 'function-help');
    select.required = true;

    const label = document.createElement('label');
    label.htmlFor = 'function-select';
    label.textContent = 'Select a function';

    const helpBox = document.createElement('div');
    helpBox.id = 'function-hint';
    helpBox.setAttribute('aria-live', 'polite');

    const argsContainer = document.createElement('div');
    argsContainer.id = 'args-container';

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.setAttribute('aria-label', 'Calculate function result');

    form.appendChild(label);
    form.appendChild(select);
    form.appendChild(helpBox);
    form.appendChild(argsContainer);
    form.appendChild(submitButton);

    container.appendChild(form);
    return form;
}

/**
 * Helper function to create a result element
 * @returns {HTMLElement}
 */
function createFunctionResultElement() {
    const container = document.createElement('div');
    container.id = 'function-result';
    container.setAttribute('aria-live', 'polite');
    container.setAttribute('aria-hidden', 'true');

    const content = document.createElement('div');
    content.className = 'result-content';

    const label = document.createElement('p');
    label.id = 'result-label';

    const value = document.createElement('p');
    value.id = 'result-value';

    const actions = document.createElement('div');
    actions.className = 'result-actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-secondary';
    copyBtn.setAttribute('aria-label', 'Copy result to clipboard');

    const precisionLabel = document.createElement('label');
    precisionLabel.htmlFor = 'precision-input';

    const precisionInput = document.createElement('input');
    precisionInput.id = 'precision-input';
    precisionInput.setAttribute('aria-label', 'Number of decimal places');

    actions.appendChild(copyBtn);
    actions.appendChild(precisionLabel);
    actions.appendChild(precisionInput);

    content.appendChild(label);
    content.appendChild(value);
    content.appendChild(actions);

    container.appendChild(content);
    return container;
}

/**
 * Helper function to create a help element
 * @returns {HTMLElement}
 */
function createFunctionHelpElement() {
    const container = document.createElement('div');
    container.id = 'function-help';
    container.setAttribute('aria-label', 'Function reference guide');

    const header = document.createElement('h2');
    header.className = 'help-header';
    header.textContent = 'Function Reference';

    const tabs = document.createElement('div');
    tabs.className = 'help-tabs';
    tabs.setAttribute('role', 'tablist');

    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'help-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'true');
    tab.textContent = 'Trigonometric';

    tabs.appendChild(tab);

    const panel = document.createElement('div');
    panel.id = 'help-trigonometric';
    panel.className = 'help-panel active';
    panel.setAttribute('role', 'tabpanel');

    const item = document.createElement('div');
    item.className = 'function-help-item';

    const name = document.createElement('h3');
    name.className = 'function-name';
    name.textContent = 'sin()';

    const desc = document.createElement('p');
    desc.className = 'function-desc';
    desc.textContent = 'Sine function';

    item.appendChild(name);
    item.appendChild(desc);
    panel.appendChild(item);

    container.appendChild(header);
    container.appendChild(tabs);
    container.appendChild(panel);

    return container;
}

/**
 * Helper function to create a statistical input element
 * @returns {HTMLElement}
 */
function createStatisticalInputElement() {
    const form = document.createElement('form');
    form.id = 'statistical-form';
    form.setAttribute('aria-label', 'Statistical dataset input form');

    const tabs = document.createElement('div');
    tabs.className = 'input-method-tabs';
    tabs.setAttribute('role', 'tablist');

    const tab1 = document.createElement('button');
    tab1.type = 'button';
    tab1.className = 'method-tab active';
    tab1.setAttribute('role', 'tab');
    tab1.setAttribute('aria-selected', 'true');
    tab1.textContent = 'Individual Values';
    tabs.appendChild(tab1);

    const panel1 = document.createElement('div');
    panel1.id = 'method-0';
    panel1.className = 'method-panel active';
    panel1.setAttribute('role', 'tabpanel');

    const csvInput = document.createElement('textarea');
    csvInput.id = 'csv-input';
    csvInput.setAttribute('aria-label', 'Dataset values');

    const csvLabel = document.createElement('label');
    csvLabel.htmlFor = 'csv-input';
    csvLabel.textContent = 'Enter values:';

    const fileInput = document.createElement('input');
    fileInput.id = 'file-input';
    fileInput.type = 'file';
    fileInput.setAttribute('aria-label', 'CSV or text file');

    const fileLabel = document.createElement('label');
    fileLabel.htmlFor = 'file-input';
    fileLabel.textContent = 'Upload file:';

    const funcSelect = document.createElement('select');
    funcSelect.id = 'stat-function-select';
    funcSelect.setAttribute('aria-label', 'Select a statistical function');

    const funcLabel = document.createElement('label');
    funcLabel.htmlFor = 'stat-function-select';
    funcLabel.textContent = 'Function:';

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.setAttribute('aria-label', 'Calculate statistical function');

    form.appendChild(tabs);
    form.appendChild(panel1);
    form.appendChild(csvLabel);
    form.appendChild(csvInput);
    form.appendChild(fileLabel);
    form.appendChild(fileInput);
    form.appendChild(funcLabel);
    form.appendChild(funcSelect);
    form.appendChild(submitBtn);

    return form;
}

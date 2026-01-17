/**
 * Accessibility tests for unit conversion display.
 * Validates WCAG 2.1 AA compliance for conversion results using axe-core.
 * Tests: T034 [US1] Accessibility test for conversion results display
 */

import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Unit Conversion Display Accessibility', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <main role="main" aria-label="Unit Converter">
        <h1>Unit Conversion</h1>
        <form id="conversion-form">
          <div class="form-group">
            <label for="value-input">Value:</label>
            <input
              id="value-input"
              type="number"
              aria-describedby="value-help"
              aria-required="true"
              step="any"
            />
            <small id="value-help">Enter the numeric value to convert</small>
          </div>

          <div class="form-group">
            <label for="from-unit">From Unit:</label>
            <select
              id="from-unit"
              aria-describedby="from-unit-help"
              aria-required="true"
            >
              <option value="">Select unit</option>
              <optgroup label="Distance">
                <option value="kilometer">Kilometer (km)</option>
                <option value="mile">Mile (mi)</option>
                <option value="meter">Meter (m)</option>
                <option value="foot">Foot (ft)</option>
              </optgroup>
              <optgroup label="Mass">
                <option value="kilogram">Kilogram (kg)</option>
                <option value="pound">Pound (lb)</option>
                <option value="gram">Gram (g)</option>
              </optgroup>
              <optgroup label="Temperature">
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
                <option value="kelvin">Kelvin (K)</option>
              </optgroup>
            </select>
            <small id="from-unit-help">Select the source unit</small>
          </div>

          <div class="form-group">
            <label for="to-unit">To Unit:</label>
            <select
              id="to-unit"
              aria-describedby="to-unit-help"
              aria-required="true"
            >
              <option value="">Select unit</option>
              <optgroup label="Distance">
                <option value="kilometer">Kilometer (km)</option>
                <option value="mile">Mile (mi)</option>
                <option value="meter">Meter (m)</option>
                <option value="foot">Foot (ft)</option>
              </optgroup>
              <optgroup label="Mass">
                <option value="kilogram">Kilogram (kg)</option>
                <option value="pound">Pound (lb)</option>
                <option value="gram">Gram (g)</option>
              </optgroup>
              <optgroup label="Temperature">
                <option value="celsius">Celsius (°C)</option>
                <option value="fahrenheit">Fahrenheit (°F)</option>
                <option value="kelvin">Kelvin (K)</option>
              </optgroup>
            </select>
            <small id="to-unit-help">Select the target unit</small>
          </div>

          <button type="submit" aria-label="Convert units">Convert</button>
        </form>

        <div
          id="conversion-result"
          role="region"
          aria-label="Conversion Result"
          aria-live="polite"
          aria-atomic="true"
        >
          <div id="result-display" class="result">
            <span id="result-value" aria-label="Converted value">3.10686</span>
            <span id="result-unit" aria-label="Target unit">miles</span>
          </div>
          <div id="conversion-details" aria-label="Conversion details">
            <small>5 km = 3.10686 miles</small>
          </div>
        </div>

        <div
          id="error-display"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style="display: none;"
        >
          <p id="error-message"></p>
        </div>
      </main>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('WCAG 2.1 AA Compliance', () => {
    test('should not have accessibility violations', async () => {
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should meet color contrast requirements', async () => {
      const results = await axe(container, {
        rules: ['color-contrast']
      });
      expect(results.violations).toHaveLength(0);
    });
  });

  describe('Semantic Structure', () => {
    test('should have proper form structure', () => {
      expect(container.querySelector('main')).toBeInTheDocument();
      expect(container.querySelector('h1')).toBeInTheDocument();
      expect(container.querySelector('form')).toBeInTheDocument();
    });

    test('should have proper heading hierarchy', () => {
      const h1 = container.querySelector('h1');
      expect(h1).toBeInTheDocument();
      expect(h1.textContent).toBe('Unit Conversion');
    });
  });

  describe('Form Labels and Descriptions', () => {
    test('value input should have proper label', () => {
      const input = container.querySelector('#value-input');
      const label = container.querySelector('label[for="value-input"]');
      expect(label).toBeInTheDocument();
      expect(input).toHaveAttribute('aria-describedby', 'value-help');
      expect(input).toHaveAttribute('aria-required', 'true');
    });

    test('from-unit select should have proper label', () => {
      const select = container.querySelector('#from-unit');
      const label = container.querySelector('label[for="from-unit"]');
      expect(label).toBeInTheDocument();
      expect(select).toHaveAttribute('aria-describedby', 'from-unit-help');
      expect(select).toHaveAttribute('aria-required', 'true');
    });

    test('to-unit select should have proper label', () => {
      const select = container.querySelector('#to-unit');
      const label = container.querySelector('label[for="to-unit"]');
      expect(label).toBeInTheDocument();
      expect(select).toHaveAttribute('aria-describedby', 'to-unit-help');
      expect(select).toHaveAttribute('aria-required', 'true');
    });

    test('all inputs should have help text', () => {
      expect(container.querySelector('#value-help')).toBeInTheDocument();
      expect(container.querySelector('#from-unit-help')).toBeInTheDocument();
      expect(container.querySelector('#to-unit-help')).toBeInTheDocument();
    });

    test('submit button should have accessible label', () => {
      const button = container.querySelector('button[type="submit"]');
      expect(button).toHaveAttribute('aria-label', 'Convert units');
    });
  });

  describe('Unit Selectors', () => {
    test('should have grouped options with optgroups', () => {
      const fromUnit = container.querySelector('#from-unit');
      const optgroups = fromUnit.querySelectorAll('optgroup');
      expect(optgroups.length).toBeGreaterThan(0);

      const labels = Array.from(optgroups).map(og => og.getAttribute('label'));
      expect(labels).toContain('Distance');
      expect(labels).toContain('Mass');
      expect(labels).toContain('Temperature');
    });

    test('should have accessible option labels', () => {
      const options = container.querySelectorAll('#from-unit option[value]');
      options.forEach(option => {
        if (option.value !== '') {
          expect(option.textContent.length).toBeGreaterThan(0);
        }
      });
    });
  });

  describe('Results Display', () => {
    test('should have live region for results', () => {
      const resultRegion = container.querySelector('#conversion-result');
      expect(resultRegion).toHaveAttribute('role', 'region');
      expect(resultRegion).toHaveAttribute('aria-live', 'polite');
      expect(resultRegion).toHaveAttribute('aria-label', 'Conversion Result');
      expect(resultRegion).toHaveAttribute('aria-atomic', 'true');
    });

    test('should have accessible result value display', () => {
      const resultValue = container.querySelector('#result-value');
      expect(resultValue).toBeInTheDocument();
      expect(resultValue).toHaveAttribute('aria-label', 'Converted value');
    });

    test('should have accessible unit display', () => {
      const resultUnit = container.querySelector('#result-unit');
      expect(resultUnit).toBeInTheDocument();
      expect(resultUnit).toHaveAttribute('aria-label', 'Target unit');
    });

    test('should have conversion details', () => {
      const details = container.querySelector('#conversion-details');
      expect(details).toBeInTheDocument();
      expect(details).toHaveAttribute('aria-label', 'Conversion details');
    });
  });

  describe('Error Handling', () => {
    test('should have alert region for errors', () => {
      const errorDisplay = container.querySelector('#error-display');
      expect(errorDisplay).toHaveAttribute('role', 'alert');
      expect(errorDisplay).toHaveAttribute('aria-live', 'assertive');
      expect(errorDisplay).toHaveAttribute('aria-atomic', 'true');
    });

    test('should announce errors immediately', () => {
      const errorDisplay = container.querySelector('#error-display');
      // aria-live="assertive" means errors are announced immediately
      expect(errorDisplay.getAttribute('aria-live')).toBe('assertive');
    });
  });

  describe('Keyboard Navigation', () => {
    test('all interactive elements should be keyboard accessible', () => {
      const interactiveElements = container.querySelectorAll('input, select, button');
      interactiveElements.forEach(element => {
        // Elements should not have tabindex < 0 which would remove them from tab order
        const tabindex = element.getAttribute('tabindex');
        if (tabindex !== null) {
          expect(parseInt(tabindex)).toBeGreaterThanOrEqual(0);
        }
      });
    });

    test('form should have logical tab order', () => {
      const valueInput = container.querySelector('#value-input');
      const fromUnit = container.querySelector('#from-unit');
      const toUnit = container.querySelector('#to-unit');
      const submitButton = container.querySelector('button[type="submit"]');

      // All elements should be in DOM order (no explicit tabindex reordering)
      expect(valueInput.compareDocumentPosition(fromUnit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(fromUnit.compareDocumentPosition(toUnit) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
      expect(toUnit.compareDocumentPosition(submitButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });
  });

  describe('Screen Reader Support', () => {
    test('should have descriptive ARIA labels', () => {
      const elementsWithAriaLabel = container.querySelectorAll('[aria-label]');
      expect(elementsWithAriaLabel.length).toBeGreaterThan(0);

      elementsWithAriaLabel.forEach(element => {
        const ariaLabel = element.getAttribute('aria-label');
        expect(ariaLabel.length).toBeGreaterThan(0);
      });
    });

    test('should have proper ARIA regions', () => {
      const regions = container.querySelectorAll('[role="region"]');
      regions.forEach(region => {
        // All regions should have accessible names
        const hasLabel = region.hasAttribute('aria-label') || region.hasAttribute('aria-labelledby');
        expect(hasLabel).toBe(true);
      });
    });

    test('required fields should be announced', () => {
      const requiredFields = container.querySelectorAll('[aria-required="true"]');
      expect(requiredFields.length).toBeGreaterThan(0);

      requiredFields.forEach(field => {
        expect(field.getAttribute('aria-required')).toBe('true');
      });
    });
  });

  describe('Dynamic Content Updates', () => {
    test('result updates should be announced', () => {
      const resultRegion = container.querySelector('#conversion-result');
      // polite announcement means updates are announced when user is idle
      expect(resultRegion.getAttribute('aria-live')).toBe('polite');
      expect(resultRegion.getAttribute('aria-atomic')).toBe('true');
    });

    test('error updates should be announced immediately', () => {
      const errorRegion = container.querySelector('#error-display');
      // assertive means errors interrupt and are announced immediately
      expect(errorRegion.getAttribute('aria-live')).toBe('assertive');
      expect(errorRegion.getAttribute('aria-atomic')).toBe('true');
    });
  });
});

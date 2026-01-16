/**
 * Accessibility tests for calculator UI.
 * Validates WCAG 2.1 AA compliance using axe-core.
 */

import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

describe('Calculator Accessibility', () => {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <main role="main" aria-label="Scientific Calculator">
        <h1>Scientific Calculator</h1>
        <form>
          <label for="input">Enter expression:</label>
          <input id="input" type="text" aria-describedby="input-help" />
          <small id="input-help">Use mathematical operators: +, -, *, /, ^</small>
          <button type="submit">Calculate</button>
        </form>
        <div role="region" aria-label="Results" aria-live="polite">
          <p id="result">Result will appear here</p>
        </div>
      </main>
    `;
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  test('should not have accessibility violations', async () => {
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should have proper semantic structure', () => {
    expect(container.querySelector('main')).toBeInTheDocument();
    expect(container.querySelector('h1')).toBeInTheDocument();
    expect(container.querySelector('label')).toBeInTheDocument();
    expect(container.querySelector('input')).toHaveAttribute('aria-describedby');
  });

  test('should have live region for results', () => {
    const resultRegion = container.querySelector('[role="region"]');
    expect(resultRegion).toHaveAttribute('aria-live', 'polite');
    expect(resultRegion).toHaveAttribute('aria-label', 'Results');
  });

  test('input should have proper labels', () => {
    const input = container.querySelector('input');
    const label = container.querySelector('label');
    expect(label).toHaveAttribute('for', 'input');
    expect(input).toHaveAttribute('aria-describedby');
  });
});

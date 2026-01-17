/**
 * Setup file for accessibility tests using jest-axe.
 * Configures axe-core for WCAG 2.1 AA testing.
 */

const { axe, toHaveNoViolations } = require('jest-axe');

expect.extend(toHaveNoViolations);

/**
 * Global setup for accessibility testing.
 */
beforeEach(() => {
  // Configure axe-core options
  axe.configure({
    rules: [
      {
        id: 'color-contrast',
        enabled: true,
      },
      {
        id: 'aria-required-attr',
        enabled: true,
      },
    ],
  });
});
